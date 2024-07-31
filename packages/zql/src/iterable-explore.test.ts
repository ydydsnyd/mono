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
  cb: (v: unknown) => boolean,
): Iterable<ItemType> {
  const [head, ...tail] = path;
  for (const row of iterable) {
    if (tail.length === 0) {
      if (cb(row[head])) {
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
