import type {Hash} from '../hash.js';
import type {Chunk} from './chunk.js';
import type {Read} from './store.js';

export class Visitor {
  private _seen: Set<Hash> = new Set();
  private _dagRead: Read;

  constructor(dagRead: Read) {
    this._dagRead = dagRead;
  }

  async visit(h: Hash) {
    if (this._seen.has(h)) {
      return;
    }
    this._seen.add(h);
    const chunk = await this._dagRead.mustGetChunk(h);
    await this.visitChunk(chunk);
  }

  async visitChunk(chunk: Chunk<unknown>) {
    await Promise.all(chunk.meta.map(ref => this.visit(ref)));
  }
}
