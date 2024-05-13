/**
 * Keys can be:
 * - string, numbers or objects
 *
 * Keys that are objects will generally be used to access
 * values in a `SortedIndex` as a `SortedIndex` could be sorted by
 * many keys. An `Object` as a key would represent each field by which the
 * `SortedIndex` is sorted.
 *
 * Has indices will generally only be hashed on a single field.
 * The most common use of as `HashIndex` for `ZQL` will be indices on
 * froeign keys as it doesn't make much sense to sort a foreign key.
 */
export interface Index<K, V> {
  get(key: K): V | undefined;
}

export interface SortedIndex<K, V> extends Index<K, V> {
  after(key: K): IterableIterator<V>;
  before(key: K): IterableIterator<V>;
}

export interface HashIndex<K, V> extends Index<K, V> {}

/**
 * A place to maintain indices to share across ZQL
 * queries.
 *
 * Join & Group-by may ask for an index to speed up
 * their processing or store an index that they create.
 */
export class IndexRepositry {
  readonly #sortedIndices = new Map<string, SortedIndex<unknown, unknown>>();
  readonly #hashIndiecs = new Map<string, Index<unknown, unknown>>();

  addSortedIndex<K, V>(
    collection: string,
    columns: readonly string[],
    index: SortedIndex<K, V>,
  ) {
    this.#sortedIndices.set(makeKey(collection, columns), index);
  }

  addHashIndex<K, V>(
    collection: string,
    columns: readonly string[],
    index: HashIndex<K, V>,
  ) {
    this.#hashIndiecs.set(makeKey(collection, columns), index);
  }

  /**
   * Ask the repository if an index exists.
   *
   * The provided columns array will be return if there's an exact match.
   *
   * If there is no match, an empty column array is returned.
   *
   * If there is a partial match, the prefix of columns that we
   * have an index for is returned.
   */
  // indexExists(collection: string, columns: string[]): string[] {}
  // getBestIndex(collection: string, columns: string[]): string[] {}

  getIndex<K, V>(
    collection: string,
    columns: string[],
  ): Index<K, V> | undefined {
    const key = makeKey(collection, columns);
    const sorted = this.#sortedIndices.get(key);
    if (sorted) {
      return sorted as Index<K, V>;
    }
    const hash = this.#hashIndiecs.get(key);
    if (hash) {
      return hash as Index<K, V>;
    }

    return undefined;
  }

  get numIndices() {
    return this.#sortedIndices.size + this.#hashIndiecs.size;
  }
}

function makeKey(collection: string, columns: readonly string[]) {
  return collection + '-' + columns.join('-');
}
