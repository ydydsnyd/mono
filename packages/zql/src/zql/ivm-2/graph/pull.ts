import type {Ordering, SimpleCondition} from '../../ast-2/ast.js';

export type PullRequest = {
  /**
   * If a require constraint is present it MUST be honored.
   * This is used for `incrementalPull` so an operator only gets
   * the rows that it would have indexed itself had it had memory.
   */
  readonly requiredConstraint?: SimpleCondition | undefined;
  /**
   * These are constraints collected upstream of the node that issued a `pull`.
   * They can be honored by the source or not.
   *
   * The reason it is safe to ignore these constraints is that nodes downstream
   * of the source, but upstream of the puller,
   * will filter out the rows that do not match the constraints.
   */
  readonly optionalConstraints: SimpleCondition[];

  /**
   * This is the order desired by the pulling node.
   * This order can be ignored. If it is ignored, the pulling
   * node will have to sort the data itself.
   *
   * Order is included in the pull message as all pipelines are attached
   * to the "canonical source" which is sorted in `id` order.
   *
   * The canonical source will direct the pull to the correctly
   * sorted version of itself if one exists (same as ivm-1 does).
   *
   * Why do all pipelines attach to the canonical source?
   *
   * In the future we _must_ do pipeline sharing and indexed operators.
   * It simply will not be possible to scale IVM otherwise.
   *
   * A simple example: 1,000 connected clients
   * all with 100 open point queries.
   *
   * On every single diff, do we really want to check 100,000
   * pipelines?
   *
   * Since difference events are not sorted it makes sense for everyone
   * to attach to the canonical source and only use sorted sources for pull.
   *
   * All pipelines that share the same structure and come from the same
   * canonical source can be merged into a single pipeline or a single
   * pipeline prefix that forks into divergent pipelines.
   *
   * Indexed operators is the idea that a single operator node can be
   * used to service thousands of variants of the operator. E.g.,
   * `id = ?`. All `id` comparisons can use the same operator node.
   * The node holds an index from `value` to `outboundPath`. In the point query
   * example, this means all 100,000 point queries would be serviced by the same
   * operator and the operator would have an index from `id` to `outboundPath`.
   *
   * Visual: https://www.notion.so/replicache/WIP-Operator-Parameter-Index-d56d29cee656499296501ba247e688dc
   */
  readonly order?: Ordering | undefined;
};
