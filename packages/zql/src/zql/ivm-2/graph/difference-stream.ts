import {must} from 'shared/src/must.js';
import type {IterableTree} from '../iterable-tree.js';
import type {Entity} from '../types.js';
import type {DownstreamNode, UpstreamNode} from './node.js';
import type {PullRequest} from './pull.js';

/**
 * This class allows
 * 1. An `UpstreamNode` to send differences to a set of `DownstreamNode`s
 * 2. A `DownstreamNode` to request a pull from the `UpstreamNode`
 *
 * It admittedly doesn't do much besides manage the list of `#downstreams` and the single `#upstream`.
 *
 * It exists as both the `Source` and `Operator` types need this capability.
 * Acquiring the capability through composition over inheritance feels much cleaner
 * and causes less problems (class hierarchy struggles) down the line.
 */
export class DifferenceStream<T extends Entity = Entity> {
  readonly #downstreams = new Set<DownstreamNode<T>>();
  #upstream: UpstreamNode<T>;

  constructor(upstream: UpstreamNode<T>) {
    this.#upstream = upstream;
  }

  addDownstream(listener: DownstreamNode<T>) {
    this.#downstreams.add(listener);
  }

  newDifference(version: number, data: IterableTree<T>) {
    for (const listener of this.#downstreams) {
      listener.newDifference(version, data);
    }
  }

  pull(msg: PullRequest): IterableTree<T> {
    return must(this.#upstream).pull(msg);
  }

  commit(version: number) {
    for (const listener of this.#downstreams) {
      listener.commit(version);
    }
  }
}
