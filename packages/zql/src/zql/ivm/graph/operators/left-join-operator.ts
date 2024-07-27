import {must} from 'shared/src/must.js';
import type {Ordering} from '../../../ast/ast.js';
import {genCached, genConcat, genFlatMap} from '../../../util/iterables.js';
import type {Entry, Multiset} from '../../multiset.js';
import type {Source} from '../../source/source.js';
import {
  getPrimaryKeyValuesAsStringUnqualified,
  getValueFromEntityAsStringOrNumberOrUndefined,
} from '../../source/util.js';
import type {
  JoinResult,
  PipelineEntity,
  StringOrNumber,
  Version,
} from '../../types.js';
import {
  DifferenceIndex,
  MemoryBackedDifferenceIndex,
} from './difference-index.js';
import {JoinOperatorBase} from './join-operator-base.js';
import {JoinArgs, makeJoinResult} from './join-operator.js';
import {SourceBackedDifferenceIndex} from './source-backed-difference-index.js';

export class LeftJoinOperator<
  AValue extends PipelineEntity,
  BValue extends PipelineEntity,
  ATable extends string,
  BAlias extends string,
> extends JoinOperatorBase<
  AValue,
  BValue,
  // If AValue or BValue are join results
  // then they should be lifted and need no aliasing
  // since they're already aliased
  JoinResult<AValue, BValue, ATable, BAlias>
