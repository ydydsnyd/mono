import {assert} from '../../../../shared/src/asserts.js';
import type {Change} from './change.js';
import type {FetchRequest, Input, Operator, Output} from './operator.js';

export class FanOut implements Operator {
  readonly #input: Input;
  readonly #outputs: Output[];
  #seq: number;

  constructor(input: Input) {
    this.#input = input;
    this.#input.setOutput(this);
    this.#outputs = [];
    this.#seq = 0;
  }

  setOutput(output: Output): void {
    this.#outputs.push(output);
  }

  destroy(): void {
    this.#input.destroy();
  }

  getSchema() {
    return this.#input.getSchema();
  }

  *fetch(req: FetchRequest) {
    for (const node of this.#input.fetch(req)) {
      yield node;
    }
  }

  cleanup(req: FetchRequest) {
    return this.fetch(req);
  }

  push(change: Change) {
    assert(change.fanoutSeq === undefined, 'Change already has a seq');
    change.fanoutSeq = ++this.#seq;
    for (const out of this.#outputs) {
      out.push(change);
    }
  }
}
