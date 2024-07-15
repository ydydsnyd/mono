import type Database from 'better-sqlite3';
import type {ZQLiteContext} from '../context.js';

let lmidStatement: Database.Statement | undefined;

/**
 * Loads LMIDs for a client group from the database and then
 * keeps them up to date in-memory.
 *
 * The replicator calls the LmidTracker with new LMIDs as they arrive.
 */
export class LmidTracker {
  readonly #lmids: Record<string, number> = {};

  constructor(clientGroupId: string, context: ZQLiteContext) {
    // read out the lmids for the current client group.
    if (!lmidStatement) {
      lmidStatement = context.db.prepare(
        `SELECT client_id, lmid FROM _zero_lmid WHERE client_group_id = ?`,
      );
    }

    for (const row of lmidStatement.all(clientGroupId)) {
      this.#lmids[row.clientID] = row.lastMutationID;
    }
  }

  getLmids() {
    return this.#lmids;
  }

  getLmid(clientId: string) {
    return this.#lmids[clientId];
  }

  setLmid(clientId: string, lmid: number) {
    this.#lmids[clientId] = lmid;
  }
}
