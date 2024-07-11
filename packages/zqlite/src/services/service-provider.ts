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

export class ServiceProvider {
  readonly #replicator: Replicator;
  readonly #viewSyncers: Map<string, ViewSyncer> = new Map();
  readonly #cvrStore: DurableStorage;
  readonly #upstream: PostgresDB;
  #pipelineManager: PipelineManager | undefined;

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
    this.#replicator = new Replicator(
      materialite,
      pgConnectionString,
      sqliteDbPath,
    );
  }

  async start(lc: LogContext) {
    const context = await this.#replicator.start(this, lc);
    this.#pipelineManager = new PipelineManager(context);
  }

  getViewSyncer(lc: LogContext, clientGroupID: string, clientID: string) {
    let viewSyncer = this.#viewSyncers.get(clientGroupID);
    if (!viewSyncer) {
      viewSyncer = new ViewSyncer(
        lc,
        this.#cvrStore,
        clientGroupID,
        must(this.#pipelineManager),
      );
      this.#viewSyncers.set(clientGroupID, viewSyncer);
    }
    viewSyncer.addActiveClient(clientID);
    return viewSyncer;
  }

  returnViewSyncer(clientGroupID: string, clientID: string) {
    const viewSyncer = this.#viewSyncers.get(clientGroupID);
    assert(viewSyncer, 'ViewSyncer not found');
    if (viewSyncer.removeActiveClient(clientID)) {
      this.#viewSyncers.delete(clientGroupID);
    }
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
