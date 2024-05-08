import type {Entry} from '../../multiset.js';
import type {Version} from '../../types.js';
import type {DifferenceStream, Listener} from '../difference-stream.js';
import type {Reply, Request} from '../message.js';
import type {Operator} from './operator.js';
import {OperatorBase} from './operator.js';

/**
 * Operator that only takes a single argument
 */
export class UnaryOperator<I extends object, O extends object>
  extends OperatorBase<O>
  implements Operator
{
  readonly #listener: Listener<I>;
  readonly #input: DifferenceStream<I>;

  constructor(
    input: DifferenceStream<I>,
    output: DifferenceStream<O>,
    fn: (
      version: Version,
      data: Entry<I>,
      reply: Reply | undefined,
      out: DifferenceStream<O>,
    ) => void,
  ) {
    super(output);
    this.#listener = {
      newDifference: (version, data, reply) => {
        fn(version, data, reply, output);
      },
      commit: version => {
        this.commit(version);
      },
    };
    input.addDownstream(this.#listener);
    this.#input = input;
  }

  messageUpstream(message: Request): void {
    this.#input.messageUpstream(message, this.#listener);
  }

  destroy() {
    this.#input.removeDownstream(this.#listener);
  }
}

const batchSize = 10_000;
export class UnaryOperatorWithBatching<I extends object, O extends object>
  extends OperatorBase<O>
  implements Operator
{
  readonly #listener: Listener<I>;
  readonly #input: DifferenceStream<I>;
  readonly #batch: Entry<I>[] = [];
  #pendingReply: Reply | undefined;

  constructor(
    input: DifferenceStream<I>,
    output: DifferenceStream<O>,
    fn: (
      version: Version,
      data: Entry<I>[],
      reply: Reply | undefined,
      out: DifferenceStream<O>,
    ) => void,
  ) {
    super(output);
    this.#listener = {
      newDifference: (version, data, reply) => {
        this.#batch.push(data);
        this.#pendingReply = reply;
        if (this.#batch.length >= batchSize) {
          fn(version, this.#batch, reply, output);
          this.#batch.length = 0;
        }
      },
      commit: version => {
        if (this.#batch.length > 0) {
          fn(version, this.#batch, this.#pendingReply, output);
          this.#batch.length = 0;
          this.#pendingReply = undefined;
        }
        this.commit(version);
      },
    };
    input.addDownstream(this.#listener);
    this.#input = input;
  }

  messageUpstream(message: Request): void {
    this.#input.messageUpstream(message, this.#listener);
  }

  destroy() {
    this.#input.removeDownstream(this.#listener);
  }
}
