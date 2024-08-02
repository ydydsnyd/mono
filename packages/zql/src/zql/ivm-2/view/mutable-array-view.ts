import type {Ordering} from '../../ast-2/ast.js';
import type {Comparator, PipelineEntity} from '../../ivm/types.js';
import type {DownstreamNode} from '../graph/node.js';
import type {IterableTree, node} from '../iterable-tree.js';

export class MutableArrayView implements DownstreamNode {
  readonly #comparators: OrderingSpec;

  constructor(orderingSpec: OrderingSpec) {
    // this.#orderingSpec = orderingSpec;
    // traverse the spec making comparators
  }

  newDifference(version: number, data: IterableTree<PipelineEntity>): void {
    // consume the data
    // throw into the view as ordered by the spec
  }
  commit(version: number): void {}
}
// the view either needs to take a spec of all the
// orderings
// or the iterables need to be able to tell the view what orderings they support
type OrderingSpec = {
  [node]: Ordering[];
  [child: string]: OrderingSpec;
};

type ComparatorTree = {
  [node]: Comparator<PipelineEntity>;
  [child: string]: ComparatorTree;
};
