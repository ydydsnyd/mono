import type {LogContext} from '@rocicorp/logger';
import type {Downstream, Upstream} from 'zero-protocol';
import type {DurableStorage} from '../../storage/durable-storage.js';
import {initStorageSchema} from '../../storage/schema.js';
import type {CancelableAsyncIterable} from '../../types/streams.js';
import type {InvalidationWatcherRegistry} from '../invalidation-watcher/registry.js';
import type {Service} from '../service.js';
import {SCHEMA_MIGRATIONS} from './schema/migrations.js';
import {schemaRoot} from './schema/paths.js';

export const viewShapeUpdateSchema = v.object({
  // TODO: Define
});

export type ViewShapeUpdate = v.Infer<typeof viewShapeUpdateSchema>;

export const viewContentsUpdateSchema = v.object({
  // TODO: Define
});

export type ViewContentsUpdate = v.Infer<typeof viewContentsUpdateSchema>;

export interface ViewSyncerRegistry {
  /**
   * Gets the global ViewSyncer.
   *
   * In v0, everything is running in a single ServiceRunnerDO and thus this will always be
   * an in memory object.
   *
   * When sharding is added, a stub object that communicates with the ViewSyncer in
   * another DO (via rpc / websocket) may be returned.
   *
   * Note that callers should be wary of caching the returned object, as the ViewSyncer may
   * shut down and restart, etc. Generally, the registry should be queried from the registry
   * whenever attempting to communicate with it.
   */
  getViewSyncer(id: string): ViewSyncer;
}

export type SyncContext = {
  clientID: string;
  baseCookie: string | null;
};

export interface ViewSyncer {
  // The SyncContext comes from query parameters.
  sync(
    ctx: SyncContext,
    updates: CancelableAsyncIterable<Upstream>,
  ): Promise<CancelableAsyncIterable<Downstream>>;
}

export class ViewSyncerService implements ViewSyncer, Service {
  readonly id: string;
  readonly #lc: LogContext;
  readonly #storage: DurableStorage;
  readonly #registry: InvalidationWatcherRegistry;

  constructor(
    lc: LogContext,
    clientGroupID: string,
    storage: DurableStorage,
    registry: InvalidationWatcherRegistry,
  ) {
    this.id = clientGroupID;
    this.#lc = lc
      .withContext('component', 'view-syncer')
      .withContext('serviceID', this.id);
    this.#storage = storage;
    this.#registry = registry;
  }

  async run(): Promise<void> {
    await initStorageSchema(
      this.#lc,
      this.#storage,
      schemaRoot,
      SCHEMA_MIGRATIONS,
    );
    // TODO: Implement
    this.#registry;
  }

  sync(
    _ctx: SyncContext,
    _updates: CancelableAsyncIterable<Upstream>,
  ): Promise<CancelableAsyncIterable<Downstream>> {
    throw new Error('todo');
  }

  stop(): Promise<void> {
    throw new Error('todo');
  }
}
