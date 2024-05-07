import {assert} from 'shared/src/asserts.js';
import type {Primitive} from '../../../ast/ast.js';
import {genFlatMap} from '../../../util/iterables.js';
import type {Entry, Multiset} from '../../multiset.js';
import type {JoinResult, StringOrNumber} from '../../types.js';
import type {DifferenceStream} from '../difference-stream.js';
import type {Reply} from '../message.js';
import {DifferenceIndex, joinType} from './difference-index.js';
import {JoinOperatorBase} from './join-operator-base.js';

export type JoinArgs<
  Key extends Primitive,
  AValue extends object,
  BValue extends object,
  AAlias extends string | undefined,
  BAlias extends string | undefined,
> = {
  a: DifferenceStream<AValue>;
  aAs: AAlias | undefined;
  getAJoinKey: (value: AValue) => Key | undefined;
  getAPrimaryKey: (value: AValue) => StringOrNumber;
  b: DifferenceStream<BValue>;
  bAs: BAlias | undefined;
  getBJoinKey: (value: BValue) => Key | undefined;
  getBPrimaryKey: (value: BValue) => StringOrNumber;
  output: DifferenceStream<JoinResult<AValue, BValue, AAlias, BAlias>>;
};

/**
 * Joins two streams.
 *
 * Inputs:
 * - Stream A of changes
 * - Stream B of changes
 * - A function to extract the key to join on from A
 * - A function to extract the key to join on from B
 * - A function to compare the two keys
 *
 * The output is a stream of joined values of the form:
 *
 * ```ts
 * {
 *   table_name_1_or_alias: row_from_t1,
 *   table_name_2_or_alias: row_from_t2,
 * }[]
 * ```
 *
 * From which the `select` operator can extract the desired fields.
 */
export class InnerJoinOperator<
  K extends Primitive,
  AValue extends object,
  BValue extends object,
  AAlias extends string | undefined,
  BAlias extends string | undefined,
> extends JoinOperatorBase<
  AValue,
  BValue,
  // If AValue or BValue are join results
  // then they should be lifted and need no aliasing
  // since they're already aliased
  JoinResult<AValue, BValue, AAlias, BAlias>
