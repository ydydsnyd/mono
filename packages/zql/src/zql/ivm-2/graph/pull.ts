import type {Condition} from '../../ast/ast.js';

export type PullRequest = {
  /**
   * At this stage, `Condition` is likely the wrong shape. Rather than being a `selector` it should
   * be a path to the field in the IterableTree.
   *
   * Think of `issue -> comment -> revision`. When `revision` pulls on `comment`, this pull
   * needs to specify a path from `issue -> comment -> comment.id` rather than a selector.
   * You can see an example of this in the test case:
   * 'loop join with loop join' in this PR: https://github.com/rocicorp/mono/pull/2103
   *
   * We'll resolve the `Condition` type in a future PR.
   */
  readonly requiredConstraint: Condition;
  readonly optionalConstraints: Condition[];

  /**
   * `requiredOrder` is intentionally missing here.
   * Given we do not allow ordering by subqueries and we do not allow joins,
   * this implies that the sources are always driving the order of queries.
   *
   * Given that, we'll always attach pipelines to the sources
   * that have the correct order and order should not be required for pull.
   */
};
