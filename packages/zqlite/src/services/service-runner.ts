import type {LogContext} from '@rocicorp/logger';
import {Replicator} from '../replicator/replicator.js';
import type {DurableStorage} from './duped/durable-storage.js';
import {MutagenService} from './duped/mutagen.js';
import {PostgresDB, postgresTypeConfig} from './duped/pg.js';
import {ViewSyncer} from './view-syncer.js';
import postgres from 'postgres';

export class ServiceRunner {
  readonly #replicator: Replicator;
  readonly #viewSyncers: Map<string, ViewSyncer> = new Map();
  readonly #cvrStore: DurableStorage;
  readonly #upstream: PostgresDB;

  constructor(
    cvrStore: DurableStorage,
    pgConnectionString: string,
    sqliteDbPath: string,
  ) {
    this.#replicator = new Replicator(pgConnectionString, sqliteDbPath);
    this.#cvrStore = cvrStore;
    this.#upstream = postgres(pgConnectionString, {
      ...postgresTypeConfig(),
      max: 1,
    });
  }

  getViewSyncer(lc: LogContext, clientGroupID: string) {
    let viewSyncer = this.#viewSyncers.get(clientGroupID);
    if (!viewSyncer) {
      viewSyncer = new ViewSyncer(lc, this.#cvrStore, clientGroupID);
      this.#viewSyncers.set(clientGroupID, viewSyncer);
    }
    return viewSyncer;
  }

  getReplicator() {
    return this.#replicator;
  }

  getMutagen(lc: LogContext, clientGroupID: string) {
    // The MutagenService implementation is stateless. No need to keep a map or share instances.
    return new MutagenService(lc, clientGroupID, this.#upstream);
  }
}
