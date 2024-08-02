import type {Condition} from '../../ast/ast.js';

export type PullRequest = {
  readonly requiredConstraint: Condition;
  // no required order.. we'll attach to sources that are
  // in the correct order.
};
