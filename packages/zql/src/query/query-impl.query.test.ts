import {describe, expect, test} from 'vitest';
import {deepClone} from '../../../shared/src/deep-clone.js';
import {must} from '../../../shared/src/must.js';
import {MemorySource} from '../ivm/memory-source.js';
import {newQuery, type QueryDelegate, QueryImpl} from './query-impl.js';
import type {AdvancedQuery} from './query-internal.js';
import type {DefaultQueryResultRow} from './query.js';
import {QueryDelegateImpl} from './test/query-delegate.js';
import {issueSchema, userSchema} from './test/testSchemas.js';

/**
 * Some basic manual tests to get us started.
 *
 * We'll want to implement a "dumb query runner" then
 * 1. generate queries with something like fast-check
 * 2. generate a script of mutations
 * 3. run the queries and mutations against the dumb query runner
 * 4. run the queries and mutations against the real query runner
 * 5. compare the results
 *
 * The idea being there's little to no bugs in the dumb runner
 * and the generative testing will cover more than we can possibly
 * write by hand.
 */

function addData(queryDelegate: QueryDelegate) {
  const userSource = must(queryDelegate.getSource('user'));
  const issueSource = must(queryDelegate.getSource('issue'));
  const commentSource = must(queryDelegate.getSource('comment'));
  const revisionSource = must(queryDelegate.getSource('revision'));
  const labelSource = must(queryDelegate.getSource('label'));
  const issueLabelSource = must(queryDelegate.getSource('issueLabel'));
  userSource.push({
    type: 'add',
    row: {
      id: '0001',
      name: 'Alice',
      metadata: {
        registrar: 'github',
        login: 'alicegh',
      },
    },
  });
  userSource.push({
    type: 'add',
    row: {
      id: '0002',
      name: 'Bob',
      metadata: {
        registar: 'google',
        login: 'bob@gmail.com',
        altContacts: ['bobwave', 'bobyt', 'bobplus'],
      },
    },
  });
  issueSource.push({
    type: 'add',
    row: {
      id: '0001',
      title: 'issue 1',
      description: 'description 1',
      closed: false,
      ownerId: '0001',
    },
  });
  issueSource.push({
    type: 'add',
    row: {
      id: '0002',
      title: 'issue 2',
      description: 'description 2',
      closed: false,
      ownerId: '0002',
    },
  });
  issueSource.push({
    type: 'add',
    row: {
      id: '0003',
      title: 'issue 3',
      description: 'description 3',
      closed: false,
      ownerId: null,
    },
  });

  commentSource.push({
    type: 'add',
    row: {
      id: '0001',
      authorId: '0001',
      issueId: '0001',
      body: 'comment 1',
    },
  });
  commentSource.push({
    type: 'add',
    row: {
      id: '0002',
      authorId: '0002',
      issueId: '0001',
      body: 'comment 2',
    },
  });
  revisionSource.push({
    type: 'add',
    row: {
      id: '0001',
      authorId: '0001',
      commentId: '0001',
      text: 'revision 1',
    },
  });

  labelSource.push({
    type: 'add',
    row: {
      id: '0001',
      name: 'label 1',
    },
  });
  issueLabelSource.push({
    type: 'add',
    row: {
      issueId: '0001',
      labelId: '0001',
    },
  });
}

