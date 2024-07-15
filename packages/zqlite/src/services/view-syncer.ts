import {Lock} from '@rocicorp/lock';
import type {LogContext} from '@rocicorp/logger';
import type {InitConnectionBody} from 'zero-protocol/src/connect.js';
import type {QueriesPatch} from 'zero-protocol/src/queries-patch.js';
import type {AST} from 'zql/src/zql/ast/ast.js';
import {isJoinResult, PipelineEntity} from 'zql/src/zql/ivm/types.js';
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
import {CustomKeyMap} from 'shared/src/custom-key-map.js';
import {rowIDHash} from './duped/row-key.js';
import type {JSONObject, JSONValue} from 'shared/src/json.js';

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

    return downstream;
  }

  async changeDesiredQueries(syncContext: SyncContext, patch: QueriesPatch) {
    await this.#lock.withLock(async () => {
      const newQueryResults = await this.#patchQueries(syncContext, patch);
      await this.#updateCvrAndClientsWithFirstQueryRuns(newQueryResults);
    });
  }

  async newQueryDeltasReady() {
    await this.#lock.withLock(async () => {
      await this.#updateCvrAndClientsWithQueryDeltas();
    });
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

  async #updateCvrAndClientsWithQueryDeltas() {
    //
    // 1. loop over all queries related to us from PipelineManager
    // 2. keep only those with diffs
    // 3. trackQueries for those
    // 4. pass +mult to `updater.received`
    // 5. manually delete unreferenced row when seeing -mult e.g., `deleteUnreferencedColumnsAndRows`
    // 6. `generateConfigPatches` : lc.debug?.(`generating config patches`);
    // 7. Commit the changes and update the CVR snapshot.
    // 8. Signal clients to commit.
    // don't forget LMID throw-in
    //
    // Can we merge remove and add?
    // Or just don't worry about it and see what
    // happens?
  }

  async #updateCvrAndClientsWithFirstQueryRuns(
    queryResults: Map<string, TreeView<PipelineEntity>>,
  ) {
    const lc = this.#lc;
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

    const pokers = [...this.#clients.values()].map(c => {
      console.log('START POKE!!!;');
      return c.startPoke(cvrVersion);
    });

    const queriesDone = [...queryResults.entries()].map(
      async ([queryId, view]) => {
        const rows = parseFirstRunResults(queryId, view);
        const patches = await updater.received(lc, rows);

        console.log('adding patches', patches);
        patches.forEach(patch => pokers.forEach(p => p.addPatch(patch)));
      },
    );

    pokers.forEach(p => p.setLmids(this.#lmidTracker.getLmids()));

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
    console.log('END POKE!');
    pokers.forEach(poker => poker.end());
  }
}

function parseFirstRunResults(
  queryId: string,
  view: TreeView<PipelineEntity>,
): Map<RowID, ParsedRow> {
  const ret = new CustomKeyMap<RowID, ParsedRow>(rowIDHash);
  for (const row of view.data.keys()) {
    // dive into the row to pull out component parts if needed
    if (isJoinResult(row)) {
      for (const [k, v] of Object.entries(row)) {
        if (k === 'id') {
          continue;
        }
        if (v === undefined) {
          continue;
        }
        // TODO: handle aliases in join. This assumes k = table name
        parseSingleRow(queryId, ret, k, v as unknown as PipelineEntity);
      }
    } else {
      parseSingleRow(queryId, ret, view.name, row);
    }
  }
  return ret;
}

function parseSingleRow(
  queryId: string,
  ret: CustomKeyMap<RowID, ParsedRow>,
  table: string,
  row: PipelineEntity,
) {
  if (row.id === undefined) {
    return;
  }

  // THIS IS WRONG. We can have many aggregations on a single row!
  // see parallel comment in `pipeline-builder` ^^
  const sourceRows = (row as TODO).__source_rows;
  if (sourceRows !== undefined) {
    const source = (row as TODO).__source as string;
    for (const row of sourceRows) {
      const [rowId, parsedRow] = parseSingleRowNoAggregates(
        queryId,
        source,
        row,
      );
      const existing = ret.get(rowId);
      if (existing) {
        existing.record.queriedColumns ??= {};
        existing.record.queriedColumns[queryId] =
          parsedRow.record.queriedColumns?.[queryId] ?? [];
      } else {
        ret.set(rowId, parsedRow);
      }
    }
  }
  const [rowId, parsedRow] = parseSingleRowNoAggregates(queryId, table, row);
  const existing = ret.get(rowId);
  if (existing) {
    existing.record.queriedColumns ??= {};
    existing.record.queriedColumns[queryId] =
      parsedRow.record.queriedColumns?.[queryId] ?? [];
  } else {
    ret.set(rowId, parsedRow);
  }
}

function parseSingleRowNoAggregates(
  queryId: string,
  table: string,
  row: PipelineEntity,
): [RowID, ParsedRow] {
  const rowId: RowID = {
    schema: 'public',
    table,
    rowKey: {
      id: row.id as JSONValue,
    },
  };
  return [
    rowId,
    {
      record: {
        id: rowId,
        rowVersion: row._0_version as string,
        queriedColumns: {[queryId]: Object.keys(row)},
      },
      contents: row as JSONObject,
    },
  ];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any;
