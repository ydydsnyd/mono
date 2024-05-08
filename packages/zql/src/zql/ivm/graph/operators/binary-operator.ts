import type {Entry} from '../../multiset.js';
import type {Version} from '../../types.js';
import type {DifferenceStream, Listener} from '../difference-stream.js';
import type {Reply, Request} from '../message.js';
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
  #commitCount = 0;

  constructor(
    input1: DifferenceStream<I1>,
    input2: DifferenceStream<I2>,
    output: DifferenceStream<O>,
    fn: (
      v: Version,
      inputA: Entry<I1> | undefined,
      aMsg: Reply | undefined,
      inputB: Entry<I2> | undefined,
      bMsg: Reply | undefined,
      out: DifferenceStream<O>,
    ) => void,
  ) {
    super(output);
    this.#listener1 = {
      newDifference: (version, data, reply) => {
        fn(version, data, reply, undefined, undefined, output);
      },
      commit: version => {
        ++this.#commitCount;
        if (this.#commitCount === 2) {
          this.#commitCount = 0;
          this.commit(version);
        }
      },
    };
    this.#listener2 = {
      newDifference: (version, data, reply) => {
        fn(version, undefined, undefined, data, reply, output);
      },
      commit: version => {
        ++this.#commitCount;
        if (this.#commitCount === 2) {
          this.#commitCount = 0;
          this.commit(version);
        }
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

// try stream join instead of batch join as well.
const batchSize = 20_000;
export class BinaryOperatorWithBatching<
  I1 extends object,
  I2 extends object,
  O extends object,
> extends OperatorBase<O> {
  readonly #listener1: Listener<I1>;
  readonly #input1: DifferenceStream<I1>;
  readonly #listener2: Listener<I2>;
  readonly #input2: DifferenceStream<I2>;

  readonly #batch1: Entry<I1>[] = [];
  readonly #batch2: Entry<I2>[] = [];
  #pendingReply1: Reply | undefined;
  #pendingReply2: Reply | undefined;
  #commitCount = 0;

  constructor(
    input1: DifferenceStream<I1>,
    input2: DifferenceStream<I2>,
    output: DifferenceStream<O>,
    fn: (
      v: Version,
      inputA: Entry<I1>[] | undefined,
      aMsg: Reply | undefined,
      inputB: Entry<I2>[] | undefined,
      bMsg: Reply | undefined,
      out: DifferenceStream<O>,
    ) => void,
  ) {
    super(output);
    this.#listener1 = {
      newDifference: (version, data, reply) => {
        this.#batch1.push(data);
        this.#pendingReply1 = reply;
        if (this.#batch1.length >= batchSize) {
          fn(version, this.#batch1, reply, undefined, undefined, output);
          this.#batch1.length = 0;
        }
      },
      commit: version => {
        ++this.#commitCount;
        if (this.#batch1.length > 0) {
          fn(
            version,
            this.#batch1,
            this.#pendingReply1,
            undefined,
            undefined,
            output,
          );
          this.#batch1.length = 0;
          this.#pendingReply1 = undefined;
        }
        if (this.#commitCount === 2) {
          this.#commitCount = 0;
          this.commit(version);
        }
      },
    };
    this.#listener2 = {
      newDifference: (version, data, reply) => {
        this.#batch2.push(data);
        this.#pendingReply2 = reply;
        if (this.#batch2.length >= batchSize) {
          fn(version, undefined, undefined, this.#batch2, reply, output);
          this.#batch2.length = 0;
        }
      },
      commit: version => {
        ++this.#commitCount;
        if (this.#batch2.length > 0) {
          fn(
            version,
            undefined,
            undefined,
            this.#batch2,
            this.#pendingReply2,
            output,
          );
          this.#batch2.length = 0;
          this.#pendingReply2 = undefined;
        }
        if (this.#commitCount === 2) {
          this.#commitCount = 0;
          this.commit(version);
        }
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
