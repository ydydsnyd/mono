import type {Read} from '../dag/store.js';
import {Visitor} from '../dag/visitor.js';
import type {Hash} from '../hash.js';

export class IsChunkInTree extends Visitor {
  private readonly _needle: Hash;
  found = false;

  constructor(dagRead: Read, needle: Hash) {
    super(dagRead);
    this._needle = needle;
  }

  override async visit(h: Hash): Promise<void> {
    if (h === this._needle) {
      this.found = true;
    } else {
      await super.visit(h);
    }
  }
}
