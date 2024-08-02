import type {DownstreamNode, UpstreamNode} from '../node.js';

/**
 * An `Operator` is an internal node in the graph.
 * Given that, is it both `Upstream` and `Downstream` of other nodes.
 *
 * See docs on the `UpstreamNode` and `DownstreamNode` interfaces for more information.
 */
export interface Operator extends UpstreamNode, DownstreamNode {}
