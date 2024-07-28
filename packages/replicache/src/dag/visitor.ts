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
  }

  async visitMultiple(refs: readonly Hash[]): Promise<void> {
    const ps: Promise<void>[] = [];
    for (const range of splitHashRanges(filterSeen(refs, this.#seen))) {
      if (range[0] === range[1]) {
        ps.push(this.visit(range[0]));
      } else {
        ps.push(this.visitRange(range[0], range[1]));
      }
    }
    await Promise.all(ps);
  }

  async visitRange(first: Hash, last: Hash): Promise<void> {
    const chunks = await this.#dagRead.getChunkRange(first, last);
    await Promise.all(chunks.map(chunk => this.visitChunk(chunk)));
  }
}

function* filterSeen(refs: Iterable<Hash>, seen: Set<Hash>) {
  for (const h of refs) {
    if (!seen.has(h)) {
      yield h;
    }
  }
}
