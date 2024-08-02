import {must} from 'shared/src/must.js';
import type {Source} from './source/source.js';
import type {Version} from './types.js';

/**
 * The only responsibility of this class is to manage transaction boundaries.
 *
 * Transactions exist in the system so Views and Effects know when to notify external
 * observers.
 *
 * As an IVM pipeline runs it can pass through inconsistent states.
 * To prevent those states from being observed, observers are not notified
 * until the transaction is complete.
 *
 * One great example of "inconsistent states" is an update.
 * An update is modeled as a `remove` followed by an `add`.
 * If someone were to observe the `remove` before the `add` they would
 * see the entity as removed when it should have been updated.
 */
export class Materialite {
  #version: Version;
  #dirtySources: Set<Source> = new Set();
  #currentTx: Version | null = null;

  constructor() {
    this.#version = 0;
  }

  getTxVersion() {
    if (this.#currentTx === null) {
      return this.#version + 1;
    }
    return this.#currentTx;
  }

  addDirtySource(source: Source) {
    this.#dirtySources.add(source);
    if (this.#currentTx === null) {
      this.#commit(true);
    }
  }

  tx(fn: () => void) {
    if (this.#currentTx === null) {
      this.#currentTx = this.#version + 1;
    } else {
      // Nested transaction.
      // just run the function as we're already inside the
      // scope of a transaction that will handle rollback and commit.
      fn();
      return;
    }
    try {
      try {
        this._txBegin();
        fn();
      } catch (e) {
        this.#rollback();
        throw e;
      }
      this.#commit();
    } finally {
      this.#dirtySources.clear();
    }
  }

  /**
   * These protected methods are so the SQLite backed implementation can
   * hook into the transaction lifecycle and start/commit/rollback the underlying
   * SQLite transactions.
   */
  protected _txBegin(): void {}
  protected _txCommit(): void {}
  protected _txRollback(): void {}

  #rollback() {
    this.#currentTx = null;
    this._txRollback();
  }

  #commit(autoTx = false) {
    try {
      if (autoTx) {
        this.#currentTx = this.#version + 1;
        this._txBegin();
      }
      this.#version = must(this.#currentTx);
      this.#currentTx = null;

      this._txCommit();
    } catch (e) {
      this.#rollback();
      throw e;
    }

    for (const source of this.#dirtySources) {
      source.commit(this.#version);
    }
  }
}
