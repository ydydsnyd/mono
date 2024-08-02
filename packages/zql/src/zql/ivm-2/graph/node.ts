import type {IterableTree} from '../iterable-tree.js';
import type {Entity, Version} from '../types.js';
import type {PullRequest} from './pull.js';

/**
 * There are three kinds of nodes in the dataflow graph:
 * 1. Sources
 * 2. Operators
 * 3. Views
 *
 * Sources and Operators can both be upstream of other nodes.
 * This interface is implemented by both Sources and Operators.
 */
export interface UpstreamNode<T = Entity> {
  pull(message: PullRequest): IterableTree<T>;
  /**
   * Destruction happens from the leaves of the graph to the root.
   *
   * This is because an upstream node may have many downstreams
   * with different lifetimes. The node should exist until all
   * of its children are gone.
   */
  destroy(): void;
}

/**
 * Operators and Views are both downstream of other nodes.
 * Either downstream of a source or downstream of another operator.
 *
 * Differences flow down from sources to operators to views (newDifference).
 * The notification that a transaction has completed also flows
 * down this same path (commit).
 *
 * This interface is implemented by both Operators and Views.
 */
export type DownstreamNode<T = Entity> = {
  /**
   * All DownstreamNodes in a pipeline, except for the view, are lazy.
   *
   * When they receive a `newDifference` call they take the `data` iterable
   * and transform it into a new iterable that is passed to the next node.
   *
   * E.g., filter doesn't actually filter the data, it just creates a new
   * iterable that will apply the filter when it is iterated.
   *
   * ```ts
   * function *filter(data: IterableTree, p: (t) => boolean) {
   *   for (const entry of data) {
   *     if (p(entry[0])) {
   *       yield entry;
   *     }
   *   }
   * }
   * ```
   */
  newDifference: (version: Version, data: IterableTree<T>) => void;

  /**
   * Commit events exist so Views and Effects know when to notify external
   * observers. An effect being a kind of operator that has side effects.
   *
   * As an IVM pipeline runs it can pass through inconsistent states.
   * To prevent those states from being observed, observers are not notified
   * until the transaction is complete.
   *
   * One great example of "inconsistent states" is an update.
   * An update is modeled as a `remove` followed by an `add`.
   * If someone were to observe the `remove` before the `add` they would
   * see the entity as removed when it should have been updated.
   */
  commit: (version: Version) => void;
};
