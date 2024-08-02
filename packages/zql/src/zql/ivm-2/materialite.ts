import {must} from 'shared/src/must.js';
import type {Ordering} from '../ast-2/ast.js';
import type {PipelineEntity, Version} from '../ivm/types.js';
import {MemorySource, Source} from './source/source.js';

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

  newMemorySource<T extends PipelineEntity>(order: Ordering, name: string) {
    return new MemorySource<T>(this, order, name);
  }

  tx(fn: () => void) {
    if (this.#currentTx === null) {
      this.#currentTx = this.#version + 1;
    } else {
      // nested transaction
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
