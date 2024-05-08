import type {Entry} from '../../multiset.js';
import type {Version} from '../../types.js';
import type {DifferenceStream, Listener} from '../difference-stream.js';
import type {Request} from '../message.js';
import {OperatorBase} from './operator.js';

export class BinaryOperator<
  I1 extends object,
  I2 extends object,
  O extends object,
> extends OperatorBase<O> {
  readonly #listener1: Listener<I1>;
  readonly #input1: DifferenceStream<I1>;
  readonly #listener2: Listener<I2>;
  readonly #input2: DifferenceStream<I2>;

  constructor(
    input1: DifferenceStream<I1>,
    input2: DifferenceStream<I2>,
    output: DifferenceStream<O>,
    fn: (
      v: Version,
      inputA: Entry<I1> | undefined,
      inputB: Entry<I2> | undefined,
      out: DifferenceStream<O>,
    ) => void,
  ) {
    super(output);
    this.#listener1 = {
      newDifference: (version, data) => {
        fn(version, data, undefined, output);
      },
      commit: version => {
        this.commit(version);
      },
    };
    this.#listener2 = {
      newDifference: (version, data) => {
        fn(version, undefined, data, output);
      },
      commit: version => {
        this.commit(version);
      },
    };
    input1.addDownstream(this.#listener1);
    input2.addDownstream(this.#listener2);
    this.#input1 = input1;
    this.#input2 = input2;
  }

  messageUpstream(message: Request): void {
    this.#input1.messageUpstream(message, this.#listener1);
    this.#input2.messageUpstream(message, this.#listener2);
  }

  destroy() {
    this.#input1.removeDownstream(this.#listener1);
    this.#input2.removeDownstream(this.#listener2);
  }
}
