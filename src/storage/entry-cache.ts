import type { JSONValue } from "replicache";
import type * as z from "superstruct";
import type { JSONType } from "../protocol/json.js";
import type { Patch } from "../protocol/poke.js";
import type { Storage } from "./storage.js";

/**
 * Implements a read/write cache for key/value pairs on top of some lower-level
 * storage.
 *
 * This is designed to be stacked: EntryCache itself implements Storage so that
 * you can create multiple layers of caches and control when they flush.
 *
 * TODO: We can remove the read side of this since DO does caching itself internally!
 */
export class EntryCache implements Storage {
  private _storage: Storage;
  private _cache: Map<string, { value?: JSONValue; dirty: boolean }> =
    new Map();

  constructor(storage: Storage) {
    this._storage = storage;
  }

  async put<T extends JSONValue>(key: string, value: T): Promise<void> {
    this._cache.set(key, { value, dirty: true });
  }
  async del(key: string): Promise<void> {
    this._cache.set(key, { value: undefined, dirty: true });
  }
  async get<T extends JSONValue>(
    key: string,
    schema: z.Struct<T>
  ): Promise<T | undefined> {
    const cached = this._cache.get(key);
    if (cached) {
      // We don't validate on cache hits partly for perf reasons and also
      // because we should have already validated with same schema during
      // initial read.
      return cached.value as T | undefined;
    }
    const value = await this._storage.get(key, schema);
    this._cache.set(key, { value, dirty: false });
    return value;
  }

  pending(): Patch {
    const res: Patch = [];
    for (const [key, { value, dirty }] of this._cache.entries()) {
      if (dirty) {
        if (value === undefined) {
          res.push({ op: "del", key });
        } else {
          res.push({ op: "put", key, value: value as JSONType });
        }
      }
    }
    return res;
  }

  async flush(): Promise<void> {
    await Promise.all(
      [...this._cache.entries()]
        // Destructure ALL the things
        .filter(([, { dirty }]) => dirty)
        .map(([k, { value }]) => {
          if (value === undefined) {
            return this._storage.del(k);
          } else {
            return this._storage.put(k, value);
          }
        })
    );
  }
}
