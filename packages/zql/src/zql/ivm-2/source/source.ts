import type {Ordering} from '../../ast-2/ast.js';
import type {Comparator, PipelineEntity, Version} from '../../ivm/types.js';
import type {Materialite} from '../materialite.js';
import BTree from 'btree';
import {DifferenceStream} from '../graph/difference-stream.js';
import {ADD, event, node, REMOVE} from '../iterable-tree.js';
import {makeComparator} from '../compare.js';

export interface Source<T extends PipelineEntity = PipelineEntity> {
  readonly stream: DifferenceStream<T>;
  add(value: T): void;
  remove(value: T): void;

  commit(version: Version): void;
}

export class MemorySource<T extends PipelineEntity> implements Source<T> {
  #tree: BTree<T, undefined>;
  readonly comparator: Comparator<T>;
  readonly name: string;
  readonly #materialite: Materialite;
  readonly stream: DifferenceStream<T>;

  constructor(materialite: Materialite, order: Ordering, name: string) {
    this.comparator = makeComparator(order);
    this.#tree = new BTree(undefined, this.comparator);
    this.name = name;
    this.#materialite = materialite;
    this.stream = new DifferenceStream<T>();
  }

  add(v: T) {
    this.#tree = this.#tree.with(v, undefined);
    this.stream.newDifference(this.#materialite.getTxVersion(), [
      {
        [node]: v,
        [event]: ADD,
      },
    ]);
    this.#materialite.addDirtySource(this as unknown as Source);
  }

  remove(v: T) {
    this.stream.newDifference(this.#materialite.getTxVersion(), [
      {
        [node]: v,
        [event]: REMOVE,
      },
    ]);
    this.#tree = this.#tree.without(v);
    this.#materialite.addDirtySource(this as unknown as Source);
  }

  commit(version: number): void {
    this.stream.commit(version);
  }
}
