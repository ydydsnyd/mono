import {expect, test} from 'vitest';
import type {JSONObject} from '../../shared/src/json.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any;
type Issue = {
  id: number;
  title: string;
};
const event = Symbol();
type Event = Add | Remove | NoOp;
const ADD = 1;
const REMOVE = -1;
const NO_OP = 0;

type Add = typeof ADD;
type Remove = typeof REMOVE;
type NoOp = typeof NO_OP;
type Entry<Table = string, Type = JSONObject> =
  | ({
      [t in Table & string]: Type;
    } & {[event]: Event})
  | (Record<string, Iterable<Entry> | JSONObject> & {[event]: Event});

const issueSource: Entry<'issue', Issue>[] = [
  {
    issue: {
      id: 1,
      title: 'issue 1',
    },
    [event]: ADD,
  },
  {
    issue: {
      id: 2,
      title: 'issue 2',
    },
    [event]: ADD,
  },
];

type Comment = {id: number; issueId: number; text: string};
const commentSource: Entry<'comment', Comment>[] = [
  {
    comment: {
      id: 1,
      issueId: 1,
      text: 'comment 1',
    },
    [event]: ADD,
  },
  {
    comment: {
      id: 2,
      issueId: 1,
      text: 'comment 2',
    },
    [event]: ADD,
  },
  {
    comment: {
      id: 3,
      issueId: 2,
      text: 'comment 3',
    },
    [event]: ADD,
  },
];

type CommentRevision = {id: number; commentId: number; text: string};
const commentRevisionSource: Entry<'commentRevision', CommentRevision>[] = [
  {
    commentRevision: {
      id: 1,
      commentId: 1,
      text: 'comment revision 1',
    },
    [event]: ADD,
  },
  {
    commentRevision: {
      id: 2,
      commentId: 1,
      text: 'comment revision 2',
    },
    [event]: ADD,
  },
  {
    commentRevision: {
      id: 3,
      commentId: 2,
      text: 'comment revision 3',
    },
    [event]: ADD,
  },
];

type ResultType = {
  [table: string]: JSONObject | ResultType;
}[];

function* filter(
  path: string[],
  iterable: Iterable<Entry>,
  cb: (v: unknown) => boolean,
): IterableIterator<Entry> {
  const [head, ...tail] = path;
  for (const row of iterable) {
    if (tail.length === 0) {
      if (cb(row[head] as Entry<unknown>)) {
        yield row;
      }
    } else {
      yield {
        ...row,
        [head]: filter(tail, row[head] as Iterable<Entry>, cb),
      } as Entry;
    }
  }
}

function* loopJoin(
  left: Iterable<Entry>,
  right: Iterable<Entry>,
  leftItemPath: string[],
  rightItem: string,
  insertAs: string,
  cb: (left: unknown, right: unknown) => boolean,
): IterableIterator<Entry> {
  // We only ever get the parent most thing of the right, correct?
  // I think so.. since a query with a sub-query is a leftJoin(parent, child).
  // So we're always operating on the top level result of the child, right?

  const [leftHead, ...leftTail] = leftItemPath;
  for (const leftRow of left) {
    if (leftTail.length === 0) {
      // nest the right into the left
      yield {
        ...leftRow,
        [insertAs]: (function* () {
          for (const rightRow of right) {
            if (
              cb(
                leftRow[leftHead] as Entry<unknown>,
                rightRow[rightItem] as Entry<unknown>,
              )
            ) {
              yield rightRow;
            }
          }
        })(),
      } as Entry;
    } else {
      yield {
        ...leftRow,
        [leftHead]: loopJoin(
          leftRow[leftHead] as Iterable<Entry>,
          right,
          leftTail,
          rightItem,
          insertAs,
          cb,
        ),
      } as Entry;
    }
  }
}

function* topk(
  items: Iterable<Entry>,
  path: string[],
  comparator: (l: unknown, r: unknown) => number,
  k: number,
): IterableIterator<Entry> {
  const [head, ...tail] = path;
  if (head === undefined) {
    const sorted = [...items].sort(comparator);
    for (let i = 0; i < k; i++) {
      yield sorted[i];
    }
  } else {
    for (const row of items) {
      yield {
        ...row,
        [head]: topk(row[head] as Iterable<Entry>, tail, comparator, k),
      };
    }
  }
}

function restartable<T>(generatorFunc: () => IterableIterator<T>) {
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
  iterable: Iterable<Entry>,
  predicate: (v: unknown) => boolean,
) {
  return restartable(() => filter(path, iterable, predicate));
}

