import {RWLock} from '@rocicorp/lock';
import {assert} from 'shared/asserts.js';
import type {CreateChunk} from '../dag/chunk.js';
import type * as dag from '../dag/mod.js';
import type {FormatVersion} from '../format-version.js';
import {Hash, emptyHash, newUUIDHash} from '../hash.js';
import type {FrozenJSONValue, ReadonlyJSONValue} from '../json.js';
import {getSizeOfEntry} from '../size-of-value.js';
import {
  DataNodeImpl,
  Entry,
  InternalDiffOperation,
  InternalNodeImpl,
  createNewInternalEntryForNode,
  emptyDataNode,
  isDataNodeImpl,
  newNodeImpl,
  partition,
  toChunkData,
} from './node.js';
import {BTreeRead, diffNodes} from './read.js';

export class BTreeWrite extends BTreeRead {
  /**
   * This rw lock is used to ensure we do not mutate the btree in parallel. It
   * would be a problem if we didn't have the lock in cases like this:
   *
   * ```ts
   * const p1 = tree.put('a', 0);
   * const p2 = tree.put('b', 1);
   * await p1;
   * await p2;
   * ```
   *
   * because both `p1` and `p2` would start from the old root hash but a put
   * changes the root hash so the two concurrent puts would lead to only one of
   * them actually working, and it is not deterministic which one would finish
   * last.
   */
  private readonly _lock = new RWLock();
  private readonly _modified: Map<Hash, DataNodeImpl | InternalNodeImpl> =
    new Map();

  protected declare _dagRead: dag.Write;

  readonly minSize: number;
  readonly maxSize: number;

  constructor(
    dagWrite: dag.Write,
    formatVersion: FormatVersion,
    root: Hash = emptyHash,
    minSize = 8 * 1024,
    maxSize = 16 * 1024,
    getEntrySize: <K, V>(k: K, v: V) => number = getSizeOfEntry,
    chunkHeaderSize?: number,
  ) {
    super(dagWrite, formatVersion, root, getEntrySize, chunkHeaderSize);

    this.minSize = minSize;
    this.maxSize = maxSize;
  }

  getNode(hash: Hash): Promise<DataNodeImpl | InternalNodeImpl> {
    const node = this._modified.get(hash);
    if (node) {
      return Promise.resolve(node);
    }
    return super.getNode(hash);
  }

  protected override _chunkEntriesToTreeEntries<V>(
    entries: readonly Entry<V>[],
  ): Entry<V>[] {
    // Remove readonly modifier.
    // TODO(arv): Is this safe?
    return entries as Entry<V>[];
  }

  private _addToModified(node: DataNodeImpl | InternalNodeImpl): void {
    assert(node.isMutable);
    this._modified.set(node.hash, node);
  }

  updateNode(node: DataNodeImpl | InternalNodeImpl): void {
    assert(node.isMutable);
    this._modified.delete(node.hash);
    node.hash = newUUIDHash();
    this._addToModified(node);
  }

  newInternalNodeImpl(
    entries: Array<Entry<Hash>>,
    level: number,
  ): InternalNodeImpl {
    const n = new InternalNodeImpl(entries, newUUIDHash(), level, true);
    this._addToModified(n);
    return n;
  }

  newDataNodeImpl(entries: Entry<FrozenJSONValue>[]): DataNodeImpl {
    const n = new DataNodeImpl(entries, newUUIDHash(), true);
    this._addToModified(n);
    return n;
  }

  newNodeImpl(entries: Entry<FrozenJSONValue>[], level: number): DataNodeImpl;
  newNodeImpl(entries: Entry<Hash>[], level: number): InternalNodeImpl;
  newNodeImpl(
    entries: Entry<Hash>[] | Entry<FrozenJSONValue>[],
    level: number,
  ): InternalNodeImpl | DataNodeImpl;
  newNodeImpl(
    entries: Entry<Hash>[] | Entry<FrozenJSONValue>[],
    level: number,
  ): InternalNodeImpl | DataNodeImpl {
    const n = newNodeImpl(entries, newUUIDHash(), level, true);
    this._addToModified(n);
    return n;
  }

  override get(key: string): Promise<FrozenJSONValue | undefined> {
    return this._lock.withRead(() => super.get(key));
  }

  override has(key: string): Promise<boolean> {
    return this._lock.withRead(() => super.has(key));
  }

