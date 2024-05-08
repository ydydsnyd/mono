import {assert} from 'shared/src/asserts.js';
import type {Primitive} from '../../../ast/ast.js';
import {genFlatMap} from '../../../util/iterables.js';
import type {Entry, Multiset} from '../../multiset.js';
import type {JoinResult, Version} from '../../types.js';
import {DifferenceIndex, joinType} from './difference-index.js';
import {JoinOperatorBase} from './join-operator-base.js';

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

    this._buffer.aMsg = undefined;
    this._buffer.bMsg = undefined;
    this._buffer.inputA = undefined;
    this._buffer.inputB = undefined;

    // TODO(mlaw): consult the messages to determine
    // who goes in the outer loop. We'll just make it A for now.

    // Build the `B` index
    this._runJoin(version, undefined, inputB);

    // TODO(mlaw): if there is no limit, might as well not do the lazy join. Right?
    // since we'll process the entire set in that case.
    // TODO(mlaw): pass back a different `reply` if we find that we are unable to
    // respect ordering(s)
    // TODO(mlaw): take control of the `reply` object from `BinaryOperator`. We should only
    // forward the outer loop's message.

    // Now do the join, lazily.
    // This allows the downstream to stop pulling values once it has hit
    // `limit` results.
    const wrapper: Entry<AValue>[] = [];
    return genFlatMap(
      () => inputA,
      a => {
        wrapper[0] = a;
        return this._runJoin(version, wrapper, undefined);
      },
    );
  }

  // TODO(mlaw): this'll often be called with inputs of length 1.
  // We should re-write to handle that case / re-write so all calls always pass
  // a single entry.
  protected _runJoinImpl(
    _version: Version,
    inputA: Multiset<AValue> | undefined,
    inputB: Multiset<BValue> | undefined,
  ) {
    const aKeysForCompaction = this._aKeysForCompaction;
    const bKeysForCompaction = this._bKeysForCompaction;
    const deltaA = this._deltaAIndex;
    const deltaB = this._deltaBIndex;

    const {aAs, getAJoinKey, getAPrimaryKey, bAs, getBJoinKey, getBPrimaryKey} =
      this._joinArgs;

    const result: Entry<JoinResult<AValue, BValue, AAlias, BAlias>>[] = [];
    if (!this._indexB.isEmpty()) {
      this._updateIndex(
        inputA,
        getAJoinKey,
        deltaA,
        this._indexA,
        aKeysForCompaction,
      );

      // TODO: concat the two iterables rather than pushing onto result
      for (const x of deltaA.join(
        joinType.inner,
        aAs,
        this._indexB,
        bAs,
        getBPrimaryKey,
      )[0]) {
        result.push(x);
      }
      this._indexA.extend(deltaA);
    } else {
      this._updateIndex(
        inputA,
        getAJoinKey,
        this._indexA,
        this._indexA,
        aKeysForCompaction,
      );
    }

    if (!this._indexA.isEmpty()) {
      this._updateIndex(
        inputB,
        getBJoinKey,
        deltaB,
        this._indexB,
        bKeysForCompaction,
      );

      for (const x of deltaB.join(
        joinType.inner,
        bAs,
        this._indexA,
        aAs,
        getAPrimaryKey,
      )[0]) {
        result.push(x);
      }
      this._indexB.extend(deltaB);
    } else {
      this._updateIndex(
        inputB,
        getBJoinKey,
        this._indexB,
        this._indexB,
        bKeysForCompaction,
      );
    }

    return result;
  }

  protected _updateIndex<V>(
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
}
