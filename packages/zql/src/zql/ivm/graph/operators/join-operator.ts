import {assert} from 'shared/src/asserts.js';
import type {Primitive} from '../../../ast/ast.js';
import {genFlatMap} from '../../../util/iterables.js';
import type {Entry, Multiset} from '../../multiset.js';
import type {JoinResult, StringOrNumber, Version} from '../../types.js';
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
      (version, inputA, aMsg, inputB, bMsg) =>
        this.#join(version, inputA, aMsg, inputB, bMsg),
    );
    this.#indexA = new DifferenceIndex<K, AValue>(joinArgs.getAPrimaryKey);
    this.#indexB = new DifferenceIndex<K, BValue>(joinArgs.getBPrimaryKey);
    this.#joinArgs = joinArgs;
    this.#deltaAIndex = new DifferenceIndex<K, AValue>(
      this.#joinArgs.getAPrimaryKey,
    );
    this.#deltaBIndex = new DifferenceIndex<K, BValue>(
      this.#joinArgs.getBPrimaryKey,
    );
  }

  #join(
    version: Version,
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

    if (aMsg !== undefined) {
      this.#bufferA(inputA, aMsg);
      if (this.#buffer.bMsg !== undefined) {
        return this.#lazyJoin(version);
      }

      // still waiting on B
      return undefined;
    }

    if (bMsg !== undefined) {
      this.#bufferB(inputB, bMsg);
      if (this.#buffer.aMsg !== undefined) {
        return this.#lazyJoin(version);
      }

      // still waiting on A
      return undefined;
    }

    return this.#runJoin(version, inputA, inputB);
  }

  #lazyJoin(version: Version) {
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
    this.#runJoin(version, undefined, inputB);

    // Now do the join, lazily.
    // This allows the downstream to stop pulling values once it has hit
    // `limit` results.
    const wrapper: Entry<AValue>[] = [];
    return genFlatMap(
      () => inputA,
      a => {
        wrapper[0] = a;
        return this.#runJoin(version, wrapper, undefined);
      },
    );
  }

  readonly #aKeysForCompaction = new Set<K>();
  readonly #bKeysForCompaction = new Set<K>();
  #lastVersion = -1;
  readonly #deltaAIndex;
  readonly #deltaBIndex;

  #runJoin(
    version: Version,
    inputA: Multiset<AValue> | undefined,
    inputB: Multiset<BValue> | undefined,
  ) {
    this.#deltaAIndex.clear();
    this.#deltaBIndex.clear();

    if (version !== this.#lastVersion) {
      this.#lastVersion = version;
      this.#indexA.compact(this.#aKeysForCompaction);
      this.#indexB.compact(this.#bKeysForCompaction);

      this.#aKeysForCompaction.clear();
      this.#bKeysForCompaction.clear();
    }
    const aKeysForCompaction = this.#aKeysForCompaction;
    const bKeysForCompaction = this.#bKeysForCompaction;
    const deltaA = this.#deltaAIndex;
    const deltaB = this.#deltaBIndex;

    const {aAs, getAJoinKey, getAPrimaryKey, bAs, getBJoinKey, getBPrimaryKey} =
      this.#joinArgs;

    // TODO: concat the two iterables rather than pushing onto result
    const result: Entry<JoinResult<AValue, BValue, AAlias, BAlias>>[] = [];
    if (!this.#indexB.isEmpty()) {
      this.#updateIndex(
        inputA,
        getAJoinKey,
        deltaA,
        this.#indexA,
        aKeysForCompaction,
      );

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
      this.#updateIndex(
        inputA,
        getAJoinKey,
        this.#indexA,
        this.#indexA,
        aKeysForCompaction,
      );
    }

    if (!this.#indexA.isEmpty()) {
      this.#updateIndex(
        inputB,
        getBJoinKey,
        deltaB,
        this.#indexB,
        bKeysForCompaction,
      );

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
      this.#updateIndex(
        inputB,
        getBJoinKey,
        this.#indexB,
        this.#indexB,
        bKeysForCompaction,
      );
    }

    return result;
  }

  #updateIndex<V>(
    input: Multiset<V> | undefined,
    getJoinKey: (value: V) => K | undefined,
    indexToUpdate: DifferenceIndex<K, V>,
    indexToCompact: DifferenceIndex<K, V>,
    keysToCompact: Set<K>,
  ) {
    for (const entry of input || []) {
      const key = getJoinKey(entry[0]);
      if (key === undefined) {
        continue;
      }
      indexToUpdate.add(key, entry);
      if (!indexToCompact.isEmpty()) {
        keysToCompact.add(key);
      }
    }
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
