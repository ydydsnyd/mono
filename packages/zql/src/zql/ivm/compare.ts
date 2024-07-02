import {unreachable} from 'shared/src/asserts.js';
import type {Ordering} from '../ast/ast.js';
import {getValueFromEntity} from './source/util.js';

export function compareEntityFields<T>(
  lVal: T,
  rVal: T,
  undefinedIsGreater: boolean = false,
) {
  if (lVal === rVal) {
    return 0;
  }

  if (undefinedIsGreater && lVal === undefined) {
    return 1;
  }
  if (undefinedIsGreater && rVal === undefined) {
    return -1;
  }

  if (lVal === null || lVal === undefined) {
    return -1;
  }
  if (rVal === null || rVal === undefined) {
    return 1;
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

export function makeComparator<T extends object>(
  orderBy: Ordering,
): (l: T, r: T, undefinedIsGreater?: boolean | undefined) => number {
  const comparator = (l: T, r: T, undefinedIsGreater?: boolean | undefined) => {
    for (const orderPart of orderBy) {
      const comp = compareEntityFields(
        getValueFromEntity(l as Record<string, unknown>, orderPart[0]),
        getValueFromEntity(r as Record<string, unknown>, orderPart[0]),
        undefinedIsGreater,
      );
      if (comp !== 0) {
        return orderPart[1] === 'asc' ? comp : -comp;
      }
    }

    return 0;
  };

  return comparator;
}
