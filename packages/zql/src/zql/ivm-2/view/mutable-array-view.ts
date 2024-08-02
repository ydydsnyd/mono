import type {Ordering} from '../../ast-2/ast.js';
import type {Comparator} from '../../ivm/types.js';
import {makeComparator} from '../compare.js';
import type {DownstreamNode} from '../graph/node.js';
import {
  ADD,
  entity,
  Entry,
  event,
  IterableTree,
  NOP,
  REMOVE,
} from '../iterable-tree.js';
import type {Entity} from '../types.js';

/**
 * While data will come into the view ordered on initial hydration,
 * updates to the view will be in chronological, rather than comparator, order.
 *
 * To correctly place an edit into the view, we need a comparator.
 *
 * Since the view is a tree of arrays where each array in the tree can have its
 * own ordering, we need a tree of comparators.
 *
 * The ordering in a given path of this tree matches the ordering of the view
 * on the same path.
 */
export type OrderingTree = {
  [entity]: Ordering;
  [child: string]: OrderingTree;
};

/**
 * Same as `OrderingTree` but each `Ordering` has been transformed into a
 * `Comparator`.
 */
type ComparatorTree = {
  [entity]: Comparator<Entity>;
  [child: string]: ComparatorTree;
};

export type View = {
  [entity]: Entity;
  [child: string]: View;
}[];

/**
 * A tree of arrays.
 */
export class MutableArrayView implements DownstreamNode {
  readonly #comparators: ComparatorTree;
  readonly #view: View;

  constructor(orderingTree: OrderingTree) {
    this.#comparators = makeComparatorTree(orderingTree);
    this.#view = [];
  }

  get data() {
    return this.#view;
  }

  newDifference(_version: number, data: IterableTree<Entity>): void {
    updateViews(this.#view, data, this.#comparators);
  }

  // Notify subscribers to the view. Not implemented yet.
  commit(_version: number): void {}
}

// exported for testing
export function updateViews(
  view: View,
  data: IterableTree<Entity>,
  comparators: ComparatorTree,
) {
  for (const row of data) {
    updateCollection(view, row, comparators);
  }
}

function updateCollection(
  view: View,
  row: Entry<Entity>,
  comparators: ComparatorTree,
) {
  const rowEvent = row[event];
  const rowEntity = row[entity];

  if (rowEvent === NOP) {
    // find the spot and descend
    const index = binarySearch(view, rowEntity, comparators[entity]);
    const branch = view[index];
    for (const [key, child] of Object.entries(row)) {
      updateViews(branch[key], child, comparators[key]);
    }
  } else if (rowEvent === REMOVE) {
    // delete and do not descend
    const index = binarySearch(view, rowEntity, comparators[entity]);
    view.splice(index, 1);
  } else if (rowEvent === ADD) {
    // add the item and descend
    // this unfortunately re-creates an entire
    // tree for modification events.
    const index = binarySearch(view, rowEntity, comparators[entity]);
    view.splice(index, 0, initializeSubView(row));
  }
}

function initializeSubView(row: Entry<Entity>) {
  const viewItem: View[number] = {
    [entity]: row[entity],
  };

  for (const [key, child] of Object.entries(row)) {
    const childView: View = [];
    for (const entry of child) {
      childView.push(initializeSubView(entry));
    }
    viewItem[key] = childView;
  }

  return viewItem;
}

function makeComparatorTree(orderingTree: OrderingTree) {
  const result: ComparatorTree = {
    [entity]: makeComparator(orderingTree[entity]),
  };

  for (const [key, value] of Object.entries(orderingTree)) {
    result[key] = makeComparatorTree(value);
  }
  return result;
}

function binarySearch(
  view: View,
  target: Entity,
  comparator: Comparator<Entity>,
) {
  let low = 0;
  let high = view.length - 1;
  while (low <= high) {
    const mid = (low + high) >>> 1;
    const comparison = comparator(view[mid][entity], target);
    if (comparison < 0) {
      low = mid + 1;
    } else if (comparison > 0) {
      high = mid - 1;
    } else {
      return mid;
    }
  }
  return low;
}
