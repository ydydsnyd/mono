import {compareUTF8} from 'compare-utf8';
import {unreachable} from 'shared/src/asserts.js';
import type {Ordering} from '../ast-2/ast.js';
import type {Comparator, PipelineEntity} from '../ivm/types.js';

export function makeComparator<T extends PipelineEntity>(
  order: Ordering,
): Comparator<T> {
  return (a, b) => {
    for (const [field, direction] of order) {
      const comp = compareEntityFields(a[field], b[field]);
      if (comp !== 0) {
        return direction === 'asc' ? comp : -comp;
      }
    }
    return 0;
  };
}

export function compareEntityFields<T>(lVal: T, rVal: T) {
  if (lVal === rVal) {
    return 0;
  }
  if (lVal === null || lVal === undefined) {
    return -1;
  }
  if (rVal === null || rVal === undefined) {
    return 1;
  }
  if (typeof lVal === 'string') {
    // We compare all strings in zql as UTF-8. If we were only dealing with zql
    // on both client and server we could choose any ordering we want. But we
    // also need to consider that we sometimes ask other systems to sort for
    // us - specifically the database backing the source. So we need to choose
    // a sort that database can do too. UTF-8 is a commonly used collation and
    // the default encoding of many systems (though sadly not javascript).
    // For more, see: https://blog.replicache.dev/blog/replicache-11-adventures-in-text-encoding.
    return compareUTF8(lVal, rVal as string);
  }
  if (lVal < rVal) {
    return -1;
  }
  if (lVal > rVal) {
    return 1;
  }

  if (lVal instanceof Date && rVal instanceof Date) {
    return lVal.getTime() - rVal.getTime();
  }

  unreachable();
}
