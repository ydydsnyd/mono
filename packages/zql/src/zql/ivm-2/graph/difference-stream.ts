import {assert} from 'shared/src/asserts.js';
import {must} from 'shared/src/must.js';
import type {PipelineEntity} from '../../ivm/types.js';
import type {IterableTree} from '../iterable-tree.js';
import type {DownstreamNode, UpstreamNode} from './node.js';
import type {PullRequest} from './pull.js';

export class DifferenceStream<T extends PipelineEntity> {
  readonly #downstreams = new Set<DownstreamNode<T>>();
  #upstream: UpstreamNode<T> | undefined;

  addDownstream(listener: DownstreamNode<T>) {
    this.#downstreams.add(listener);
  }

  setUpstream(operator: UpstreamNode<T>) {
    assert(this.#upstream === undefined, 'upstream already set');
    this.#upstream = operator;
    return this;
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
