import type {DownstreamNode, UpstreamNode} from '../node.js';

export interface Operator extends UpstreamNode, DownstreamNode {}
