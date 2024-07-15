import type {LogContext} from '@rocicorp/logger';
import {Replicator} from '../replicator/replicator.js';
import type {DurableStorage} from './duped/durable-storage.js';
import {MutagenService} from './duped/mutagen.js';
import {PostgresDB, postgresTypeConfig} from './duped/pg.js';
import {ViewSyncer} from './view-syncer.js';
import postgres from 'postgres';
import {assert} from '../../../shared/src/asserts.js';
import {Materialite} from '../../../zql/src/zql/ivm/materialite.js';
import {PipelineManager} from './pipeline-manager.js';
import {must} from '../../../shared/src/must.js';
import {LmidTracker} from './lmid-tracker.js';
import type {ZQLiteContext} from '../context.js';

export class ServiceProvider {
  readonly #replicator: Replicator;
  readonly #viewSyncers: Map<string, ViewSyncer> = new Map();
  readonly #cvrStore: DurableStorage;
  readonly #upstream: PostgresDB;
  readonly #pipelineManager: PipelineManager;
  readonly #lmidTracker = new Map<string, LmidTracker>();
  #zqliteContext: ZQLiteContext | undefined;

  constructor(
    cvrStore: DurableStorage,
    pgConnectionString: string,
    sqliteDbPath: string,
  ) {
    this.#cvrStore = cvrStore;
    this.#upstream = postgres(pgConnectionString, {
      ...postgresTypeConfig(),
      max: 1,
    });

    const materialite = new Materialite();
    this.#pipelineManager = new PipelineManager();
    this.#replicator = new Replicator(
      materialite,
      pgConnectionString,
      sqliteDbPath,
    );
  }

  async start(lc: LogContext) {
    lc.debug?.('Starting ServiceProvider');
    const context = await this.#replicator.start(this, lc);
    this.#zqliteContext = context;
    this.#pipelineManager.setContext(context);
    lc.debug?.('Started ServiceProvider');
  }

  getViewSyncer(lc: LogContext, clientGroupID: string) {
    let viewSyncer = this.#viewSyncers.get(clientGroupID);
    let lmidTracker = this.#lmidTracker.get(clientGroupID);
    if (!lmidTracker) {
      lmidTracker = new LmidTracker(clientGroupID, must(this.#zqliteContext));
    }
    if (!viewSyncer) {
      viewSyncer = new ViewSyncer(
        lc,
        this.#cvrStore,
        clientGroupID,
        must(this.#pipelineManager),
        lmidTracker,
      );
      this.#viewSyncers.set(clientGroupID, viewSyncer);
    }
    return viewSyncer;
  }

  returnViewSyncer(clientGroupID: string, clientID: string) {
    const viewSyncer = this.#viewSyncers.get(clientGroupID);
    assert(viewSyncer, 'ViewSyncer not found');
    if (viewSyncer.deleteClient(clientID)) {
      this.#viewSyncers.delete(clientGroupID);
    }
  }

  maybeGetLmidTracker(clientGroupId: string) {
    return this.#lmidTracker.get(clientGroupId);
  }

  mapViewSyncers<R>(cb: (viewSyncer: ViewSyncer) => R) {
    const ret: R[] = [];
    for (const viewSyncer of this.#viewSyncers.values()) {
      ret.push(cb(viewSyncer));
    }

    return ret;
  }

  getMutagen(lc: LogContext, clientGroupID: string) {
    // The MutagenService implementation is stateless. No need to keep a map or share instances.
    return new MutagenService(lc, clientGroupID, this.#upstream);
  }
}
