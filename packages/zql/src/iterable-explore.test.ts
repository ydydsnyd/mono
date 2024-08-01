import {expect, test} from 'vitest';
import type {JSONObject} from '../../shared/src/json.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TODO = any;
type Issue = {
  id: number;
  title: string;
};
const event = Symbol();
const node = Symbol();
type Event = Add | Remove | NoOp;
const ADD = 1;
const REMOVE = -1;
const NO_OP = 0;

type Add = typeof ADD;
type Remove = typeof REMOVE;
type NoOp = typeof NO_OP;
type Entry<Type = JSONObject> = {
  [node]: Type;
  [event]: Event;
  [children: string]: Iterable<Entry>;
};

const issueSource: Entry<Issue>[] = [
  {
    [node]: {
      id: 1,
      title: 'issue 1',
    },
    [event]: ADD,
  },
  {
    [node]: {
      id: 2,
      title: 'issue 2',
    },
    [event]: ADD,
  },
];

type Comment = {id: number; issueId: number; text: string};
const commentSource: Entry<Comment>[] = [
  {
    [node]: {
      id: 1,
      issueId: 1,
      text: 'comment 1',
    },
    [event]: ADD,
  },
  {
    [node]: {
      id: 2,
      issueId: 1,
      text: 'comment 2',
    },
    [event]: ADD,
  },
  {
    [node]: {
      id: 3,
      issueId: 2,
      text: 'comment 3',
    },
    [event]: ADD,
  },
];