test('filter against a root source', () => {
  const result = [
    ...filter(['issue'], issueSource, v => (v as Issue).title === 'issue 1'),
  ];

  expect(result).toEqual([
    {
      issue: {
        id: 1,
        title: 'issue 1',
      },
      [event]: ADD,
    },
  ]);
});

test('re-pulling the stream', () => {
  const stream = restartableFilter(
    ['issue'],
    restartable(() => issueSource[Symbol.iterator]()),
    v => (v as Issue).title === 'issue 1',
  );

  const result = [...stream];

  expect(result).toEqual([
    {
      issue: {
        id: 1,
        title: 'issue 1',
      },
      [event]: ADD,
    },
  ]);

  const result2 = [...stream];
  expect(result2).toEqual(result);
});

test('loop join', () => {
  const stream = loopJoin(
    issueSource,
    commentSource,
    ['issue'],
    'comment',
    'comments',
    (left, right) => (left as Issue).id === (right as Comment).issueId,
  );

  const result = view(stream);
  expect(result).toEqual([
    {
      comments: [
        {
          comment: {
            id: 1,
            issueId: 1,
            text: 'comment 1',
          },
        },
        {
          comment: {
            id: 2,
            issueId: 1,
            text: 'comment 2',
          },
        },
      ],
      issue: {
        id: 1,
        title: 'issue 1',
      },
    },
    {
      comments: [
        {
          comment: {
            id: 3,
            issueId: 2,
            text: 'comment 3',
          },
        },
      ],
      issue: {
        id: 2,
        title: 'issue 2',
      },
    },
  ]);
});

test('loop join with a loop join', () => {
  const stream = loopJoin(
    loopJoin(
      issueSource,
      commentSource,
      ['issue'],
      'comment',
      'comments',
      (left, right) => (left as Issue).id === (right as Comment).issueId,
    ),
    commentRevisionSource,
    ['comments', 'comment'],
    'commentRevision',
    'commentRevisions',
    (left, right) =>
      (left as Comment).id === (right as CommentRevision).commentId,
  );

  const result = view(stream);
  expect(result).toEqual([
    {
      comments: [
        {
          comment: {
            id: 1,
            issueId: 1,
            text: 'comment 1',
          },
          commentRevisions: [
            {
              commentRevision: {
                commentId: 1,
                id: 1,
                text: 'comment revision 1',
              },
            },
            {
              commentRevision: {
                commentId: 1,
                id: 2,
                text: 'comment revision 2',
              },
            },
          ],
        },
        {
          comment: {
            id: 2,
            issueId: 1,
            text: 'comment 2',
          },
          commentRevisions: [
            {
              commentRevision: {
                commentId: 2,
                id: 3,
                text: 'comment revision 3',
              },
            },
          ],
        },
      ],
      issue: {
        id: 1,
        title: 'issue 1',
      },
    },
    {
      comments: [
        {
          comment: {
            id: 3,
            issueId: 2,
            text: 'comment 3',
          },
          commentRevisions: [],
        },
      ],
      issue: {
        id: 2,
        title: 'issue 2',
      },
    },
  ]);
});

test('topk actually sorts and limits a branch', () => {
  const stream = topk(
    loopJoin(
      issueSource,
      commentSource,
      ['issue'],
      'comment',
      'comments',
      (left, right) => (left as Issue).id === (right as Comment).issueId,
    ),
    ['comments'],
    (l, r) => (l as Comment).id - (r as Comment).id,
    1,
  );

  const result = view(stream);
  expect(result).toEqual([
    {
      comments: [
        {
          comment: {
            id: 1,
            issueId: 1,
            text: 'comment 1',
          },
        },
      ],
      issue: {
        id: 1,
        title: 'issue 1',
      },
    },
    {
      comments: [
        {
          comment: {
            id: 3,
            issueId: 2,
            text: 'comment 3',
          },
        },
      ],
      issue: {
        id: 2,
        title: 'issue 2',
      },
    },
  ]);
});

test('topk actually sorts and limits a parent', () => {
  const stream = topk(
    issueSource,
    [],
    (l, r) => (l as Issue).id - (r as Issue).id,
    1,
  );

  const result = view(stream);
  expect(result).toEqual([
    {
      issue: {
        id: 1,
        title: 'issue 1',
      },
    },
  ]);
});

function view(iterable: Iterable<Entry>): ResultType {
  const ret: ResultType = [];
  for (const row of iterable) {
    const newRow: {[table: string]: JSONObject | ResultType} = {};
    for (const [key, value] of Object.entries(row)) {
      if ((value as TODO)[Symbol.iterator]) {
        newRow[key] = view(value as Iterable<Entry>);
      } else {
        newRow[key] = value as Entry<unknown> as JSONObject;
      }
    }
    ret.push(newRow);
  }

  return ret;
}

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
