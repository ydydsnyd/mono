import {SimpleOperator} from '../ast/ast.js';

type OrderPart = [field: string, direction: 'asc' | 'desc'];
export type Ordering = OrderPart[];

/**
 * A path through the tree of entities
 */
export type Selector = {
  path: string[];
  field: string;
};

export type SimpleCondition = {
  readonly type: 'simple';
  readonly op: SimpleOperator;
  readonly field: Selector;
};