> {
  readonly #indexA: MemoryBackedDifferenceIndex<
    StringOrNumber | undefined,
    AValue
  >;
  readonly #indexB: DifferenceIndex<StringOrNumber, BValue>;

  readonly #getAPrimaryKey: (value: AValue) => string;
  readonly #getBPrimaryKey: (value: BValue) => string;
  readonly #getAJoinKey: (value: AValue) => string | number | undefined;
  readonly #getBJoinKey: (value: BValue) => string | number | undefined;
  readonly #joinArgs: JoinArgs<AValue, BValue, ATable, BAlias>;

  constructor(
    joinArgs: JoinArgs<AValue, BValue, ATable, BAlias>,
    sourceProvider:
      | ((
          sourceName: string,
          order: Ordering | undefined,
        ) => Source<PipelineEntity>)
      | undefined,
  ) {
    super(
      joinArgs.a,
      joinArgs.b,
      joinArgs.output,
      (version, inputA, inputB, isHistory) =>
        this.#join(version, inputA, inputB, isHistory),
      joinArgs.aJoinColumn,
    );

    this.#getAPrimaryKey = value =>
      getPrimaryKeyValuesAsStringUnqualified(
        value,
        joinArgs.aPrimaryKeyColumns,
      );
    this.#getBPrimaryKey = value =>
      getPrimaryKeyValuesAsStringUnqualified(
        value,
        joinArgs.bPrimaryKeyColumns,
      );

    this.#getAJoinKey = value =>
      getValueFromEntityAsStringOrNumberOrUndefined(
        value,
        joinArgs.aJoinColumn,
      );
    this.#getBJoinKey = value =>
      getValueFromEntityAsStringOrNumberOrUndefined(
        value,
        joinArgs.bJoinColumn,
      );
    this.#indexA = new MemoryBackedDifferenceIndex<StringOrNumber, AValue>(
      this.#getAPrimaryKey,
    );

    // load indexB from the source...
    if (sourceProvider === undefined) {
      this.#indexB = new MemoryBackedDifferenceIndex<StringOrNumber, BValue>(
        this.#getBPrimaryKey,
      );
    } else {
      const sourceB = sourceProvider(joinArgs.bTable, undefined);
      this.#indexB = new SourceBackedDifferenceIndex(
        sourceB.getOrCreateAndMaintainNewHashIndex(joinArgs.bJoinColumn),
      ) as SourceBackedDifferenceIndex<StringOrNumber, BValue>;
    }

    this.#joinArgs = joinArgs;
  }

  #lastVersion = -1;
  #join(
    version: Version,
    inputA: Multiset<AValue> | undefined,
    inputB: Multiset<BValue> | undefined,
    isHistory: boolean,
  ) {
    if (this.#lastVersion !== version) {
      // TODO: all outstanding iterables _must_ be made invalid before processing a new version.
      // We should add some invariant in `joinOne` that checks if the version is still valid
      // and throws if not.
      this.#indexA.compact();
      this.#indexB.compact();
      this.#lastVersion = version;
    }

    const iterablesToReturn: Multiset<
      JoinResult<AValue, BValue, ATable, BAlias>
    >[] = [];

    // fill the inner set first so we don't emit 2x the amount of data
    // I.e., so we don't omit `null` values for each `a` value followed by
    // the actual join results.
    //
    // Don't iterate over `inputB` in history mode.
    // It is already filled in that case and the join from `a` will get everything.
    if (inputB !== undefined && !isHistory) {
      iterablesToReturn.push(
        genFlatMap(inputB, entry => {
          const key = this.#getBJoinKey(entry[0]);
          const ret = this.#joinOneInner(entry, key);
          if (key !== undefined) {
            this.#indexB.add(key, entry);
          }
          return ret;
        }),
      );
    }

    if (inputA !== undefined) {
      iterablesToReturn.push(
        genFlatMap(inputA, entry => {
          const key = this.#getAJoinKey(entry[0]);
          const ret = this.#joinOneLeft(entry, key);
          if (key !== undefined) {
            this.#indexA.add(key, entry);
          }
          return ret;
        }),
      );
    }

    return genCached(genConcat(iterablesToReturn));
  }

  #joinOneLeft(
    aEntry: Entry<AValue>,
    aKey: StringOrNumber | undefined,
  ): Entry<JoinResult<AValue, BValue, ATable, BAlias>>[] {
    const aValue = aEntry[0];
    const aMult = aEntry[1];

    const ret: Entry<JoinResult<AValue, BValue, ATable, BAlias>>[] = [];
    const {aTable} = this.#joinArgs;
    const bAs = must(this.#joinArgs.bAs);

    // Unlike the traditional SQL output of left join, our left-join operator
    // *always* emits an "unmatched" entry containing just the left side of the
    // join, regardless of whether there are any matching right sides.
    //
    // This output makes implementation of left-join easier because we don't
    // have to remember if we previously emitted an unmatched entry that should
    // be retracted when a matching right side subsequently comes in. Instead
    // the unmatched entry is always emitted when a new left-side entry is
    // encountered, and always retracted when the left-side entry is retracted.
    //
    // It also makes implementing heirarchical output easier since the unmatched
    // entry can be treated as the "parent" and the matched entries as the
    // "children".
    //
    // If consumers want the traditional SQL output they can just have the
    // first matched entry override the unmatched entry.
    const unmatchedEntry = [
      makeJoinResult(
        aValue,
        undefined,
        aTable,
        bAs,
        this.#getAPrimaryKey,
        this.#getBPrimaryKey,
      ),
      aMult,
    ] as const;
    ret.push(unmatchedEntry);

    const bEntries = aKey !== undefined ? this.#indexB.get(aKey) : undefined;
    if (bEntries) {
      for (const [bValue, bMult] of bEntries) {
        const matchedEntry = [
          makeJoinResult(
            aValue,
            bValue,
            aTable,
            bAs,
            this.#getAPrimaryKey,
            this.#getBPrimaryKey,
          ) as JoinResult<AValue, BValue, ATable, BAlias>,
          aMult * bMult,
        ] as const;

        ret.push(matchedEntry);
      }
    }

    return ret;
  }

  #joinOneInner(
    bEntry: Entry<BValue>,
    bKey: StringOrNumber | undefined,
  ): Entry<JoinResult<AValue, BValue, ATable, BAlias>>[] {
    const bValue = bEntry[0];
    const bMult = bEntry[1];
    if (bKey === undefined) {
      return [];
    }

    // There can be multiple entries for the same key just because of
    // remove/add in the same transaction. But also theoretically, there could
    // be multiple adds for the same key in the same transaction.
    const aEntries = this.#indexA.get(bKey);
    if (aEntries === undefined) {
      return [];
    }

    const ret: Entry<JoinResult<AValue, BValue, ATable, BAlias>>[] = [];
    const {aTable} = this.#joinArgs;
    const bAs = must(this.#joinArgs.bAs);
    for (const [aRow, aMult] of aEntries) {
      const joinEntry = [
        makeJoinResult(
          aRow,
          bValue,
          aTable,
          bAs,
          this.#getAPrimaryKey,
          this.#getBPrimaryKey,
        ) as JoinResult<AValue, BValue, ATable, BAlias>,
        aMult * bMult,
      ] as const;
      ret.push(joinEntry);
    }

    return ret;
  }

  toString() {
    return `indexa: ${this.#indexA.toString()}\n\n\nindexb: ${this.#indexB.toString()}`;
  }

  inputBIsSourceBacked(): boolean {
    return this.#indexB instanceof SourceBackedDifferenceIndex;
  }
}