describe('bare select', () => {
  test('empty source', () => {
    const queryDelegate = new QueryDelegateImpl();
    const issueQuery = newQuery(queryDelegate, issueSchema);
    const m = issueQuery.materialize();

    let rows: readonly unknown[] = [];
    let called = false;
    m.addListener(data => {
      called = true;
      rows = deepClone(data) as unknown[];
    });

    expect(called).toBe(true);
    expect(rows).toEqual([]);

    called = false;
    m.addListener(_ => {
      called = true;
    });
    expect(called).toBe(true);
  });

  test('empty source followed by changes', () => {
    const queryDelegate = new QueryDelegateImpl();
    const issueQuery = newQuery(queryDelegate, issueSchema);
    const m = issueQuery.materialize();

    let rows: unknown[] = [];
    m.addListener(data => {
      rows = deepClone(data) as unknown[];
    });

    expect(rows).toEqual([]);

    queryDelegate.getSource('issue').push({
      type: 'add',
      row: {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    });
    queryDelegate.commit();

    expect(rows).toEqual([
      {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    ]);

    queryDelegate.getSource('issue').push({
      type: 'remove',
      row: {
        id: '0001',
      },
    });
    queryDelegate.commit();

    expect(rows).toEqual([]);
  });

  test('source with initial data', () => {
    const queryDelegate = new QueryDelegateImpl();
    queryDelegate.getSource('issue').push({
      type: 'add',
      row: {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    });

    const issueQuery = newQuery(queryDelegate, issueSchema);
    const m = issueQuery.materialize();

    let rows: unknown[] = [];
    m.addListener(data => {
      rows = deepClone(data) as unknown[];
    });

    expect(rows).toEqual([
      {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    ]);
  });

  test('source with initial data followed by changes', () => {
    const queryDelegate = new QueryDelegateImpl();

    queryDelegate.getSource('issue').push({
      type: 'add',
      row: {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    });

    const issueQuery = newQuery(queryDelegate, issueSchema);
    const m = issueQuery.materialize();

    let rows: unknown[] = [];
    m.addListener(data => {
      rows = deepClone(data) as unknown[];
    });

    expect(rows).toEqual([
      {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    ]);

    queryDelegate.getSource('issue').push({
      type: 'add',
      row: {
        id: '0002',
        title: 'title2',
        description: 'description2',
        closed: false,
        ownerId: '0002',
      },
    });
    queryDelegate.commit();

    expect(rows).toEqual([
      {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
      {
        id: '0002',
        title: 'title2',
        description: 'description2',
        closed: false,
        ownerId: '0002',
      },
    ]);
  });

  test('changes after destroy', () => {
    const queryDelegate = new QueryDelegateImpl();
    const issueQuery = newQuery(queryDelegate, issueSchema);
    const m = issueQuery.materialize();

    let rows: unknown[] = [];
    m.addListener(data => {
      rows = deepClone(data) as unknown[];
    });

    expect(rows).toEqual([]);

    queryDelegate.getSource('issue').push({
      type: 'add',
      row: {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    });
    queryDelegate.commit();

    expect(rows).toEqual([
      {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    ]);

    m.destroy();

    queryDelegate.getSource('issue').push({
      type: 'remove',
      row: {
        id: '0001',
      },
    });
    queryDelegate.commit();

    // rows did not change
    expect(rows).toEqual([
      {
        id: '0001',
        title: 'title',
        description: 'description',
        closed: false,
        ownerId: '0001',
      },
    ]);
  });
});

describe('joins and filters', () => {
  test('filter', () => {
    const queryDelegate = new QueryDelegateImpl();
    addData(queryDelegate);

    const issueQuery = newQuery(queryDelegate, issueSchema).where(
      'title',
      '=',
      'issue 1',
    );

    const singleFilterView = issueQuery.materialize();
    let singleFilterRows: {id: string}[] = [];
    let doubleFilterRows: {id: string}[] = [];
    let doubleFilterWithNoResultsRows: {id: string}[] = [];
    const doubleFilterView = issueQuery
      .where('closed', '=', false)
      .materialize();
    const doubleFilterViewWithNoResults = issueQuery
      .where('closed', '=', true)
      .materialize();

    singleFilterView.addListener(data => {
      singleFilterRows = deepClone(data) as {id: string}[];
    });
    doubleFilterView.addListener(data => {
      doubleFilterRows = deepClone(data) as {id: string}[];
    });
    doubleFilterViewWithNoResults.addListener(data => {
      doubleFilterWithNoResultsRows = deepClone(data) as {id: string}[];
    });

    expect(singleFilterRows.map(r => r.id)).toEqual(['0001']);
    expect(doubleFilterRows.map(r => r.id)).toEqual(['0001']);
    expect(doubleFilterWithNoResultsRows).toEqual([]);

    queryDelegate.getSource('issue').push({
      type: 'remove',
      row: {
        id: '0001',
        title: 'issue 1',
        description: 'description 1',
        closed: false,
        ownerId: '0001',
      },
    });
    queryDelegate.commit();

    expect(singleFilterRows).toEqual([]);
    expect(doubleFilterRows).toEqual([]);
    expect(doubleFilterWithNoResultsRows).toEqual([]);

    queryDelegate.getSource('issue').push({
      type: 'add',
      row: {
        id: '0001',
        title: 'issue 1',
        description: 'description 1',
        closed: true,
        ownerId: '0001',
      },
    });

    // no commit
    expect(singleFilterRows).toEqual([]);
    expect(doubleFilterRows).toEqual([]);
    expect(doubleFilterWithNoResultsRows).toEqual([]);

    queryDelegate.commit();

    expect(singleFilterRows.map(r => r.id)).toEqual(['0001']);
    expect(doubleFilterRows).toEqual([]);
    // has results since we changed closed to true in the mutation
    expect(doubleFilterWithNoResultsRows.map(r => r.id)).toEqual(['0001']);
  });

  test('join', () => {
    const queryDelegate = new QueryDelegateImpl();
    addData(queryDelegate);

    const issueQuery = newQuery(queryDelegate, issueSchema)
      .related('labels')
      .related('owner')
      .related('comments');
    const view = issueQuery.materialize();

    let rows: unknown[] = [];
    view.addListener(data => {
      rows = deepClone(data) as unknown[];
    });

    expect(rows).toEqual([
      {
        closed: false,
        comments: [
          {
            authorId: '0001',
            body: 'comment 1',
            id: '0001',
            issueId: '0001',
          },
          {
            authorId: '0002',
            body: 'comment 2',
            id: '0002',
            issueId: '0001',
          },
        ],
        description: 'description 1',
        id: '0001',
        labels: [
          {
            id: '0001',
            name: 'label 1',
          },
        ],
        owner: [
          {
            id: '0001',
            name: 'Alice',
            metadata: {
              login: 'alicegh',
              registrar: 'github',
            },
          },
        ],
        ownerId: '0001',
        title: 'issue 1',
      },
      {
        closed: false,
        comments: [],
        description: 'description 2',
        id: '0002',
        labels: [],
        owner: [
          {
            id: '0002',
            name: 'Bob',
            metadata: {
              altContacts: ['bobwave', 'bobyt', 'bobplus'],
              login: 'bob@gmail.com',
              registar: 'google',
            },
          },
        ],
        ownerId: '0002',
        title: 'issue 2',
      },
      {
        closed: false,
        comments: [],
        description: 'description 3',
        id: '0003',
        labels: [],
        owner: [],
        ownerId: null,
        title: 'issue 3',
      },
    ]);

    queryDelegate.getSource('issue').push({
      type: 'remove',
      row: {
        id: '0001',
        title: 'issue 1',
        description: 'description 1',
        closed: false,
        ownerId: '0001',
      },
    });
    queryDelegate.getSource('issue').push({
      type: 'remove',
      row: {
        id: '0002',
        title: 'issue 2',
        description: 'description 2',
        closed: false,
        ownerId: '0002',
      },
    });
    queryDelegate.getSource('issue').push({
      type: 'remove',
      row: {
        id: '0003',
        title: 'issue 3',
        description: 'description 3',
        closed: false,
        ownerId: null,
      },
    });
    queryDelegate.commit();

    expect(rows).toEqual([]);
  });

  test('one', () => {
    const queryDelegate = new QueryDelegateImpl();
    addData(queryDelegate);

    const q1 = newQuery(queryDelegate, issueSchema).one();
    expect((q1 as QueryImpl<never, never>).format).toEqual({
      singular: true,
      relationships: {},
    });

    const q2 = newQuery(queryDelegate, issueSchema)
      .one()
      .related('comments', q => q.one());
    expect((q2 as QueryImpl<never, never>).format).toEqual({
      singular: true,
      relationships: {
        comments: {
          singular: true,
          relationships: {},
        },
      },
    });

    const q3 = newQuery(queryDelegate, issueSchema).related('comments', q =>
      q.one(),
    );
    expect((q3 as unknown as QueryImpl<never, never>).format).toEqual({
      singular: false,
      relationships: {
        comments: {
          singular: true,
          relationships: {},
        },
      },
    });

    const q4 = newQuery(queryDelegate, issueSchema)
      .related('comments', q =>
        q.one().where('id', '1').limit(20).orderBy('authorId', 'asc'),
      )
      .one()
      .where('closed', false)
      .limit(100)
      .orderBy('title', 'desc');
    expect((q4 as QueryImpl<never, never>).format).toEqual({
      singular: true,
      relationships: {
        comments: {
          singular: true,
          relationships: {},
        },
      },
    });
  });
});

test('limit -1', () => {
  const queryDelegate = new QueryDelegateImpl();
  expect(() => {
    newQuery(queryDelegate, issueSchema).limit(-1);
  }).toThrow('Limit must be non-negative');
});

test('non int limit', () => {
  const queryDelegate = new QueryDelegateImpl();
  expect(() => {
    newQuery(queryDelegate, issueSchema).limit(1.5);
  }).toThrow('Limit must be an integer');
});

test('run', () => {
  const queryDelegate = new QueryDelegateImpl();
  addData(queryDelegate);

  const issueQuery1 = newQuery(queryDelegate, issueSchema).where(
    'title',
    '=',
    'issue 1',
  );

  const singleFilterRows = issueQuery1.run();
  const doubleFilterRows = issueQuery1.where('closed', '=', false).run();
  const doubleFilterWithNoResultsRows = issueQuery1
    .where('closed', '=', true)
    .run();

  expect(singleFilterRows.map(r => r.id)).toEqual(['0001']);
  expect(doubleFilterRows.map(r => r.id)).toEqual(['0001']);
  expect(doubleFilterWithNoResultsRows).toEqual([]);

  const issueQuery2 = newQuery(queryDelegate, issueSchema)
    .related('labels')
    .related('owner')
    .related('comments');
  const rows = issueQuery2.run();
  expect(rows).toEqual([
    {
      closed: false,
      comments: [
        {
          authorId: '0001',
          body: 'comment 1',
          id: '0001',
          issueId: '0001',
        },
        {
          authorId: '0002',
          body: 'comment 2',
          id: '0002',
          issueId: '0001',
        },
      ],
      description: 'description 1',
      id: '0001',
      labels: [
        {
          id: '0001',
          name: 'label 1',
        },
      ],
      owner: [
        {
          id: '0001',
          name: 'Alice',
          metadata: {
            login: 'alicegh',
            registrar: 'github',
          },
        },
      ],
      ownerId: '0001',
      title: 'issue 1',
    },
    {
      closed: false,
      comments: [],
      description: 'description 2',
      id: '0002',
      labels: [],
      owner: [
        {
          id: '0002',
          name: 'Bob',
          metadata: {
            altContacts: ['bobwave', 'bobyt', 'bobplus'],
            login: 'bob@gmail.com',
            registar: 'google',
          },
        },
      ],
      ownerId: '0002',
      title: 'issue 2',
    },
    {
      closed: false,
      comments: [],
      description: 'description 3',
      id: '0003',
      labels: [],
      owner: [],
      ownerId: null,
      title: 'issue 3',
    },
  ]);
});

test('view creation is wrapped in context.batchViewUpdates call', () => {
  let viewFactoryCalls = 0;
  const testView = {};
  const viewFactory = () => {
    viewFactoryCalls++;
    return testView;
  };

  class TestQueryDelegate extends QueryDelegateImpl {
    batchViewUpdates<T>(applyViewUpdates: () => T): T {
      expect(viewFactoryCalls).toEqual(0);
      const result = applyViewUpdates();
      expect(viewFactoryCalls).toEqual(1);
      return result;
    }
  }
  const queryDelegate = new TestQueryDelegate();

  const issueQuery = newQuery(queryDelegate, issueSchema);
  const view = (
    issueQuery as AdvancedQuery<
      typeof issueSchema,
      DefaultQueryResultRow<typeof issueSchema>
    >
  ).materialize(viewFactory);
  expect(viewFactoryCalls).toEqual(1);
  expect(view).toBe(testView);
});

test('json columns are returned as JS objects', () => {
  const queryDelegate = new QueryDelegateImpl();
  addData(queryDelegate);

  const rows = newQuery(queryDelegate, userSchema).run();
  expect(rows).toEqual([
    {
      id: '0001',
      metadata: {
        login: 'alicegh',
        registrar: 'github',
      },
      name: 'Alice',
    },
    {
      id: '0002',
      metadata: {
        altContacts: ['bobwave', 'bobyt', 'bobplus'],
        login: 'bob@gmail.com',
        registar: 'google',
      },
      name: 'Bob',
    },
  ]);
});

test('complex expression', () => {
  const queryDelegate = new QueryDelegateImpl();
  addData(queryDelegate);

  let rows = newQuery(queryDelegate, issueSchema)
    .where(({or, cmp}) =>
      or(cmp('title', '=', 'issue 1'), cmp('title', '=', 'issue 2')),
    )
    .run();

  expect(rows).toMatchInlineSnapshot(`
    [
      {
        "closed": false,
        "description": "description 1",
        "id": "0001",
        "ownerId": "0001",
        "title": "issue 1",
      },
      {
        "closed": false,
        "description": "description 2",
        "id": "0002",
        "ownerId": "0002",
        "title": "issue 2",
      },
    ]
  `);

  rows = newQuery(queryDelegate, issueSchema)
    .where(({and, cmp, or}) =>
      and(
        cmp('ownerId', '=', '0001'),
        or(cmp('title', '=', 'issue 1'), cmp('title', '=', 'issue 2')),
      ),
    )
    .run();

  expect(rows).toMatchInlineSnapshot(`
    [
      {
        "closed": false,
        "description": "description 1",
        "id": "0001",
        "ownerId": "0001",
        "title": "issue 1",
      },
    ]
  `);
});

test('null compare', () => {
  const queryDelegate = new QueryDelegateImpl();
  addData(queryDelegate);

  let rows = newQuery(queryDelegate, issueSchema)
    .where('ownerId', '=', null)
    .run();

  expect(rows).toEqual([]);

  rows = newQuery(queryDelegate, issueSchema)
    .where('ownerId', '!=', null)
    .run();

  expect(rows).toEqual([]);

  rows = newQuery(queryDelegate, issueSchema)
    .where('ownerId', 'IS', null)
    .run();

  expect(rows).toEqual([
    {
      closed: false,
      description: 'description 3',
      id: '0003',
      ownerId: null,
      title: 'issue 3',
    },
  ]);

  rows = newQuery(queryDelegate, issueSchema)
    .where('ownerId', 'IS NOT', null)
    .run();

  expect(rows).toEqual([
    {
      closed: false,
      description: 'description 1',
      id: '0001',
      ownerId: '0001',
      title: 'issue 1',
    },
    {
      closed: false,
      description: 'description 2',
      id: '0002',
      ownerId: '0002',
      title: 'issue 2',
    },
  ]);
});

test('literal filter', () => {
  const queryDelegate = new QueryDelegateImpl();
  addData(queryDelegate);

  let rows = newQuery(queryDelegate, issueSchema)
    .where(({cmpLit}) => cmpLit(true, '=', false))
    .run();

  expect(rows).toEqual([]);

  rows = newQuery(queryDelegate, issueSchema)
    .where(({cmpLit}) => cmpLit(true, '=', true))
    .run();

  expect(rows).toEqual([
    {
      closed: false,
      description: 'description 1',
      id: '0001',
      ownerId: '0001',
      title: 'issue 1',
    },
    {
      closed: false,
      description: 'description 2',
      id: '0002',
      ownerId: '0002',
      title: 'issue 2',
    },
    {
      closed: false,
      description: 'description 3',
      id: '0003',
      ownerId: null,
      title: 'issue 3',
    },
  ]);
});

test('join with compound keys', () => {
  const bSchema = {
    tableName: 'b',
    columns: {
      id: {type: 'number'},
      b1: {type: 'number'},
      b2: {type: 'number'},
      b3: {type: 'number'},
    },
    primaryKey: ['id'],
    relationships: {},
  } as const;

  const aSchema = {
    tableName: 'a',
    columns: {
      id: {type: 'number'},
      a1: {type: 'number'},
      a2: {type: 'number'},
      a3: {type: 'number'},
    },
    primaryKey: ['id'],
    relationships: {
      b: {
        sourceField: ['a1', 'a2'],
        destField: ['b1', 'b2'],
        destSchema: bSchema,
      },
    },
  } as const;

  const sources = {
    a: new MemorySource('a', aSchema.columns, aSchema.primaryKey),
    b: new MemorySource('b', bSchema.columns, bSchema.primaryKey),
  };

  const queryDelegate = new QueryDelegateImpl(sources);
  const aSource = must(queryDelegate.getSource('a'));
  const bSource = must(queryDelegate.getSource('b'));

  for (const row of [
    {id: 0, a1: 1, a2: 2, a3: 3},
    {id: 1, a1: 2, a2: 3, a3: 4},
    {id: 2, a1: 2, a2: 3, a3: 5},
  ]) {
    aSource.push({
      type: 'add',
      row,
    });
  }

  for (const row of [
    {id: 0, b1: 1, b2: 2, b3: 3},
    {id: 1, b1: 1, b2: 2, b3: 4},
    {id: 2, b1: 2, b2: 3, b3: 5},
  ]) {
    bSource.push({
      type: 'add',
      row,
    });
  }

  const rows = newQuery(queryDelegate, aSchema).related('b').run();

  expect(rows).toMatchInlineSnapshot(`
    [
      {
        "a1": 1,
        "a2": 2,
        "a3": 3,
        "b": [
          {
            "b1": 1,
            "b2": 2,
            "b3": 3,
            "id": 0,
          },
          {
            "b1": 1,
            "b2": 2,
            "b3": 4,
            "id": 1,
          },
        ],
        "id": 0,
      },
      {
        "a1": 2,
        "a2": 3,
        "a3": 4,
        "b": [
          {
            "b1": 2,
            "b2": 3,
            "b3": 5,
            "id": 2,
          },
        ],
        "id": 1,
      },
      {
        "a1": 2,
        "a2": 3,
        "a3": 5,
        "b": [
          {
            "b1": 2,
            "b2": 3,
            "b3": 5,
            "id": 2,
          },
        ],
        "id": 2,
      },
    ]
  `);
});

test('where exists', () => {
  const queryDelegate = new QueryDelegateImpl();
  const issueSource = must(queryDelegate.getSource('issue'));
  const labelSource = must(queryDelegate.getSource('label'));
  const issueLabelSource = must(queryDelegate.getSource('issueLabel'));
  issueSource.push({
    type: 'add',
    row: {
      id: '0001',
      title: 'issue 1',
      description: 'description 1',
      closed: false,
      ownerId: '0001',
    },
  });
  issueSource.push({
    type: 'add',
    row: {
      id: '0002',
      title: 'issue 2',
      description: 'description 2',
      closed: true,
      ownerId: '0002',
    },
  });
  labelSource.push({
    type: 'add',
    row: {
      id: '0001',
      name: 'bug',
    },
  });

  const materialized = newQuery(queryDelegate, issueSchema)
    .where('closed', true)
    .whereExists('labels', q => q.where('name', 'bug'))
    .related('labels')
    .materialize();

  expect(materialized.data).toEqual([]);

  issueLabelSource.push({
    type: 'add',
    row: {
      issueId: '0002',
      labelId: '0001',
    },
  });

  expect(materialized.data).toMatchInlineSnapshot(`
    [
      {
        "closed": true,
        "description": "description 2",
        "id": "0002",
        "labels": [
          {
            "id": "0001",
            "name": "bug",
          },
        ],
        "ownerId": "0002",
        "title": "issue 2",
      },
    ]
  `);

  issueLabelSource.push({
    type: 'remove',
    row: {
      issueId: '0002',
      labelId: '0001',
    },
  });

  expect(materialized.data).toEqual([]);
});

test('result type unknown then complete', async () => {
  const queryDelegate = new QueryDelegateImpl();
  const issueQuery = newQuery(queryDelegate, issueSchema);
  const m = issueQuery.materialize();

  let rows: unknown[] = [undefined];
  let resultType = '';
  m.addListener((data, type) => {
    rows = deepClone(data) as unknown[];
    resultType = type;
  });

  expect(rows).toEqual([]);
  expect(resultType).toEqual('unknown');

  expect(queryDelegate.gotCallbacks.length).to.equal(1);
  queryDelegate.gotCallbacks[0]?.(true);

  // updating of resultType is promised based, so check in a new
  // microtask
  await 1;

  expect(rows).toEqual([]);
  expect(resultType).toEqual('complete');
});

test('result type initially complete', () => {
  const queryDelegate = new QueryDelegateImpl();
  queryDelegate.synchronouslyCallNextGotCallback = true;
  const issueQuery = newQuery(queryDelegate, issueSchema);
  const m = issueQuery.materialize();

  let rows: unknown[] = [undefined];
  let resultType = '';
  m.addListener((data, type) => {
    rows = deepClone(data) as unknown[];
    resultType = type;
  });

  expect(rows).toEqual([]);
  expect(resultType).toEqual('complete');
});
