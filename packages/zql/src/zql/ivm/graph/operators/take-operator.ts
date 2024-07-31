import {assertNotNull} from 'shared/src/asserts.js';
import {reverseOrdering, type Ordering} from '../../../ast/ast.js';
import {makeComparator} from '../../compare.js';
import type {Comparator, PipelineEntity} from '../../types.js';
import type {DifferenceStream, Listener} from '../difference-stream.js';
import {OperatorBase} from './operator.js';
import type {Multiset} from '../../multiset.js';
import type {PullMsg} from '../message.js';

/**
 * Takes the nth highest or lowest elements from the input stream by some comparison.
 */
export class TakeOperator<I extends PipelineEntity> extends OperatorBase<I> {
  // Does this have to be a separate object?
  readonly #listener: Listener<I>;
  readonly #input: DifferenceStream<I>;

  readonly #order: Ordering;
  readonly #comparator: Comparator<I>;
  readonly #limit: number;

  #max: I | null = null;
  #size = 0;

  constructor(
    input: DifferenceStream<I>,
    output: DifferenceStream<I>,
    order: Ordering,
    limit: number,
  ) {
    super(output);

    if (limit <= 0) {
      throw new Error(`limit must be greater than 0, got ${limit}`);
    }

    this.#input = input;
    this.#limit = limit;
    this.#order = order;
    this.#comparator = makeComparator(order);

    this.#listener = {
      newDifference: (version, data, reply) => {
        output.newDifference(version, this.#applyChange(data), reply);
      },
      commit: version => {
        this.commit(version);
      },
    };

    input.addDownstream(this.#listener);
  }

  *#applyChange(data: Multiset<I>): Multiset<I> {
    for (const [entity, mult] of data) {
      const comparison =
        this.#max === null ? -1 : this.#comparator(entity, this.#max);
      if (comparison === 0) {
        throw new Error(`Unexpected equal sort values: ${entity} ${this.#max}`);
      }

      if (Math.abs(mult) !== 1) {
        // Higher multiplicities are very hard to think about and perhaps
        // impossible. For example, consider the case of receiving mult: +2 and
        // having space for only one more item in the window. Multiplicity of
        // zero is a bit easier, but kind of silly.
        //
        // More evidence we should remove support for exotic multiplicities.
        throw new Error(
          `TakeOperator does not support multiplicities other than 1 and -1`,
        );
      }

      const isAssert = mult > 0;

      if (isAssert) {
        // asserting
        if (comparison < 0) {
          // in window
          if (this.#size < this.#limit) {
            // space left in window
            ++this.#size;
            yield [entity, 1];
          } else {
            // no space left, boot highest
            // Should be true since size >= limit and limit is non-zero.
            assertNotNull(this.#max);
            yield [this.#max, -1];
            this.#max = this.pullNextValue('before', this.#max);
            if (this.#max !== null) {
              yield [this.#max, 1];
            }
          }
        } else {
          // not in window
          if (this.#size < this.#limit) {
            // space left in window
            ++this.#size;
            this.#max = entity;
            yield [entity, 1];
          }
        }
      } else {
        // retracting
        if (comparison < 0) {
          // in window
          --this.#size;
          yield [entity, -1];
          // TODO(aa): It's going to be pretty inefficient pulling the same two
          // values over and over again in the case of edit. Unfortunately, it
          // is difficult to collapse them due to the need to lockstep process
          // incremental mutations.
          //
          // Perhaps we should cache the last two values of the window to avoid
          // the common case of repulling the window bound over and over.
          this.#max = this.pullNextValue('after', this.#max);
          if (this.#max !== null) {
            yield [this.#max, 1];
          }
        }
      }
    }
  }

  pullNextValue(comparison: 'before' | 'after', _than: I | null): I {
    const _order =
      comparison === 'before' ? reverseOrdering(this.#order) : this.#order;
    /*
    // TODO(aa): pull needs to change a bit to support starting from a spot in
    // sorted stream.
    const message = createPullMessage(order, [
      {
        start: {
          entity: than,
          inclusive: false,
        }
      },
    ]);
    */
    return null as unknown as I;
  }

  messageUpstream(message: PullMsg): void {
    if (message.order !== undefined) {
      throw new Error('TakeOperator must be only ordering node in pipeline');
    }
    message = {
      ...message,
      order: this.#order,
    };
    this.#input.messageUpstream(message, this.#listener);
  }

  destroy() {
    this.#input.removeDownstream(this.#listener);
  }
}
