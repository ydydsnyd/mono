import type {Ordering} from '../../ast-2/ast.js';
import type {Comparator} from '../../ivm/types.js';
import type {Materialite} from '../materialite.js';
import BTree from 'btree';
import {DifferenceStream} from '../graph/difference-stream.js';
import {ADD, event, entity, REMOVE, Entry} from '../iterable-tree.js';
import {makeComparator} from '../compare.js';
import type {Entity, Version} from '../types.js';
import type {UpstreamNode} from '../graph/node.js';
import type {PullRequest} from '../graph/pull.js';
import {gen} from '../../util/iterables.js';
import {must} from 'shared/src/must.js';

/**
 * A `Source` is the root of an IVM pipeline.
 * All events enter a source and flow down through attached
 * pipelines to the views.
 *
 * A `source` only exposes `add` and `remove` as `updates` are modeled as
 * 1. remove the old value
 * 2. add the new value
 *
 * `commit` is an internal method used by `Materialite` to denote the end of a transaction.
 */
export interface Source<T extends Entity = Entity> extends UpstreamNode<T> {
  readonly stream: DifferenceStream<T>;
  add(value: T): void;
  remove(value: T): void;

  commit(version: Version): void;
}

/**
 * A `MemorySource` is a `Source` that stores its data in memory.
 *
 * This data is kept in sorted order as downstream pipelines will
 * always expect the data they receive from `pull` to be in sorted order.
 *
 * Related:
 * Incremental Pull: https://www.notion.so/replicache/Incremental-Pull-f3eea25558c843e0b3a8e53034f1e0be
 * Hydration Planner: https://www.notion.so/replicache/Hydration-Query-Planner-d1a4634b1390459e8e1fa454a2396841
 */
export class MemorySource<T extends Entity> implements Source<T> {
  #tree: BTree<T, undefined>;
  readonly comparator: Comparator<T>;
  readonly name: string;
  readonly #materialite: Materialite;
  #stream: DifferenceStream<T> | undefined;

  constructor(materialite: Materialite, order: Ordering, name: string) {
    this.comparator = makeComparator(order);
    this.#tree = new BTree(undefined, this.comparator);
    this.name = name;
    this.#materialite = materialite;
    this.#stream = new DifferenceStream<T>();
  }

  get stream() {
    return must(this.#stream);
  }

  add(v: T) {
    this.#tree = this.#tree.with(v, undefined);
    this.stream.newDifference(this.#materialite.getTxVersion(), [
      {
        [entity]: v,
        [event]: ADD,
      },
    ]);
    this.#materialite.addDirtySource(this as unknown as Source);
  }

  remove(v: T) {
    this.stream.newDifference(this.#materialite.getTxVersion(), [
      {
        [entity]: v,
        [event]: REMOVE,
      },
    ]);
    this.#tree = this.#tree.without(v);
    this.#materialite.addDirtySource(this as unknown as Source);
  }

  commit(version: number): void {
    this.stream.commit(version);
  }

  pull(_message: PullRequest) {
    const tree = this.#tree;
    return gen(() => genTreeAsEntries(tree));
  }

  destroy(): void {
    this.#stream = undefined;
  }
}

function* genTreeAsEntries<T>(tree: BTree<T, undefined>): Generator<Entry<T>> {
  for (const row of tree.keys()) {
    yield {
      [entity]: row,
      [event]: ADD,
    };
  }
}
