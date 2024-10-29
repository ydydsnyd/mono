import type {Change} from './change.js';
import type {FetchRequest, Input, Operator, Output} from './operator.js';

/**
 * Forks a stream into multiple streams.
 * Is meant to be paired with a `FanIn` operator which will
 * later merge the forks back together.
 */
export class FanOut implements Operator {
  readonly #input: Input;
  readonly #outputs: Output[];
  #fanInReceivedPush: boolean;
  #destroyed: boolean;

  constructor(input: Input) {
    this.#input = input;
    this.#input.setOutput(this);
    this.#outputs = [];
    this.#fanInReceivedPush = false;
    this.#destroyed = false;
  }

  setOutput(output: Output): void {
    this.#outputs.push(output);
  }

  destroy(): void {
    if (!this.#destroyed) {
      this.#input.destroy();
      this.#destroyed = true;
    }
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

  onFanInReceivedPush() {
    this.#fanInReceivedPush = true;
  }

  push(change: Change) {
    this.#fanInReceivedPush = false;
    for (const out of this.#outputs) {
      out.push(change);
      if (this.#fanInReceivedPush) {
        return;
      }
    }
  }
}
