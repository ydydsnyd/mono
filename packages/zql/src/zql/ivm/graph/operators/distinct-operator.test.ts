import {expect, test} from 'vitest';
import type {Entry} from '../../multiset.js';
import {DifferenceStream} from '../difference-stream.js';

test('distinct', () => {
  type T = {
    id: string;
  };
  const input = new DifferenceStream<T>();
  const output = input.distinct();
  let version = 1;

  const items: Entry<T>[] = [];
  output.debug((v, d) => {
    expect(v).toBe(version);
    items.push(d);
  });

  input.newDifferences(
    version,
    [
      [{id: 'a'}, 1],
      [{id: 'b'}, 2],
      [{id: 'a'}, -1],
      [{id: 'c'}, -3],
    ],
    undefined,
  );
  input.commit(version);

  expect(items).toEqual([
    [
      [{id: 'b'}, 1],
      [{id: 'c'}, -1],
    ],
  ]);

  version++;
  items.length = 0;
  input.newDifferences(version, [[{id: 'b'}, -2]], undefined);
  input.commit(version);
  expect(items).toEqual([[[{id: 'b'}, -1]]]);

  version++;
  items.length = 0;
  input.newDifferences(version, [[{id: 'd'}, -1]], undefined);
  input.newDifferences(version, [[{id: 'd'}, 1]], undefined);
  input.commit(version);
  expect(items).toEqual([[[{id: 'd'}, -1]], [[{id: 'd'}, 1]]]);

  version++;
  items.length = 0;
  input.newDifferences(version, [[{id: 'e'}, -1]], undefined);
  input.newDifferences(version, [[{id: 'e'}, 5]], undefined);
  input.commit(version);
  expect(items).toEqual([[[{id: 'e'}, -1]], [[{id: 'e'}, 2]]]);

  version++;
  items.length = 0;
  input.newDifferences(version, [[{id: 'e'}, 5]], undefined);
  input.newDifferences(version, [[{id: 'e'}, -6]], undefined);
  input.commit(version);
  expect(items).toEqual([[[{id: 'e'}, 1]], [[{id: 'e'}, -2]]]);
});

test('distinct all', () => {
  type T = {id: string};
  const input = new DifferenceStream<T>();
  const output = input.distinctAll(x => x.id);
  let version = 1;

  const items: Entry<T>[] = [];
  output.effect((item, mult) => {
    items.push([item, mult]);
  });

  input.newDifferences(
    version,
    [
      [{id: 'a'}, 1],
      [{id: 'b'}, 2],
      [{id: 'a'}, -1],
      [{id: 'c'}, -3],
    ],
    undefined,
  );
  input.commit(version);
  check([
    [{id: 'a'}, 1],
    [{id: 'b'}, 1],
    [{id: 'a'}, -1],
    [{id: 'c'}, -1],
  ]);

  // output b and negative c
  input.newDifferences(
    version,
    [
      [{id: 'b'}, 1],
      [{id: 'c'}, -1],
    ],
    undefined,
  );
  input.commit(version);
  check([]);

  // move c to positive
  input.newDifferences(version, [[{id: 'c'}, 6]], undefined);
  input.commit(version);
  check([[{id: 'c'}, 1]]);

  // bring back a
  input.newDifferences(version, [[{id: 'a'}, 1]], undefined);
  input.commit(version);
  check([[{id: 'a'}, 1]]);

  // delete b fully
  input.newDifferences(version, [[{id: 'b'}, -3]], undefined);
  input.commit(version);
  check([[{id: 'b'}, -1]]);

  // more a and b. should be ignored.
  input.newDifferences(
    version,
    [
      [{id: 'a'}, 1],
      [{id: 'b'}, -1],
    ],
    undefined,
  );
  input.commit(version);
  check([]);

  function check(expected: Entry<T>[]) {
    expect(items).toEqual(expected);
    items.length = 0;
    ++version;
  }
});
