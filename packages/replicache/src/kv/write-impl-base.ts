import {compareUTF8} from 'compare-utf8';
import type {ReadonlyJSONValue} from 'shared/src/json.js';
import {
  promiseFalse,
  promiseTrue,
  promiseVoid,
} from 'shared/src/resolved-promises.js';
import {
  FrozenJSONValue,
  deepFreeze,
  deepFreezeAllowUndefined,
} from '../frozen-json.js';
import type {Read} from './store.js';

export const deleteSentinel = Symbol();
type DeleteSentinel = typeof deleteSentinel;

export class WriteImplBase {
  protected readonly _pending: Map<string, FrozenJSONValue | DeleteSentinel> =
    new Map();
  readonly #read: Read;

  constructor(read: Read) {
    this.#read = read;
  }

  has(key: string): Promise<boolean> {
    switch (this._pending.get(key)) {
      case undefined:
        return this.#read.has(key);
      case deleteSentinel:
        return promiseFalse;
      default:
        return promiseTrue;
    }
  }

  async get(key: string): Promise<FrozenJSONValue | undefined> {
    const v = this._pending.get(key);
    switch (v) {
      case deleteSentinel:
        return undefined;
      case undefined: {
        const v = await this.#read.get(key);
        return deepFreezeAllowUndefined(v);
      }
      default:
        return v;
    }
  }

  async getRange(
    startKey: string,
    endKey: string,
  ): Promise<Map<string, ReadonlyJSONValue>> {
    const storedMap = await this.#read.getRange(startKey, endKey);

    const newPendingEntries: [string, ReadonlyJSONValue][] = [];
    /// TODO(arv): forEach
    this._pending.forEach((value, key) => {
      if (key < startKey || key > endKey) {
        return;
      }
      if (value === deleteSentinel) {
        storedMap.delete(key);
        return;
      }

      if (storedMap.has(key)) {
        // Overwrite, no need to resort
        storedMap.set(key, value);
        return;
      }

      newPendingEntries.push([key, value]);
    });

    if (newPendingEntries.length === 0) {
      return storedMap;
    }

    // storedEntries are already sorted
    // sort newPendingEntries
    // merge the two arrays

    const storedEntries = [...storedMap];
    newPendingEntries.sort((e1, e2) => compareUTF8(e1[0], e2[0]));
    const result: Map<string, ReadonlyJSONValue> = new Map();
    let storedIndex = 0;
    let pendingIndex = 0;

    for (
      ;
      storedIndex < storedEntries.length &&
      pendingIndex < newPendingEntries.length;

    ) {
      const storedEntry = storedEntries[storedIndex];
      const pendingEntry = newPendingEntries[pendingIndex];

      if (compareUTF8(storedEntry[0], pendingEntry[0]) < 0) {
        result.set(storedEntry[0], storedEntry[1]);
        storedIndex++;
      } else {
        result.set(pendingEntry[0], pendingEntry[1]);
        pendingIndex++;
      }
      // never equal because we took care of that when looping over pending.
    }

    return result;
  }

  put(key: string, value: ReadonlyJSONValue): Promise<void> {
    this._pending.set(key, deepFreeze(value));
    return promiseVoid;
  }

  del(key: string): Promise<void> {
    this._pending.set(key, deleteSentinel);
    return promiseVoid;
  }

  release(): void {
    this.#read.release();
  }

  get closed(): boolean {
    return this.#read.closed;
  }
}
