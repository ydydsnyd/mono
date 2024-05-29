import type {AST} from '@rocicorp/zql/src/zql/ast/ast.js';
import {assert} from 'shared/src/asserts.js';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import {testDBs} from '../../test/db.js';
import type {PostgresDB} from '../../types/pg.js';
import {Normalized} from '../../zql/normalize.js';
import {getPublicationInfo} from '../replicator/tables/published.js';
import {QueryHandler} from './queries.js';

describe('view-syncer/queries', () => {
  let db: PostgresDB;

  beforeEach(async () => {
    db = await testDBs.create('view_syncer_queries_test');
    await db`
    CREATE TABLE issues (
      id text PRIMARY KEY,
      owner_id text,
      parent_id text,
      title text,
      _0_version VARCHAR(38)
    );
    CREATE TABLE users (
      id text PRIMARY KEY,
      name text,
      _0_version VARCHAR(38)
    );

    INSERT INTO users (id, name, _0_version) VALUES (100, 'Alice', '0a');
    INSERT INTO users (id, name, _0_version) VALUES (101, 'Bob', '0b');
    INSERT INTO users (id, name, _0_version) VALUES (102, 'Candice', '0c');

    INSERT INTO issues (id, title, owner_id, _0_version) VALUES (1, 'parent issue foo', 100, '1a0');
    INSERT INTO issues (id, title, owner_id, _0_version) VALUES (2, 'parent issue bar', 101, '1ab');
    INSERT INTO issues (id, title, owner_id, parent_id, _0_version) VALUES (3, 'foo', 102, 1, '1ca');
    INSERT INTO issues (id, title, owner_id, parent_id, _0_version) VALUES (4, 'bar', 101, 2, '1cd');

    CREATE PUBLICATION zero_all FOR ALL TABLES;
    `.simple();
  });

  afterEach(async () => {
    await testDBs.drop(db);
  });

  /* eslint-disable @typescript-eslint/naming-convention */
  test('query transformation and result processing', async () => {
    const published = await getPublicationInfo(db);
    const queryHandler = new QueryHandler(published.tables);

    const ast: AST = {
      select: [
        [['issues', 'id'], 'id'],
        [['issues', 'title'], 'title'],
        [['owner', 'name'], 'owner'],
        [['parent', 'title'], 'parent_title'],
        [['parent', 'owner'], 'parent_owner'],
      ],
      orderBy: [
        [
          ['issues', 'id'],
          ['issues', 'title'],
        ],
        'desc',
      ],
      table: 'issues',
      joins: [
        {
          type: 'inner',
          other: {table: 'users'},
          as: 'owner',
          on: [
            ['issues', 'owner_id'],
            ['owner', 'id'],
          ],
        },
        {
          type: 'inner',
          other: {
            select: [
              [['issues', 'id'], 'issues_id'],
              [['issues', 'title'], 'title'],
              [['owner', 'name'], 'owner'],
            ],
            table: 'issues',
            joins: [
              {
                type: 'inner',
                other: {table: 'users'},
                as: 'owner',
                on: [
                  ['issues', 'owner_id'],
                  ['owner', 'id'],
                ],
              },
            ],
          },
          as: 'parent',
          on: [
            ['issues', 'parent_id'],
            ['parent', 'issues_id'],
          ],
        },
      ],
    };

    // Explanatory:
    //   This is the original query and what the results need to be when
    //   executing on the client.
    const original = new Normalized(ast).query();
    expect(original.query).toBe(
      'SELECT ' +
        'issues.id AS id, issues.title AS title, owner.name AS owner, ' +
        'parent.owner AS parent_owner, parent.title AS parent_title FROM issues ' +
        'INNER JOIN users AS owner ON issues.owner_id = owner.id ' +
        'INNER JOIN (SELECT issues.id AS issues_id, issues.title AS title, owner.name AS owner FROM issues ' +
        'INNER JOIN users AS owner ON issues.owner_id = owner.id) ' +
        'AS parent ON issues.parent_id = parent.issues_id ' +
        'ORDER BY issues.id desc, issues.title desc',
    );
    expect(await db.unsafe(original.query, original.values)).toEqual([
      {
        id: '4',
        title: 'bar',
        owner: 'Bob',
        parent_title: 'parent issue bar',
        parent_owner: 'Bob',
      },
      {
        id: '3',
        title: 'foo',
        owner: 'Candice',
        parent_title: 'parent issue foo',
        parent_owner: 'Alice',
      },
    ]);

    const equivalentAST: AST = {
      ...ast,
      select: [
        [['issues', 'id'], 'different_id_alias'],
        [['issues', 'title'], 'different_title_alias'],
        [['owner', 'name'], 'different_owner_alias'],
        [['parent', 'title'], 'parent_title'],
        [['parent', 'owner'], 'parent_owner'],
      ],
    };

    const transformed = queryHandler.transform([
      {id: 'queryHash', ast},
      {id: 'queryHash2', ast: equivalentAST},
    ]);
    const first = transformed.values().next();
    assert(!first.done);

    const {queryIDs, transformedAST} = first.value;
    expect(queryIDs).toEqual(['queryHash', 'queryHash2']);
    const expanded = transformedAST.query();
    const resultParser = queryHandler.resultParser('foo-cvr');
    const results = await db.unsafe(expanded.query, expanded.values);

    // This is what gets synced to the client (contents) and stored in the CVR (record).
    expect(resultParser.parseResults(queryIDs, results)).toEqual(
      new Map([
        [
          '/vs/cvr/foo-cvr/d/r/e3jqcp8k60hejdhju08414x2z',
          {
            contents: {id: '3', owner_id: '102', parent_id: '1', title: 'foo'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '3'}},
              rowVersion: '1ca',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                owner_id: ['queryHash', 'queryHash2'],
                parent_id: ['queryHash', 'queryHash2'],
                title: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/idb04wek62w1kiltjxjn3fxk',
          {
            contents: {id: '102', name: 'Candice'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '102'}},
              rowVersion: '0c',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                name: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/1ngjqp2ckvs2ur64mjoacg55',
          {
            contents: {id: '1', owner_id: '100', title: 'parent issue foo'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '1'}},
              rowVersion: '1a0',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                owner_id: ['queryHash', 'queryHash2'],
                title: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/9483jb6yy1yq0etzidy62072z',
          {
            contents: {id: '100', name: 'Alice'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '100'}},
              rowVersion: '0a',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                name: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/7flkrz0yskhi5ko0l0lqjccoe',
          {
            contents: {id: '4', owner_id: '101', parent_id: '2', title: 'bar'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '4'}},
              rowVersion: '1cd',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                owner_id: ['queryHash', 'queryHash2'],
                parent_id: ['queryHash', 'queryHash2'],
                title: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/epxvfoxp9ktkty20rjo1yyheu',
          {
            contents: {id: '101', name: 'Bob'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '101'}},
              rowVersion: '0b',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                name: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/2z8i982skum71jkx73g5y2gao',
          {
            contents: {id: '2', owner_id: '101', title: 'parent issue bar'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '2'}},
              rowVersion: '1ab',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                owner_id: ['queryHash', 'queryHash2'],
                title: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
      ]),
    );
  });

  test('deaggregation', async () => {
    const published = await getPublicationInfo(db);
    const queryHandler = new QueryHandler(published.tables);

    const ast: AST = {
      select: [[['issues', 'id'], 'id']],
      aggregate: [
        {aggregate: 'array', field: ['issues', 'title'], alias: 'ignored'},
      ],
      groupBy: [['issues', 'id']],
      table: 'issues',
    };

    // Explanatory:
    //   This is the original query and what the results need to be when
    //   executing on the client.
    const original = new Normalized(ast).query();
    expect(original.query).toBe(
      'SELECT issues.id AS id, array_agg(issues.title) AS "array_agg(issues.title)" ' +
        'FROM issues GROUP BY issues.id',
    );
    expect(await db.unsafe(original.query, original.values)).toEqual([
      {
        id: '2',
        ['array_agg(issues.title)']: ['parent issue bar'],
      },
      {
        id: '4',
        ['array_agg(issues.title)']: ['bar'],
      },
      {
        id: '3',
        ['array_agg(issues.title)']: ['foo'],
      },
      {
        id: '1',
        ['array_agg(issues.title)']: ['parent issue foo'],
      },
    ]);

    const transformed = queryHandler.transform([{id: 'queryHash', ast}]);
    const first = transformed.values().next();
    assert(!first.done);

    const {queryIDs, transformedAST} = first.value;
    // expect(queryIDs).toEqual(['queryHash', 'queryHash2']);
    expect(queryIDs).toEqual(['queryHash']);
    const expanded = transformedAST.query();
    const resultParser = queryHandler.resultParser('foo-cvr');
    expect(expanded.query).toBe(
      'SELECT public.issues._0_version AS "public/issues/_0_version", ' +
        'public.issues.id AS "public/issues/id", ' +
        'public.issues.title AS "public/issues/title" ' +
        'FROM issues',
    );
    const results = await db.unsafe(expanded.query, expanded.values);

    // This is what gets synced to the client (contents) and stored in the CVR (record).
    expect(resultParser.parseResults(queryIDs, results)).toEqual(
      new Map([
        [
          '/vs/cvr/foo-cvr/d/r/7flkrz0yskhi5ko0l0lqjccoe',
          {
            contents: {id: '4', title: 'bar'},
            record: {
              id: {rowKey: {id: '4'}, schema: 'public', table: 'issues'},
              queriedColumns: {id: ['queryHash'], title: ['queryHash']},
              rowVersion: '1cd',
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/2z8i982skum71jkx73g5y2gao',
          {
            contents: {id: '2', title: 'parent issue bar'},
            record: {
              id: {rowKey: {id: '2'}, schema: 'public', table: 'issues'},
              queriedColumns: {id: ['queryHash'], title: ['queryHash']},
              rowVersion: '1ab',
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/1ngjqp2ckvs2ur64mjoacg55',
          {
            contents: {id: '1', title: 'parent issue foo'},
            record: {
              id: {rowKey: {id: '1'}, schema: 'public', table: 'issues'},
              queriedColumns: {id: ['queryHash'], title: ['queryHash']},
              rowVersion: '1a0',
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/e3jqcp8k60hejdhju08414x2z',
          {
            contents: {id: '3', title: 'foo'},
            record: {
              id: {rowKey: {id: '3'}, schema: 'public', table: 'issues'},
              queriedColumns: {id: ['queryHash'], title: ['queryHash']},
              rowVersion: '1ca',
            },
          },
        ],
      ]),
    );
  });

  test('left joins which can return with null rows', async () => {
    const published = await getPublicationInfo(db);
    const queryHandler = new QueryHandler(published.tables);

    const ast: AST = {
      select: [
        [['issues', 'id'], 'id'],
        [['issues', 'title'], 'title'],
        [['owner', 'name'], 'owner'],
        [['parent', 'title'], 'parent_title'],
        [['parent', 'owner'], 'parent_owner'],
      ],
      orderBy: [
        [
          ['issues', 'id'],
          ['issues', 'title'],
        ],
        'desc',
      ],
      table: 'issues',
      joins: [
        {
          type: 'inner',
          other: {table: 'users'},
          as: 'owner',
          on: [
            ['issues', 'owner_id'],
            ['owner', 'id'],
          ],
        },
        {
          type: 'left',
          other: {
            select: [
              [['issues', 'id'], 'issues_id'],
              [['issues', 'title'], 'title'],
              [['owner', 'name'], 'owner'],
            ],
            table: 'issues',
            joins: [
              {
                type: 'inner',
                other: {table: 'users'},
                as: 'owner',
                on: [
                  ['issues', 'owner_id'],
                  ['owner', 'id'],
                ],
              },
            ],
          },
          as: 'parent',
          on: [
            ['issues', 'parent_id'],
            ['parent', 'issues_id'],
          ],
        },
      ],
    };

    // Explanatory:
    //   This is the original query and what the results need to be when
    //   executing on the client.
    const original = new Normalized(ast).query();
    expect(original.query).toBe(
      'SELECT ' +
        'issues.id AS id, issues.title AS title, owner.name AS owner, ' +
        'parent.owner AS parent_owner, parent.title AS parent_title FROM issues ' +
        'INNER JOIN users AS owner ON issues.owner_id = owner.id ' +
        'LEFT JOIN (SELECT issues.id AS issues_id, issues.title AS title, owner.name AS owner FROM issues ' +
        'INNER JOIN users AS owner ON issues.owner_id = owner.id) ' +
        'AS parent ON issues.parent_id = parent.issues_id ' +
        'ORDER BY issues.id desc, issues.title desc',
    );
    expect(await db.unsafe(original.query, original.values)).toEqual([
      {
        id: '4',
        title: 'bar',
        owner: 'Bob',
        parent_title: 'parent issue bar',
        parent_owner: 'Bob',
      },
      {
        id: '3',
        title: 'foo',
        owner: 'Candice',
        parent_title: 'parent issue foo',
        parent_owner: 'Alice',
      },
      {
        id: '2',
        title: 'parent issue bar',
        owner: 'Bob',
        parent_title: null,
        parent_owner: null,
      },
      {
        id: '1',
        title: 'parent issue foo',
        owner: 'Alice',
        parent_title: null,
        parent_owner: null,
      },
    ]);

    const equivalentAST: AST = {
      ...ast,
      select: [
        [['issues', 'id'], 'different_id_alias'],
        [['issues', 'title'], 'different_title_alias'],
        [['owner', 'name'], 'different_owner_alias'],
        [['parent', 'title'], 'parent_title'],
        [['parent', 'owner'], 'parent_owner'],
      ],
    };

    const transformed = queryHandler.transform([
      {id: 'queryHash', ast},
      {id: 'queryHash2', ast: equivalentAST},
    ]);
    const first = transformed.values().next();
    assert(!first.done);

    const {queryIDs, transformedAST} = first.value;
    expect(queryIDs).toEqual(['queryHash', 'queryHash2']);
    const expanded = transformedAST.query();
    const resultParser = queryHandler.resultParser('foo-cvr');
    const results = await db.unsafe(expanded.query, expanded.values);

    // This is what gets synced to the client (contents) and stored in the CVR (record).
    expect(resultParser.parseResults(queryIDs, results)).toEqual(
      new Map([
        [
          '/vs/cvr/foo-cvr/d/r/e3jqcp8k60hejdhju08414x2z',
          {
            contents: {id: '3', owner_id: '102', parent_id: '1', title: 'foo'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '3'}},
              rowVersion: '1ca',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                owner_id: ['queryHash', 'queryHash2'],
                parent_id: ['queryHash', 'queryHash2'],
                title: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/idb04wek62w1kiltjxjn3fxk',
          {
            contents: {id: '102', name: 'Candice'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '102'}},
              rowVersion: '0c',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                name: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/1ngjqp2ckvs2ur64mjoacg55',
          {
            contents: {
              id: '1',
              owner_id: '100',
              title: 'parent issue foo',
              parent_id: null,
            },
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '1'}},
              rowVersion: '1a0',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                owner_id: ['queryHash', 'queryHash2'],
                title: ['queryHash', 'queryHash2'],
                parent_id: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/9483jb6yy1yq0etzidy62072z',
          {
            contents: {id: '100', name: 'Alice'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '100'}},
              rowVersion: '0a',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                name: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/7flkrz0yskhi5ko0l0lqjccoe',
          {
            contents: {id: '4', owner_id: '101', parent_id: '2', title: 'bar'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '4'}},
              rowVersion: '1cd',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                owner_id: ['queryHash', 'queryHash2'],
                parent_id: ['queryHash', 'queryHash2'],
                title: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/epxvfoxp9ktkty20rjo1yyheu',
          {
            contents: {id: '101', name: 'Bob'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '101'}},
              rowVersion: '0b',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                name: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/2z8i982skum71jkx73g5y2gao',
          {
            contents: {
              id: '2',
              owner_id: '101',
              title: 'parent issue bar',
              parent_id: null,
            },
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '2'}},
              rowVersion: '1ab',
              queriedColumns: {
                id: ['queryHash', 'queryHash2'],
                owner_id: ['queryHash', 'queryHash2'],
                title: ['queryHash', 'queryHash2'],
                parent_id: ['queryHash', 'queryHash2'],
              },
            },
          },
        ],
      ]),
    );
  });

  test('deaggregation', async () => {
    const published = await getPublicationInfo(db);
    const queryHandler = new QueryHandler(published.tables);

    const ast: AST = {
      select: [[['issues', 'id'], 'id']],
      aggregate: [
        {aggregate: 'array', field: ['issues', 'title'], alias: 'ignored'},
      ],
      groupBy: [['issues', 'id']],
      table: 'issues',
    };

    // Explanatory:
    //   This is the original query and what the results need to be when
    //   executing on the client.
    const original = new Normalized(ast).query();
    expect(original.query).toBe(
      'SELECT issues.id AS id, array_agg(issues.title) AS "array_agg(issues.title)" ' +
        'FROM issues GROUP BY issues.id',
    );
    expect(await db.unsafe(original.query, original.values)).toEqual([
      {
        id: '2',
        ['array_agg(issues.title)']: ['parent issue bar'],
      },
      {
        id: '4',
        ['array_agg(issues.title)']: ['bar'],
      },
      {
        id: '3',
        ['array_agg(issues.title)']: ['foo'],
      },
      {
        id: '1',
        ['array_agg(issues.title)']: ['parent issue foo'],
      },
    ]);

    const transformed = queryHandler.transform([{id: 'queryHash', ast}]);
    const first = transformed.values().next();
    assert(!first.done);

    const {queryIDs, transformedAST} = first.value;
    // expect(queryIDs).toEqual(['queryHash', 'queryHash2']);
    expect(queryIDs).toEqual(['queryHash']);
    const expanded = transformedAST.query();
    const resultParser = queryHandler.resultParser('foo-cvr');
    expect(expanded.query).toBe(
      'SELECT public.issues._0_version AS "public/issues/_0_version", ' +
        'public.issues.id AS "public/issues/id", ' +
        'public.issues.title AS "public/issues/title" ' +
        'FROM issues',
    );
    const results = await db.unsafe(expanded.query, expanded.values);

    // This is what gets synced to the client (contents) and stored in the CVR (record).
    expect(resultParser.parseResults(queryIDs, results)).toEqual(
      new Map([
        [
          '/vs/cvr/foo-cvr/d/r/7flkrz0yskhi5ko0l0lqjccoe',
          {
            contents: {id: '4', title: 'bar'},
            record: {
              id: {rowKey: {id: '4'}, schema: 'public', table: 'issues'},
              queriedColumns: {id: ['queryHash'], title: ['queryHash']},
              rowVersion: '1cd',
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/2z8i982skum71jkx73g5y2gao',
          {
            contents: {id: '2', title: 'parent issue bar'},
            record: {
              id: {rowKey: {id: '2'}, schema: 'public', table: 'issues'},
              queriedColumns: {id: ['queryHash'], title: ['queryHash']},
              rowVersion: '1ab',
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/1ngjqp2ckvs2ur64mjoacg55',
          {
            contents: {id: '1', title: 'parent issue foo'},
            record: {
              id: {rowKey: {id: '1'}, schema: 'public', table: 'issues'},
              queriedColumns: {id: ['queryHash'], title: ['queryHash']},
              rowVersion: '1a0',
            },
          },
        ],
        [
          '/vs/cvr/foo-cvr/d/r/e3jqcp8k60hejdhju08414x2z',
          {
            contents: {id: '3', title: 'foo'},
            record: {
              id: {rowKey: {id: '3'}, schema: 'public', table: 'issues'},
              queriedColumns: {id: ['queryHash'], title: ['queryHash']},
              rowVersion: '1ca',
            },
          },
        ],
      ]),
    );
  });

  /* eslint-enable @typescript-eslint/naming-convention */
});
