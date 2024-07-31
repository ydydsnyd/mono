import {expect, test} from 'vitest';
import type {Entry} from './zql/ivm/multiset.js';

type Issue = {
  id: number;
  title: string;
};
const issueSource: Entry<Issue>[] = [
  [
    {
      id: 1,
      title: 'issue 1',
    },
    1,
  ],
  [
    {
      id: 2,
      title: 'issue 2',
    },
    1,
  ],
];

type ItemType = {
  [table: string]: Entry<unknown> | Iterable<ItemType>;
};

function* sourceToStream(tableName: string, source: Iterable<Entry<unknown>>) {
  for (const entry of source) {
    yield {
      [tableName]: entry,
    } satisfies ItemType;
  }
}

function* filter(
  path: string[],
  iterable: Iterable<ItemType>,
  cb: (v: Entry<unknown>) => boolean,
): IterableIterator<ItemType> {
  const [head, ...tail] = path;
  for (const row of iterable) {
    if (tail.length === 0) {
      if (cb(row[head] as Entry<unknown>)) {
        yield row;
      }
    } else {
      yield {
        ...row,
        [head]: filter(tail, row[head] as Iterable<ItemType>, cb),
      } as ItemType;
    }
  }
}

function restartable<T>(generatorFunc: () => Iterator<T>) {
  let iter: Iterator<T>;
  return {
    [Symbol.iterator]() {
      iter = generatorFunc();
      return this;
    },
    next() {
      return iter.next();
    },
    return() {
      return iter.return!();
    },
    throw(e: unknown) {
      return iter.throw!(e);
    },
  };
}

function restartableFilter(
  path: string[],
  iterable: Iterable<ItemType>,
  predicate: (v: Entry<unknown>) => boolean,
) {
  return restartable(() => filter(path, iterable, predicate));
}

test('filter against a root source', () => {
  const result = [
    ...filter(
      ['issue'],
      sourceToStream('issue', issueSource),
      v => (v as Entry<Issue>)[0].title === 'issue 1',
    ),
  ];

  expect(result).toEqual([
    {
      issue: [
        {
          id: 1,
          title: 'issue 1',
        },
        1,
      ],
    },
  ]);
});

test('re-pulling the stream', () => {
  const stream = restartableFilter(
    ['issue'],
    restartable(() => sourceToStream('issue', issueSource)),
    v => (v as Entry<Issue>)[0].title === 'issue 1',
  );

  const result = [...stream];

  expect(result).toEqual([
    {
      issue: [
        {
          id: 1,
          title: 'issue 1',
        },
        1,
      ],
    },
  ]);

  const result2 = [...stream];
  expect(result2).toEqual(result);
});

// This fails. Side 1 gets the first value, side 2 gets the second value.
// test('forked stream -- both sides see the same values', () => {
//   const stream = restartableFilter(
//     ['issue'],
//     restartable(() => sourceToStream('issue', issueSource)),
//     _ => true,
//   );

//   const side1 = stream[Symbol.iterator]();
//   const side2 = stream[Symbol.iterator]();

//   const side1Results = [];
//   const side2Results = [];
//   for (;;) {
//     const side1Next = side1.next();
//     const side2Next = side2.next();
//     if (side1Next.done && side2Next.done) {
//       break;
//     }
//     side1Results.push(side1Next.value);
//     side2Results.push(side2Next.value);
//   }

//   expect(side1Results).toEqual(side2Results);
//   expect(side1Results.length).toEqual(issueSource.length);
//   expect(side1Results).toEqual([...stream]);
//   console.log(side1Results);
// });
