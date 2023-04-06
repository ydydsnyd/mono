import * as dag from '../dag/mod.js';
import type {Hash} from '../hash.js';
import {promiseFalse, promiseTrue, promiseVoid} from '../resolved-promises.js';
import {getSizeOfValue} from '../size-of-value.js';

export type ChunkWithSize = {chunk: dag.Chunk; size: number};

export class GatherNotCachedVisitor extends dag.Visitor {
  private readonly _gatheredChunks: Map<Hash, ChunkWithSize> = new Map();
  private _gatheredChunksTotalSize = 0;
  private readonly _lazyStore: dag.LazyStore;
  private readonly _gatherSizeLimit: number;
  private readonly _getSizeOfChunk: (chunk: dag.Chunk) => number;
  readonly #dagRead: dag.Read;

  constructor(
    dagRead: dag.Read,
    lazyStore: dag.LazyStore,
    gatherSizeLimit: number,
    getSizeOfChunk: (chunk: dag.Chunk) => number = getSizeOfValue,
  ) {
    super(dagRead);
    this.#dagRead = dagRead;
    this._lazyStore = lazyStore;
    this._gatherSizeLimit = gatherSizeLimit;
    this._getSizeOfChunk = getSizeOfChunk;
  }

  get gatheredChunks(): ReadonlyMap<Hash, ChunkWithSize> {
    return this._gatheredChunks;
  }

  private _shouldVisit(h: Hash): Promise<boolean> {
    if (this._gatheredChunksTotalSize >= this._gatherSizeLimit) {
      return promiseFalse;
    }

    if (!this._lazyStore.isCached(h)) {
      return promiseTrue;
    }

    // isCached is not reliable because perdag might have removed the chunk
    return this.#dagRead.hasChunk(h);
  }

  private _gather(chunk: dag.Chunk): void {
    const size = this._getSizeOfChunk(chunk);
    this._gatheredChunks.set(chunk.hash, {chunk, size});
    this._gatheredChunksTotalSize += size;
  }

  override visit(h: Hash): Promise<void> {
    if (!this._shouldVisit(h)) {
      return promiseVoid;
    }
    return super.visit(h);
  }

  override visitChunk(chunk: dag.Chunk): Promise<void> {
    this._gather(chunk);
    return super.visitChunk(chunk);
  }
}
