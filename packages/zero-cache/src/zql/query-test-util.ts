import type {
  Condition,
  Conjunction,
  Primitive,
  SimpleCondition,
  SimpleOperator,
} from '@rocicorp/zql/dist/zql/ast/ast.js';

// Readability helpers
export function and(...conditions: Condition[]): Conjunction {
  return {
    type: 'conjunction',
    op: 'AND',
    conditions,
  };
}

export function or(...conditions: Condition[]): Conjunction {
  return {
    type: 'conjunction',
    op: 'OR',
    conditions,
  };
}

export function cond(
  field: string,
  op: SimpleOperator,
  value: Primitive,
): SimpleCondition {
  return {
    type: 'simple',
    field,
    op,
    value: {
      type: 'literal',
      value,
    },
  };
}
