import {promiseVoid} from 'shared/src/resolved-promises.js';
import type {FrozenJSONValue} from '../frozen-json.js';
import {MemReadImpl} from './mem-read-impl.js';
import type {Write} from './store.js';
import {deleteSentinel, WriteImplBase} from './write-impl-base.js';

export class MemWriteImpl extends WriteImplBase implements Write {
  readonly #map: Map<string, FrozenJSONValue>;

  constructor(map: Map<string, FrozenJSONValue>, release: () => void) {
    super(new MemReadImpl(map, release));
    this.#map = map;
  }

  commit(): Promise<void> {
    // HOT. Do not allocate entry tuple and destructure.
    this._pending.forEach((value, key) => {
      if (value === deleteSentinel) {
        this.#map.delete(key);
      } else {
        this.#map.set(key, value);
      }
    });
    this._pending.clear();
    this.release();
    return promiseVoid;
  }
}
