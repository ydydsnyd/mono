import {describe, expect, test} from 'vitest';
import {genFlatMap, mapIter} from './iterables.js';

test('mapIter', () => {
  const iterable = [1, 2, 3];
  const result = mapIter(iterable, (x, i) => x + i);
  expect([...result]).toEqual([1, 3, 5]);
});

describe('genFlatMap', () => {
  test('basic iteration', () => {
    const iterable = [[1], [2, 3], [4, 5, 6]];
    const flatMapper = genFlatMap(
      () => iterable,
      x => x,
    );

    expect([...flatMapper]).toEqual([1, 2, 3, 4, 5, 6]);
    // can iterate it a second time
    expect([...flatMapper]).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('finally is called if we stop consuming the iterator', () => {
    let finallyCalled = false;
    const iterable = [[1], [2, 3], [4, 5, 6]];
    const flatMapper = genFlatMap(
      () => iterable,
      x => x,
      () => {
        finallyCalled = true;
      },
    );

    const iterator = flatMapper[Symbol.iterator]();
    expect(iterator.next()).toEqual({value: 1, done: false});
    expect(iterator.return()).toEqual({value: undefined, done: true});
    expect(finallyCalled).toBe(true);

    finallyCalled = false;
    let i = 0;
    for (const _ of flatMapper) {
      ++i;
      if (i > 3) {
        break;
      }
    }
    expect(finallyCalled).toBe(true);
  });
});
