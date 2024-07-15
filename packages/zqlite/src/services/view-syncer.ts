import {Lock} from '@rocicorp/lock';
import type {LogContext} from '@rocicorp/logger';
import type {InitConnectionBody} from 'zero-protocol/src/connect.js';
import type {QueriesPatch} from 'zero-protocol/src/queries-patch.js';
import type {AST} from 'zql/src/zql/ast/ast.js';
import type {PipelineEntity} from 'zql/src/zql/ivm/types.js';
import type {TreeView} from 'zql/src/zql/ivm/view/tree-view.js';
import {must} from 'shared/src/must.js';
import {
  CVRConfigDrivenUpdater,
  CVRQueryDrivenUpdater,
  CVRSnapshot,
  ParsedRow,
} from './duped/cvr.js';
import {DurableObjectCVRStore} from './duped/durable-object-cvr-store.js';
import type {DurableStorage} from './duped/durable-storage.js';
import type {PipelineManager} from './pipeline-manager.js';
import {cmpVersions, RowID} from './duped/types.js';
import {toLexiVersion} from 'zqlite-zero-cache-shared/src/lsn.js';
import {ClientHandler} from './duped/client-handler.js';
import {Subscription} from './duped/subscription.js';
import type {Downstream} from 'zero-protocol/src/down.js';
import type {LmidTracker} from './lmid-tracker.js';

export type SyncContext = {
  readonly clientID: string;
  readonly wsID: string;
  readonly baseCookie: string | null;
};

export type GroupAndClientIDStr = `${string}:${string}`;

/**
 * SQLite backed view-syncer.
 */
export class ViewSyncer {
  readonly #storage: DurableStorage;
  // Two operations are still async:
  // 1. Updating the CVR (this will become synchronous in the future)
  // 2. Flushing to clients (always async)
  // We should serialize these operations so we don't end up writing out of order
  // for a given client group.
  readonly #lock = new Lock();

  readonly #clientGroupID: string;
  readonly #lc: LogContext;
  readonly #clients = new Map<string, ClientHandler>();
  readonly #pipelineManager: PipelineManager;
  readonly #lmidTracker: LmidTracker;
  #cvr: CVRSnapshot | undefined;

  /**
   * @param cvrStore - Durable storage for the view-syncer.
   * @param clientGroupID - Client group ID.
   */
  constructor(
    lc: LogContext,
    cvrStore: DurableStorage,
    clientGroupID: string,
    pipelineManager: PipelineManager,
    lmidTracker: LmidTracker,
  ) {
    this.#storage = cvrStore;
    this.#clientGroupID = clientGroupID;
    this.#lc = lc;
    this.#pipelineManager = pipelineManager;
    this.#lmidTracker = lmidTracker;
  }

  deleteClient(clientID: string) {
    this.#clients.delete(clientID);
    this.#pipelineManager.removeConsumer(`${this.#clientGroupID}:${clientID}`);
    return this.#clients.size === 0;
  }

  async initConnection(syncContext: SyncContext, init: InitConnectionBody) {
    const {clientID, wsID, baseCookie} = syncContext;
    const existing = this.#clients.get(clientID);
    existing?.close();

    const lc = this.#lc
      .withContext('clientID', clientID)
      .withContext('wsID', wsID);
    lc.debug?.('initConnection', init);

    const downstream = Subscription.create<Downstream>({
      cleanup: (_, err) => {
        err
          ? lc.error?.(`client closed with error`, err)
          : lc.info?.('client closed');
      },
    });

    const client = new ClientHandler(
      this.#lc,
      this.#clientGroupID,
      clientID,
      wsID,
      baseCookie,
      downstream,
    );

    this.#clients.set(syncContext.clientID, client);

    await this.#lock.withLock(async () => {
      if (this.#cvr === undefined) {
        const doStore = new DurableObjectCVRStore(
          this.#lc,
          this.#storage,
          this.#clientGroupID,
        );
        this.#cvr = await doStore.load();
      }
      const newQueryResults = await this.#patchQueries(
        syncContext,
        init.desiredQueriesPatch,
      );

