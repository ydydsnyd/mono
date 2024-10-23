import {assert} from '../../../../shared/src/asserts.js';
import {iterInOrder} from '../../../../shared/src/iterables.js';
import {
  deepEqual,
  type ReadonlyJSONValue,
} from '../../../../shared/src/json.js';
import {must} from '../../../../shared/src/must.js';
import type {Change} from './change.js';
import type {FetchRequest, Input, Operator, Output} from './operator.js';
import type {TableSchema} from './schema.js';

/**
 * The FanIn operator merges multiple streams into one.
 * It eliminates duplicates and must be paired with a fan-out operator
 * somewhere upstream of the fan-in.
 *
 *  issue
 *    |
 * fan-out
 * /      \
 * a      b
 *  \    /
 * fan-in
 *   |
 */
export class FanIn implements Operator {
  readonly #inputs: readonly Input[];
  #output: Output | undefined;
  #watermark: number;
  #schema: TableSchema | undefined;

  constructor(inputs: Input[]) {
    this.#watermark = 0;
    this.#inputs = inputs;
    this.#schema = inputs[0].getSchema();
    for (const input of inputs) {
      input.setOutput(this);
      assert(
        deepEqual(
          this.#schema as unknown as ReadonlyJSONValue,
          input.getSchema() as unknown as ReadonlyJSONValue,
        ),
        `Schema mismatch in fan-in`,
      );
    }
  }

  setOutput(output: Output): void {
    this.#output = output;
  }

  destroy(): void {
    for (const input of this.#inputs) {
      input.destroy();
    }
  }

  getSchema() {
    return this.#inputs[0].getSchema();
  }

  *fetch(req: FetchRequest) {
    const iterables = this.#inputs.map(input => input.fetch(req));
    for (const node of iterInOrder(
      iterables,
      (l, r) => must(this.#schema).compareRows(l.row, r.row),
      true,
    )) {
      yield node;
    }
  }

  cleanup(req: FetchRequest) {
    return this.fetch(req);
  }

  push(change: Change) {
    assert(change.fanoutSeq !== undefined, 'Change is missing its fanout seq!');
    if (change.fanoutSeq <= this.#watermark) {
      return;
    }
    // resetting to undefined.. is there ever a case of a `fan-out`, `fan-in` combo proceeding another one?
    change.fanoutSeq = undefined;
    this.#output?.push(change);
  }
}
