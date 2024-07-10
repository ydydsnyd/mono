import type {LogContext} from '@rocicorp/logger';
import type {DurableStorage} from './duped/durable-storage.js';

export type SyncContext = {
  readonly clientID: string;
  readonly wsID: string;
  readonly baseCookie: string | null;
};

/**
 * SQLite backed view-syncer.
 */
export class ViewSyncer {
  readonly #cvrStore: DurableStorage;
  readonly #clientGroupID: string;
  readonly #lc: LogContext;

  /**
   * @param cvrStore - Durable storage for the view-syncer.
   * @param clientGroupID - Client group ID.
   */
  constructor(lc: LogContext, cvrStore: DurableStorage, clientGroupID: string) {
    this.#cvrStore = cvrStore;
    this.#clientGroupID = clientGroupID;
    this.#lc = lc;
  }
}