  override isEmpty(): Promise<boolean> {
    return this._lock.withRead(() => super.isEmpty());
  }

  put(key: string, value: FrozenJSONValue): Promise<void> {
    return this._lock.withWrite(async () => {
      const oldRootNode = await this.getNode(this.rootHash);
      const entrySize = this.getEntrySize(key, value);
      const rootNode = await oldRootNode.set(key, value, entrySize, this);

      // We do the rebalancing in the parent so we need to do it here as well.
      if (rootNode.getChildNodeSize(this) > this.maxSize) {
        const headerSize = this.chunkHeaderSize;
        const partitions = partition(
          rootNode.entries,
          value => value[2],
          this.minSize - headerSize,
          this.maxSize - headerSize,
        );
        const {level} = rootNode;
        const entries: Entry<Hash>[] = partitions.map(entries => {
          const node = this.newNodeImpl(entries, level);
          return createNewInternalEntryForNode(node, this.getEntrySize);
        });
        const newRoot = this.newInternalNodeImpl(entries, level + 1);
        this.rootHash = newRoot.hash;
        return;
      }

      this.rootHash = rootNode.hash;
    });
  }

  del(key: string): Promise<boolean> {
    return this._lock.withWrite(async () => {
      const oldRootNode = await this.getNode(this.rootHash);
      const newRootNode = await oldRootNode.del(key, this);

      // No need to rebalance here since if root gets too small there is nothing
      // we can do about that.
      const found = this.rootHash !== newRootNode.hash;
      if (found) {
        // Flatten one layer.
        if (newRootNode.level > 0 && newRootNode.entries.length === 1) {
          this.rootHash = (newRootNode as InternalNodeImpl).entries[0][1];
        } else {
          this.rootHash = newRootNode.hash;
        }
      }

      return found;
    });
  }

  clear(): Promise<void> {
    return this._lock.withWrite(() => {
      this._modified.clear();
      this.rootHash = emptyHash;
    });
  }

  flush(): Promise<Hash> {
    return this._lock.withWrite(async () => {
      const dagWrite = this._dagRead;

      if (this.rootHash === emptyHash) {
        // Write a chunk for the empty tree.
        const chunk = dagWrite.createChunk(emptyDataNode, []);
        await dagWrite.putChunk(chunk as dag.Chunk<ReadonlyJSONValue>);
        return chunk.hash;
      }

      const newChunks: dag.Chunk[] = [];
      const newRoot = gatherNewChunks(
        this.rootHash,
        newChunks,
        dagWrite.createChunk,
        this._modified,
        this._formatVersion,
      );
      await Promise.all(newChunks.map(chunk => dagWrite.putChunk(chunk)));
      this._modified.clear();
      this.rootHash = newRoot;
      return newRoot;
    });
  }

  override async *diff(
    last: BTreeRead,
  ): AsyncIterableIterator<InternalDiffOperation> {
    const [currentNode, lastNode] = await this._lock.withRead(() =>
      Promise.all([this.getNode(this.rootHash), last.getNode(last.rootHash)]),
    );
    yield* diffNodes(lastNode, currentNode, last, this);
  }
}

function gatherNewChunks(
  hash: Hash,
  newChunks: dag.Chunk[],
  createChunk: CreateChunk,
  modified: Map<Hash, DataNodeImpl | InternalNodeImpl>,
  formatVersion: FormatVersion,
): Hash {
  const node = modified.get(hash);
  if (node === undefined) {
    // Not modified, use the original.
    return hash;
  }

  if (isDataNodeImpl(node)) {
    const chunk = createChunk(toChunkData(node, formatVersion), []);
    newChunks.push(chunk);
    return chunk.hash;
  }

  const refs: Hash[] = [];
  const {entries} = node;
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const childHash = entry[1];
    const newChildHash = gatherNewChunks(
      childHash,
      newChunks,
      createChunk,
      modified,
      formatVersion,
    );
    if (newChildHash !== childHash) {
      // MUTATES the entries!
      // Hashes do not change the size of the entry because all hashes have the same length
      entries[i] = [entry[0], newChildHash, entry[2]];
    }
    refs.push(newChildHash);
  }
  const chunk = createChunk(toChunkData(node, formatVersion), refs);
  newChunks.push(chunk);
  return chunk.hash;
}
