import {assert} from 'shared/src/asserts.js';
import {SimpleOperator, Condition} from '../ast/ast.js';
import {Row, Value} from '../ivm/data.js';
import {getLikePredicate} from './like.js';
import {StaticQueryParameters} from './builder.js';

export type NonNullValue = Exclude<Value, null | undefined>;
export type SimplePredicate = (rhs: NonNullValue) => boolean;

export function createPredicate(
  condition: Condition,
  staticQueryParameters: StaticQueryParameters | undefined,
) {
  switch (condition.type) {
    case 'simple': {
      const impl = createPredicateImpl(condition.value, condition.op);
      return (row: Row) => {
        const lhs = row[condition.field];
        if (lhs === null || lhs === undefined) {
          return false;
        }
        return impl(lhs);
      };
    }
    case 'parameterized': {
      assert(
        staticQueryParameters !== undefined,
        'Got a parameterized condition but no staticQueryParameters',
      );
      const anchor = staticQueryParameters[condition.value.anchor];
      assert(
        anchor !== undefined,
        `Missing parameter: ${condition.value.anchor}`,
      );
      const value = anchor[condition.value.field];
      const impl = createPredicateImpl(
        value as NonNullValue | readonly NonNullValue[],
        condition.op,
      );
      return (row: Row) => {
        const lhs = row[condition.field];
        if (lhs === null || lhs === undefined) {
          return false;
        }
        return impl(lhs);
      };
    }
    default:
      condition satisfies never;
      throw new Error(`Unexpected condition type: ${condition}`);
  }
}

function createPredicateImpl(
  rhs: NonNullValue | readonly NonNullValue[],
  operator: SimpleOperator,
): SimplePredicate {
  switch (operator) {
    case '=':
      return lhs => lhs === rhs;
    case '!=':
      return lhs => lhs !== rhs;
    case '<':
      return lhs => lhs < rhs;
    case '<=':
      return lhs => lhs <= rhs;
    case '>':
      return lhs => lhs > rhs;
    case '>=':
      return lhs => lhs >= rhs;
    case 'LIKE':
      return getLikePredicate(rhs as NonNullValue, '');
    case 'NOT LIKE':
      return not(getLikePredicate(rhs as NonNullValue, ''));
    case 'ILIKE':
      return getLikePredicate(rhs as NonNullValue, 'i');
    case 'NOT ILIKE':
      return not(getLikePredicate(rhs as NonNullValue, 'i'));
    case 'IN': {
      assert(Array.isArray(rhs));
      const set = new Set(rhs);
      return lhs => set.has(lhs);
    }
    case 'NOT IN': {
      assert(Array.isArray(rhs));
      const set = new Set(rhs);
      return lhs => !set.has(lhs);
    }
    default:
      operator satisfies never;
      throw new Error(`Unexpected operator: ${operator}`);
  }
}

function not<T>(f: (lhs: T) => boolean) {
  return (lhs: T) => !f(lhs);
}