> {
  readonly #indexA: DifferenceIndex<K, AValue>;
  readonly #indexB: DifferenceIndex<K, BValue>;
  readonly #joinArgs;
  readonly #buffer: {
    aMsg: Reply | undefined;
    bMsg: Reply | undefined;
    inputA: Multiset<AValue> | undefined;
    inputB: Multiset<BValue> | undefined;
  } = {
    aMsg: undefined,
    bMsg: undefined,
    inputA: undefined,
    inputB: undefined,
  };

  constructor(joinArgs: JoinArgs<K, AValue, BValue, AAlias, BAlias>) {
    super(
      joinArgs.a,
      joinArgs.b,
      joinArgs.output,
      (_, inputA, aMsg, inputB, bMsg) => this.#join(inputA, aMsg, inputB, bMsg),
    );
    this.#indexA = new DifferenceIndex<K, AValue>(joinArgs.getAPrimaryKey);
    this.#indexB = new DifferenceIndex<K, BValue>(joinArgs.getBPrimaryKey);
    this.#joinArgs = joinArgs;
  }

  // If it is a reply
  // then we hold until we have both sides.
  // Once we have both sides
  // we determine loop order by looking at reply messages.
  // We're trying to match `viewOrder` so we need that
  // in the reply message.
  // Can we be lazy without any of the reply stuff?
  // Just always use `A` as outer (rather than smallest as outer)
  // and hold until we have both sides (for inner join).
  // We can't know smaller given we're lazy so we don't know size of either side.
  //
  // Buffer As and concat iterables until B is ready.
  // Then iterate over A, joining with B.
  //
  // Index would need to be created for B immediately
  // so B is exhausted and not lazy.
  #join(
    inputA: Multiset<AValue> | undefined,
    aMsg: Reply | undefined,
    inputB: Multiset<BValue> | undefined,
    bMsg: Reply | undefined,
  ) {
    assert(
      inputA === undefined || inputB === undefined,
      'Can not have both inputs at once',
    );
    assert(
      aMsg === undefined || bMsg === undefined,
      'Can not have both messages at once',
    );
    // 1. got a reply?
    // 2. check if we have the other reply
    // 3. if not, hold onto the data
    // 4. got both sides?
    // 5. figure out who is the outer loop based on replies
    // 6. exhaust the inner loop into an index
    // 7. genFlatMap the outer loop, joining with the index
    // 8. emit the joined results
    // 9. not a reply? Just regular data and no buffered reply?
    // 10. do a normal join thing.

    if (aMsg !== undefined) {
      this.#bufferA(inputA, aMsg);
      if (this.#buffer.bMsg !== undefined) {
        return this.#lazyJoin();
      }

      // still waiting on B
      return undefined;
    }

    if (bMsg !== undefined) {
      this.#bufferB(inputB, bMsg);
      if (this.#buffer.aMsg !== undefined) {
        return this.#lazyJoin();
      }

      // still waiting on A
      return undefined;
    }

    return this.#normalJoin(inputA, inputB);
  }

  #lazyJoin() {
    //
    // as we're pulled we add to the difference index?
    // we can just `genFlatMap` the outer loop and have it call normal join???
    //
    // We do need to do index consultation to not re-play items already in the join.
    // This is only important when we share structure between queries.
    //

    const {inputA, inputB} = this.#buffer;
    assert(inputA !== undefined, 'inputA must be defined');
    assert(inputB !== undefined, 'inputB must be defined');

    this.#buffer.aMsg = undefined;
    this.#buffer.bMsg = undefined;
    this.#buffer.inputA = undefined;
    this.#buffer.inputB = undefined;

    // TODO(mlaw): consult the messages to determine
    // who goes in the outer loop. We'll just make it A for now.

    // Build the `B` index
    this.#normalJoin(undefined, inputB);

    // Now do the join, lazily.
    // This allows the downstream to stop pulling values once it has hit
    // `limit` results.
    const wrapper: Entry<AValue>[] = [];
    // TODO: you should pull in chunks rather than single values.
    // Join creates a lot of structures that require re-creation for each item.
    // Chunk size as 2x limit? If no limit just pull it all?
    // So we should pass around knowledge of limit then.
    return genFlatMap(
      () => inputA,
      a => {
        wrapper[0] = a;
        return this.#normalJoin(wrapper, undefined);
      },
    );
  }

  #normalJoin(
    inputA: Multiset<AValue> | undefined,
    inputB: Multiset<BValue> | undefined,
  ) {
    const {aAs, getAJoinKey, getAPrimaryKey, bAs, getBJoinKey, getBPrimaryKey} =
      this.#joinArgs;
    const aKeysForCompaction = new Set<K>();
    const bKeysForCompaction = new Set<K>();

    // TODO: just concat the two iterables rather than pushing onto result
    const result: Entry<JoinResult<AValue, BValue, AAlias, BAlias>>[] = [];
    if (!this.#indexB.isEmpty()) {
      const deltaA = new DifferenceIndex<K, AValue>(getAPrimaryKey);
      for (const entry of inputA || []) {
        const aKey = getAJoinKey(entry[0]);
        if (aKey === undefined) {
          continue;
        }
        deltaA.add(aKey, entry);
        if (!this.#indexA.isEmpty()) {
          aKeysForCompaction.add(aKey);
        }
      }

      for (const x of deltaA.join(
        joinType.inner,
        aAs,
        this.#indexB,
        bAs,
        getBPrimaryKey,
      )[0]) {
        result.push(x);
      }
      this.#indexA.extend(deltaA);
    } else {
      for (const entry of inputA || []) {
        const aKey = getAJoinKey(entry[0]);
        if (aKey === undefined) {
          continue;
        }
        this.#indexA.add(aKey, entry);
        if (!this.#indexA.isEmpty()) {
          aKeysForCompaction.add(aKey);
        }
      }
    }

    if (!this.#indexA.isEmpty()) {
      const deltaB = new DifferenceIndex<K, BValue>(getBPrimaryKey);
      for (const entry of inputB || []) {
        const bKey = getBJoinKey(entry[0]);
        if (bKey === undefined) {
          continue;
        }
        deltaB.add(bKey, entry);
        if (!this.#indexB.isEmpty()) {
          bKeysForCompaction.add(bKey);
        }
      }
      for (const x of deltaB.join(
        joinType.inner,
        bAs,
        this.#indexA,
        aAs,
        getAPrimaryKey,
      )[0]) {
        result.push(x);
      }
      this.#indexB.extend(deltaB);
    } else {
      for (const entry of inputB || []) {
        const bKey = getBJoinKey(entry[0]);
        if (bKey === undefined) {
          continue;
        }
        this.#indexB.add(bKey, entry);
        if (!this.#indexB.isEmpty()) {
          bKeysForCompaction.add(bKey);
        }
      }
    }

    this.#indexA.compact(aKeysForCompaction);
    this.#indexB.compact(bKeysForCompaction);
    return result;
  }

  #bufferA(inputA: Multiset<AValue> | undefined, aMsg: Reply) {
    assert(inputA !== undefined, 'inputA must be defined');
    assert(this.#buffer.inputA === undefined, 'a must not already be buffered');
    this.#buffer.aMsg = aMsg;
    this.#buffer.inputA = inputA;
  }

  #bufferB(inputB: Multiset<BValue> | undefined, bMsg: Reply) {
    assert(inputB !== undefined, 'inputB must be defined');
    assert(this.#buffer.inputB === undefined, 'b must not already be buffered');
    this.#buffer.bMsg = bMsg;
    this.#buffer.inputB = inputB;
  }

  toString() {
    return `indexa: ${this.#indexA.toString()}\n\n\nindexb: ${this.#indexB.toString()}`;
  }
}
