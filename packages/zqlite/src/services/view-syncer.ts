import {Lock} from '@rocicorp/lock';
import type {LogContext} from '@rocicorp/logger';
import {assert} from 'shared/src/asserts.js';
import type {InitConnectionBody} from 'zero-protocol/src/connect.js';
import type {QueriesPatch} from 'zero-protocol/src/queries-patch.js';
import type {AST} from 'zql/src/zql/ast/ast.js';
import type {PipelineEntity} from 'zql/src/zql/ivm/types.js';
import type {TreeView} from 'zql/src/zql/ivm/view/tree-view.js';
import {must} from 'shared/src/must.js';
import type {Connection} from './duped/connection.js';
import {
  CVRConfigDrivenUpdater,
  CVRQueryDrivenUpdater,
  CVRSnapshot,
} from './duped/cvr.js';
import {DurableObjectCVRStore} from './duped/durable-object-cvr-store.js';
import type {DurableStorage} from './duped/durable-storage.js';
import type {PipelineManager} from './pipeline-manager.js';
import {cmpVersions} from './duped/types.js';

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
  readonly #activeClients = new Map<string, Connection | null>();
  readonly #pipelineManager: PipelineManager;
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
  ) {
    this.#storage = cvrStore;
    this.#clientGroupID = clientGroupID;
    this.#lc = lc;
    this.#pipelineManager = pipelineManager;
  }

  addActiveClient(clientID: string) {
    this.#activeClients.set(clientID, null);
  }

  removeActiveClient(clientID: string) {
    const existed = this.#activeClients.delete(clientID);
    this.#pipelineManager.removeConsumer(`${this.#clientGroupID}:${clientID}`);
    assert(existed, 'Client not found');
    return this.#activeClients.size === 0;
  }

  async initConnection(
    syncContext: SyncContext,
    init: InitConnectionBody,
    connection: Connection,
  ) {
    const existing = this.#activeClients.get(syncContext.clientID);
    existing?.close();
    this.#activeClients.set(syncContext.clientID, connection);

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

      const patchesForClients =
        await this.#updateCvrWithFirstQueryRuns(newQueryResults);
    });
  }

  async changeDesiredQueries(syncContext: SyncContext, patch: QueriesPatch) {
    await this.#lock.withLock(async () => {
      const newQueryResults = await this.#patchQueries(syncContext, patch);

      // update CVR with query results
      // flush to clients
    });
  }

  async newQueryResultsReady() {}

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

  #updateCvrWithQueryDeltas() {
    // iterate over PipelineManager and grab CVRs this ViewSyncer cares about.
    // clientGroupId + clientID
    // into a set.
    // Get the new diffs from the pipelines.
    // Update the CVR.
    // Flush the CVR.
    // Accumulate the diffs that we need to send to the client.
    // Unique diffs. Many queries can produce the same diff.
  }

  async #updateCvrWithFirstQueryRuns(
    queryResults: Map<string, TreeView<PipelineEntity>>,
  ) {
    // - get the right cvr version. This is related to `connection` and the `version` of that connection.
    //   minimum.
    // - pull all the component rows from `queryResults`
    // - commit to cvr
    // - flush to clients
    // this function should return what would need to be flushed / poked out to clients...

    const minCvrVersion = [...this.#activeClients.values()]
      .filter((c): c is Connection => c !== null)
      .map(c => c.version())
      .reduce((a, b) => (cmpVersions(a, b) < 0 ? a : b));

    const cvr = must(this.#cvr);
    const doStore = new DurableObjectCVRStore(this.#lc, this.#storage, cvr.id);
    // need lexi version... this can be tracked in `PipelineProvider`
    // as the lexi version if that of the last LSN the queries were run at.
    const updater = new CVRQueryDrivenUpdater(doStore, cvr, version);
  }

  #flushPatchesToClients() {
    // flush accumulated diffs from the cvr step for each connection in active clients.
  }
}
