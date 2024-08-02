import type {PipelineEntity, Version} from '../../ivm/types.js';
import type {IterableTree} from '../iterable-tree.js';
import type {PullRequest} from './pull.js';

export interface UpstreamNode<T = PipelineEntity> {
  pull(message: PullRequest): IterableTree<T>;
  destroy(): void;
}

export type DownstreamNode<T = PipelineEntity> = {
  newDifference: (version: Version, data: IterableTree<T>) => void;
  commit: (version: Version) => void;
};
