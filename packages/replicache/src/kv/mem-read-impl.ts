import {compareUTF8} from 'compare-utf8';
import type {FrozenJSONValue} from '../frozen-json.js';
import type {Read} from './store.js';

export class MemReadImpl implements Read {
  readonly #map: Map<string, FrozenJSONValue>;
  readonly #release: () => void;
  #closed = false;

  constructor(map: Map<string, FrozenJSONValue>, release: () => void) {
    this.#map = map;
    this.#release = release;
  }

  release() {
    this.#release();
    this.#closed = true;
  }

  get closed(): boolean {
    return this.#closed;
  }

  getRange(
    firstKey: string,
    lastKey: string,
  ): Promise<Map<string, FrozenJSONValue>> {
    const entries: [string, FrozenJSONValue][] = [];
    this.#map.forEach((v, k) => {
      if (k >= firstKey && k <= lastKey) {
        entries.push([k, v]);
      }
    });
    entries.sort((a, b) => compareUTF8(a[0], b[0]));
    return Promise.resolve(new Map(entries));
  }

  has(key: string): Promise<boolean> {
    return Promise.resolve(this.#map.has(key));
  }

  get(key: string): Promise<FrozenJSONValue | undefined> {
    return Promise.resolve(this.#map.get(key));
  }
}
