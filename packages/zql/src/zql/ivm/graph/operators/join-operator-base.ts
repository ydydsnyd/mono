import {assert} from 'shared/src/asserts.js';
import type {Primitive} from '../../../ast/ast.js';
import type {Multiset} from '../../multiset.js';
import type {JoinResult, StringOrNumber, Version} from '../../types.js';
import type {DifferenceStream} from '../difference-stream.js';
import type {Reply} from '../message.js';
import {BinaryOperator} from './binary-operator.js';
import {DifferenceIndex} from './difference-index.js';

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

export abstract class JoinOperatorBase<
  K extends Primitive,
  AValue extends object,
  BValue extends object,
  AAlias extends string | undefined,
  BAlias extends string | undefined,
> extends BinaryOperator<
  AValue,
  BValue,
  JoinResult<AValue, BValue, AAlias, BAlias>
> {
  protected readonly _indexA: DifferenceIndex<K, AValue>;
  protected readonly _indexB: DifferenceIndex<K, BValue>;
  protected readonly _joinArgs;
  protected readonly _buffer: {
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
  protected readonly _aKeysForCompaction = new Set<K>();
  protected readonly _bKeysForCompaction = new Set<K>();
  #lastVersion = -1;
  protected readonly _deltaAIndex;
  protected readonly _deltaBIndex;

  constructor(joinArgs: JoinArgs<K, AValue, BValue, AAlias, BAlias>) {
    super(
      joinArgs.a,
      joinArgs.b,
      joinArgs.output,
      (version, inputA, aMsg, inputB, bMsg) =>
        this.#join(version, inputA, aMsg, inputB, bMsg),
    );
    this._indexA = new DifferenceIndex<K, AValue>(joinArgs.getAPrimaryKey);
    this._indexB = new DifferenceIndex<K, BValue>(joinArgs.getBPrimaryKey);
    this._joinArgs = joinArgs;
    this._deltaAIndex = new DifferenceIndex<K, AValue>(
      this._joinArgs.getAPrimaryKey,
    );
    this._deltaBIndex = new DifferenceIndex<K, BValue>(
      this._joinArgs.getBPrimaryKey,
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
      if (this._buffer.bMsg !== undefined) {
        return this._lazyJoin(version);
      }

      // still waiting on B
      return undefined;
    }

    if (bMsg !== undefined) {
      this.#bufferB(inputB, bMsg);
      if (this._buffer.aMsg !== undefined) {
        return this._lazyJoin(version);
      }

      // still waiting on A
      return undefined;
    }

    return this._runJoin(version, inputA, inputB);
  }

  protected _runJoin(
    version: Version,
    inputA: Multiset<AValue> | undefined,
    inputB: Multiset<BValue> | undefined,
  ) {
    this._deltaAIndex.clear();
    this._deltaBIndex.clear();

    if (version !== this.#lastVersion) {
      this.#lastVersion = version;
      this._indexA.compact(this._aKeysForCompaction);
      this._indexB.compact(this._bKeysForCompaction);

      this._aKeysForCompaction.clear();
      this._bKeysForCompaction.clear();
    }

    return this._runJoinImpl(version, inputA, inputB);
  }

  protected abstract _runJoinImpl(
    version: Version,
    inputA: Multiset<AValue> | undefined,
    inputB: Multiset<BValue> | undefined,
  ): Multiset<JoinResult<AValue, BValue, AAlias, BAlias>>;
  protected abstract _lazyJoin(
    version: Version,
  ): Multiset<JoinResult<AValue, BValue, AAlias, BAlias>>;

  #bufferA(inputA: Multiset<AValue> | undefined, aMsg: Reply) {
    assert(inputA !== undefined, 'inputA must be defined');
    assert(this._buffer.inputA === undefined, 'a must not already be buffered');
    this._buffer.aMsg = aMsg;
    this._buffer.inputA = inputA;
  }

  #bufferB(inputB: Multiset<BValue> | undefined, bMsg: Reply) {
    assert(inputB !== undefined, 'inputB must be defined');
    assert(this._buffer.inputB === undefined, 'b must not already be buffered');
    this._buffer.bMsg = bMsg;
    this._buffer.inputB = inputB;
  }

  toString() {
    return `indexa: ${this._indexA.toString()}\n\n\nindexb: ${this._indexB.toString()}`;
  }
}
