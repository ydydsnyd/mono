import {splitHashRanges, type Hash} from '../hash.js';
import type {Chunk} from './chunk.js';
import type {GetChunkRange, MustGetChunk} from './store.js';

/**
 * A visitor walks the DAG starting at a given root and visits each chunk.
 */
export class Visitor {
  #seen: Set<Hash> = new Set();
  #dagRead: MustGetChunk & GetChunkRange;

  constructor(dagRead: MustGetChunk & GetChunkRange) {
    this.#dagRead = dagRead;
  }

  async visit(h: Hash) {
    if (this.#seen.has(h)) {
      return;
    }
    // this.#seen.add(h);
    const chunk = await this.#dagRead.mustGetChunk(h);
    await this.visitChunk(chunk);
  }

  async visitChunk(chunk: Chunk<unknown>) {
    this.#seen.add(chunk.hash);
    await this.visitMultiple(chunk.meta);
    // await Promise.all(chunk.meta.map(ref => this.visit(ref)));
  }

  async visitMultiple(refs: readonly Hash[]) {
    for (const range of splitHashRanges(filterSeen(refs, this.#seen))) {
      if (range[0] === range[1]) {
        await this.visit(range[0]);
      } else {
        await this.visitRange(range[0], range[1]);
      }
    }
  }

  async visitRange(first: Hash, last: Hash) {
    const chunks: Iterable<Chunk> = await this.#dagRead.getChunkRange(
      first,
      last,
    );
    for (const chunk of chunks) {
      await this.visitChunk(chunk);
    }
  }
}

function* filterSeen(refs: Iterable<Hash>, seen: Set<Hash>) {
  for (const h of refs) {
    if (!seen.has(h)) {
      yield h;
    }
  }
}