type CommentRevision = {id: number; commentId: number; text: string};
const commentRevisionSource: Entry<CommentRevision>[] = [
  {
    [node]: {
      id: 1,
      commentId: 1,
      text: 'comment revision 1',
    },
    [event]: ADD,
  },
  {
    [node]: {
      id: 2,
      commentId: 1,
      text: 'comment revision 2',
    },
    [event]: ADD,
  },
  {
    [node]: {
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
  path: (string | typeof node)[],
  iterable: Iterable<Entry>,
  cb: (v: unknown) => boolean,
): IterableIterator<Entry> {
  const [head, ...tail] = path;
  for (const row of iterable) {
    if (tail.length === 0) {
      if (cb(row[head])) {
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

function* map(
  path: (string | typeof node)[],
  iterable: Iterable<Entry>,
  cb: (v: unknown) => unknown,
): IterableIterator<Entry> {
  const [head, ...tail] = path;
  for (const row of iterable) {
    if (tail.length === 0) {
      yield {
        ...row,
        [head]: cb(row[head]) as TODO,
      };
    } else {
      yield {
        ...row,
        [head]: map(tail, row[head] as Iterable<Entry>, cb),
      };
    }
  }
}

function* loopJoin(
  left: Iterable<Entry>,
  right: Iterable<Entry>,
  leftItemPath: (string | typeof node)[],
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
            if (cb(leftRow[leftHead], rightRow[node])) {
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

function fork(stream: Iterable<Entry>, numTimes: number): Iterable<Entry>[] {
  const streams = Array.from({length: numTimes}, () =>
    stream[Symbol.iterator](),
  );
  return streams as IterableIterator<Entry>[];
}

function* merge(streams: Iterable<Entry>[]): Iterable<Entry> {
  const iters = streams.map(s => s[Symbol.iterator]());
  for (;;) {
    let done = true;
    for (const iter of iters) {
      const next = iter.next();
      if (next.done) {
        continue;
      }
      done = false;
      yield next.value;
    }

    if (done) {
      break;
    }
  }

  for (const iter of iters) {
    iter.return!();
  }
}

function* mergeDistinct(streams: Iterable<Entry>[]): Iterable<Entry> {
  const iters = streams.map(s => s[Symbol.iterator]());
  for (;;) {
    let done = true;
    const seenIds = new Set<number>();
    for (const iter of iters) {
      const next = iter.next();
      if (next.done) {
        continue;
      }
      done = false;
      if (seenIds.has(next.value[node].id as number)) {
        continue;
      }
      seenIds.add(next.value[node].id as number);
      yield next.value;
    }

    if (done) {
      break;
    }
  }

  for (const iter of iters) {
    iter.return?.();
  }
}

test('fork and merge', () => {
  const stream = restartable(() =>
    filter([node], issueSource, v => (v as Issue).title === 'issue 1'),
  );

  const forked = fork(stream, 2);
  const merged = merge(forked);

  const result = [...merged];
  expect(result).toEqual([
    {
      [node]: {
        id: 1,
        title: 'issue 1',
      },
      [event]: ADD,
    },
    {
      [node]: {
        id: 1,
        title: 'issue 1',
      },
      [event]: ADD,
    },
  ]);
});

test('fork and merge distinct', () => {
  let numVisits = 0;
  const stream = restartable(() =>
    map([node], issueSource, x => {
      numVisits++;
      return x;
    }),
  );

  const forked = fork(stream, 4);
  const merged = mergeDistinct(forked);

  const result = [...merged];
  expect(result).toEqual(issueSource);
  expect(numVisits).toEqual(4 * issueSource.length);
});

class RestartableIterableIterator<T> {
  readonly #iter: Iterator<T> | undefined;
  readonly #func: () => IterableIterator<T>;

  constructor(func: () => IterableIterator<T>, invoke: boolean) {
    if (invoke) {
      this.#iter = func();
    }

    this.#func = func;
  }

  [Symbol.iterator]() {
    return new RestartableIterableIterator(this.#func, true);
  }
  next() {
    return this.#iter!.next();
  }
  return() {
    return this.#iter!.return!();
  }
  throw(e: unknown) {
    return this.#iter!.throw!(e);
  }
}

function restartable<T>(generatorFunc: () => IterableIterator<T>) {
  return new RestartableIterableIterator(generatorFunc, false);
}

test('filter against a root source', () => {
  const result = [
    ...filter([node], issueSource, v => (v as Issue).title === 'issue 1'),
  ];

  expect(result).toEqual([
    {
      [node]: {
        id: 1,
        title: 'issue 1',
      },
      [event]: ADD,
    },
  ]);
});

test('re-pulling the stream', () => {
  const stream = restartable(() =>
    filter([node], issueSource, v => (v as Issue).title === 'issue 1'),
  );

  const result = [...stream];

  expect(result).toEqual([
    {
      [node]: {
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
    [node],
    'comments',
    (left, right) => (left as Issue).id === (right as Comment).issueId,
  );

  const result = view(stream);
  expect(result).toEqual([
    {
      comments: [
        {
          node: {
            id: 1,
            issueId: 1,
            text: 'comment 1',
          },
        },
        {
          node: {
            id: 2,
            issueId: 1,
            text: 'comment 2',
          },
        },
      ],
      node: {
        id: 1,
        title: 'issue 1',
      },
    },
    {
      comments: [
        {
          node: {
            id: 3,
            issueId: 2,
            text: 'comment 3',
          },
        },
      ],
      node: {
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
      [node],
      'comments',
      (left, right) => (left as Issue).id === (right as Comment).issueId,
    ),
    commentRevisionSource,
    ['comments', node],
    'commentRevisions',
    (left, right) =>
      (left as Comment).id === (right as CommentRevision).commentId,
  );

  const result = view(stream);
  expect(result).toEqual([
    {
      comments: [
        {
          node: {
            id: 1,
            issueId: 1,
            text: 'comment 1',
          },
          commentRevisions: [
            {
              node: {
                commentId: 1,
                id: 1,
                text: 'comment revision 1',
              },
            },
            {
              node: {
                commentId: 1,
                id: 2,
                text: 'comment revision 2',
              },
            },
          ],
        },
        {
          node: {
            id: 2,
            issueId: 1,
            text: 'comment 2',
          },
          commentRevisions: [
            {
              node: {
                commentId: 2,
                id: 3,
                text: 'comment revision 3',
              },
            },
          ],
        },
      ],
      node: {
        id: 1,
        title: 'issue 1',
      },
    },
    {
      comments: [
        {
          node: {
            id: 3,
            issueId: 2,
            text: 'comment 3',
          },
          commentRevisions: [],
        },
      ],
      node: {
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
      [node],
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
          node: {
            id: 1,
            issueId: 1,
            text: 'comment 1',
          },
        },
      ],
      node: {
        id: 1,
        title: 'issue 1',
      },
    },
    {
      comments: [
        {
          node: {
            id: 3,
            issueId: 2,
            text: 'comment 3',
          },
        },
      ],
      node: {
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
      node: {
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
      newRow[key] = view(value as Iterable<Entry>);
    }
    newRow.node = row[node];
    ret.push(newRow);
  }

  return ret;
}

// This works via `restartable2` -- both sides see the same values.
test('forked stream -- both sides see the same values via `restartable2`', () => {
  const stream = restartable(() => filter([node], issueSource, _ => true));

  const side1 = stream[Symbol.iterator]();
  const side2 = stream[Symbol.iterator]();

  const side1Results = [];
  const side2Results = [];
  for (;;) {
    const side1Next = side1.next();
    const side2Next = side2.next();
    if (side1Next.done && side2Next.done) {
      break;
    }
    side1Results.push(side1Next.value);
    side2Results.push(side2Next.value);
  }

  expect(side1Results).toEqual(side2Results);
  expect(side1Results.length).toEqual(issueSource.length);
  expect(side1Results).toEqual([...stream]);
});
