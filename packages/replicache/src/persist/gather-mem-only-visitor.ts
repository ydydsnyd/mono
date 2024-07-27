import {promiseVoid} from 'shared/src/resolved-promises.js';
import type {Chunk} from '../dag/chunk.js';
import type {LazyRead} from '../dag/lazy-store.js';
import {Visitor} from '../dag/visitor.js';
import type {Hash} from '../hash.js';

export class GatherMemoryOnlyVisitor extends Visitor {
  readonly #gatheredChunks: Map<Hash, Chunk> = new Map();
  readonly #lazyRead: LazyRead;

  constructor(dagRead: LazyRead) {
    super(dagRead);
    this.#lazyRead = dagRead;
  }

  get gatheredChunks(): ReadonlyMap<Hash, Chunk> {
    return this.#gatheredChunks;
  }

  override visit(h: Hash): Promise<void> {
    if (!this.#lazyRead.isMemOnlyChunkHash(h)) {
      // Not a memory-only hash, no need to visit anything else.
      return promiseVoid;
    }
    return super.visit(h);
  }

  override visitMultiple(refs: readonly Hash[]) {
    // for (const h of refs) {
    //   await this.visit(h);
    // }
    //     this.#gatheredChunks.set(h, this.#lazyRead.getMemOnlyChunk(h));
    //   }
    // }
    const memOnlyRefs = refs.filter(h => this.#lazyRead.isMemOnlyChunkHash(h));
    // for (const h of nonMemOnlyRefs) {
    //   await super.visit(h);
    // }
    return super.visitMultiple(memOnlyRefs);
  }

  override visitChunk(chunk: Chunk): Promise<void> {
    this.#gatheredChunks.set(chunk.hash, chunk);
    return super.visitChunk(chunk);
  }
}
