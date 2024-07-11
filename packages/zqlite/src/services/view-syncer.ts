import type {LogContext} from '@rocicorp/logger';
import {assert} from '../../../shared/src/asserts.js';
import type {ChangeDesiredQueriesMessage} from '../../../zero-protocol/src/change-desired-queries.js';
import type {InitConnectionMessage} from '../../../zero-protocol/src/connect.js';
import type {Connection} from './duped/connection.js';
import type {DurableStorage} from './duped/durable-storage.js';
import type {PipelineManager} from './pipeline-manager.js';

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
  readonly #cvrStore: DurableStorage;
  readonly #clientGroupID: string;
  readonly #lc: LogContext;
  readonly #activeClients = new Map<string, Connection | null>();
  readonly #pipelineManager: PipelineManager;

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
    this.#cvrStore = cvrStore;
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

  initConnection(
    syncContext: SyncContext,
    _message: InitConnectionMessage,
    connection: Connection,
  ) {
    const existing = this.#activeClients.get(syncContext.clientID);
    assert(existing === null, 'Client already has an associated connection');
    this.#activeClients.set(syncContext.clientID, connection);

    // do the thing.
  }

  changeDesiredQueries(
    _syncContext: SyncContext,
    _message: ChangeDesiredQueriesMessage,
  ) {}

  updateCvrWithNewQueryResults() {
    // iterate over PipelineManager and grab CVRs this ViewSyncer cares about.
    // clientGroupId + clientID
    // into a set.
    // Get the new diffs from the pipelines.
    // Update the CVR.
    // Flush the CVR.
    // Accumulate the diffs that we need to send to the client.
    // Unique diffs. Many queries can produce the same diff.
  }

  flushChangesToClients() {
    // flush accumulated diffs from the cvr step for each connection in active clients.
  }
}