      await this.#updateCvrAndClientsWithFirstQueryRuns(newQueryResults);
    });
  }

  async changeDesiredQueries(syncContext: SyncContext, patch: QueriesPatch) {
    await this.#lock.withLock(async () => {
      const newQueryResults = await this.#patchQueries(syncContext, patch);
      await this.#updateCvrAndClientsWithFirstQueryRuns(newQueryResults);
    });
  }

  async newQueryDeltasReady() {
    // TODO: process LMID here
    // 1. stick it into PipelineManager
    // await this.#lock.withLock(async () => {
    //   this.#pipelineManager.getPipelinesFor();
    // });
  }

  async #patchQueries(syncContext: SyncContext, patch: QueriesPatch) {
    // 1. register with pipeline manager
    // 2. update cvr (but only based on current patch set of queries)
    // 3. flush to client (but only for current query set)
    const cvr = must(this.#cvr);
    const doStore = new DurableObjectCVRStore(this.#lc, this.#storage, cvr.id);
    const updater = new CVRConfigDrivenUpdater(doStore, cvr);
    const queriesToGetResultsFor = new Map<string, AST>();
    const queriesToDrop = new Set<string>();

    for (const op of patch) {
      switch (op.op) {
        case 'put': {
          const impactedQueries = updater.putDesiredQueries(
            syncContext.clientID,
            {[op.hash]: op.ast},
          );
          for (const q of impactedQueries) {
            queriesToGetResultsFor.set(q.id, q.ast);
          }

          break;
        }
        case 'clear':
          updater.clearDesiredQueries(syncContext.clientID);
          queriesToDrop.clear();
          queriesToGetResultsFor.clear();
          this.#pipelineManager.removeConsumer(
            `${this.#clientGroupID}:${syncContext.clientID}`,
          );
          break;
        case 'del':
          updater.deleteDesiredQueries(syncContext.clientID, [op.hash]);
          queriesToDrop.add(op.hash);
          break;
      }
    }

    for (const hash of queriesToDrop) {
      queriesToGetResultsFor.delete(hash);
    }
    this.#cvr = await updater.flush(this.#lc);

    const newQueryResults = new Map<string, TreeView<PipelineEntity>>();
    for (const [hash, ast] of queriesToGetResultsFor) {
      const view = this.#pipelineManager.getOrCreatePipeline(
        `${this.#clientGroupID}:${syncContext.clientID}`,
        hash,
        ast,
      );
      newQueryResults.set(hash, view);
    }

    return newQueryResults;
  }

  #updateCvrAndClientsWithQueryDeltas() {
    // iterate over PipelineManager and grab CVRs this ViewSyncer cares about.
    // clientGroupId + clientID
    // into a set.
    // Get the new diffs from the pipelines.
    // Update the CVR.
    // Flush the CVR.
    // Accumulate the diffs that we need to send to the client.
    // Unique diffs. Many queries can produce the same diff.
    //
    // TODO: deal with LMID changes
    // coming in over the replication stream...
    // We'd need to create a query for each client that selects the LMID.
    //
    //
    // TODO: deal with our row format not matching
    // expectations of client-handler
  }

  async #updateCvrAndClientsWithFirstQueryRuns(
    queryResults: Map<string, TreeView<PipelineEntity>>,
  ) {
    const lc = this.#lc;
    // - get the right cvr version. This is related to `connection` and the `version` of that connection.
    //   minimum.
    // - pull all the component rows from `queryResults`
    // - commit to cvr
    // - flush to clients
    // this function should return what would need to be flushed / poked out to clients...

    const minCvrVersion = [...this.#clients.values()]
      .filter((c): c is ClientHandler => c !== null)
      .map(c => c.version())
      .reduce((a, b) => (cmpVersions(a, b) < 0 ? a : b));

    const cvr = must(this.#cvr);
    const doStore = new DurableObjectCVRStore(this.#lc, this.#storage, cvr.id);
    const updater = new CVRQueryDrivenUpdater(
      doStore,
      cvr,
      toLexiVersion(this.#pipelineManager.context.lsn),
    );
    const cvrVersion = updater.trackQueries(
      this.#lc,
      [...queryResults.keys()].map(k => ({id: k, transformationHash: k})),
      Object.values(cvr.queries)
        .filter(q => !q.internal && Object.keys(q.desiredBy).length === 0)
        .map(q => q.id),
      minCvrVersion,
    );

    const pokers = [...this.#clients.values()].map(c =>
      c.startPoke(cvrVersion),
    );

    const queriesDone = [...queryResults.values()].map(async view => {
      const rows = parseFirstRunResults(view);
      const patches = await updater.received(lc, rows);
      patches.forEach(patch => pokers.forEach(p => p.addPatch(patch)));
    });
    await Promise.all(queriesDone);

    for (const patch of await updater.deleteUnreferencedColumnsAndRows(lc)) {
      pokers.forEach(p => p.addPatch(patch));
    }
    for (const patch of await updater.generateConfigPatches(lc)) {
      pokers.forEach(poker => poker.addPatch(patch));
    }

    // Commit the changes and update the CVR snapshot.
    this.#cvr = await updater.flush(lc);

    // Signal clients to commit.
    pokers.forEach(poker => poker.end());
  }
}

function parseFirstRunResults(
  view: TreeView<PipelineEntity>,
): Map<RowID, ParsedRow> {
  // source name
  // schema
  // ...
  return new Map();
}

// TODO: lmid stuff over replication log...
