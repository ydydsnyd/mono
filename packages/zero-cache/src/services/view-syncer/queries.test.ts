import {assert} from 'shared/src/asserts.js';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import type {AST} from 'zql/src/zql/ast/ast.js';
import {testDBs} from '../../test/db.js';
import type {PostgresDB} from '../../types/pg.js';
import {Normalized} from '../../zql/normalize.js';
import type {ServerAST} from '../../zql/server-ast.js';
import {getPublicationInfo} from '../replicator/tables/published.js';
import {minifyAliases, QueryHandler} from './queries.js';

describe('view-syncer/queries/minify-aliases', () => {
  test('no sub queries', () => {
    const query: ServerAST = {
      select: [
        [['public.issueLabel', '_0_version'], 'public/issueLabel/_0_version'],
        [['public.issueLabel', 'id'], 'public/issueLabel/id'],
        [['public.issueLabel', 'issueID'], 'public/issueLabel/issueID'],
        [['public.issueLabel', 'labelID'], 'public/issueLabel/labelID'],
      ],
      table: 'issueLabel',
    };

    const {ast, columnAliases} = minifyAliases(query);
    expect(ast).toEqual({
      select: [
        [['public.issueLabel', '_0_version'], 'a'],
        [['public.issueLabel', 'id'], 'b'],
        [['public.issueLabel', 'issueID'], 'c'],
        [['public.issueLabel', 'labelID'], 'd'],
      ],
      table: 'issueLabel',
    });

    expect(columnAliases).toMatchInlineSnapshot(`
      Map {
        "a" => {
          "column": "_0_version",
          "schema": "public",
          "subQueryName": "",
          "table": "issueLabel",
        },
        "b" => {
          "column": "id",
          "schema": "public",
          "subQueryName": "",
          "table": "issueLabel",
        },
        "c" => {
          "column": "issueID",
          "schema": "public",
          "subQueryName": "",
          "table": "issueLabel",
        },
        "d" => {
          "column": "labelID",
          "schema": "public",
          "subQueryName": "",
          "table": "issueLabel",
        },
      }
    `);
  });

  test('sub queries', () => {
    const query: ServerAST = {
      select: [
        [['issue', 'public/issue/_0_version'], 'issue/public/issue/_0_version'],
        [['issue', 'public/issue/created'], 'issue/public/issue/created'],
        [['issue', 'public/issue/creatorID'], 'issue/public/issue/creatorID'],
        [
          ['issue', 'public/issue/description'],
          'issue/public/issue/description',
        ],
        [['issue', 'public/issue/id'], 'issue/public/issue/id'],
        [
          ['issue', 'public/issue/kanbanOrder'],
          'issue/public/issue/kanbanOrder',
        ],
        [['issue', 'public/issue/modified'], 'issue/public/issue/modified'],
        [['issue', 'public/issue/priority'], 'issue/public/issue/priority'],
        [['issue', 'public/issue/status'], 'issue/public/issue/status'],
        [['issue', 'public/issue/title'], 'issue/public/issue/title'],
        [
          ['issueLabel', 'public/issueLabel/_0_version'],
          'issueLabel/public/issueLabel/_0_version',
        ],
        [
          ['issueLabel', 'public/issueLabel/id'],
          'issueLabel/public/issueLabel/id',
        ],
        [
          ['issueLabel', 'public/issueLabel/issueID'],
          'issueLabel/public/issueLabel/issueID',
        ],
        [
          ['issueLabel', 'public/issueLabel/labelID'],
          'issueLabel/public/issueLabel/labelID',
        ],
        [['label', 'public/label/_0_version'], 'label/public/label/_0_version'],
        [['label', 'public/label/id'], 'label/public/label/id'],
        [['label', 'public/label/name'], 'label/public/label/name'],
      ],
      table: 'issues',
    };

    const {ast, columnAliases} = minifyAliases(query);

    expect(ast).toEqual({
      select: [
        [['issue', 'public/issue/_0_version'], 'a'],
        [['issue', 'public/issue/created'], 'b'],
        [['issue', 'public/issue/creatorID'], 'c'],
        [['issue', 'public/issue/description'], 'd'],
        [['issue', 'public/issue/id'], 'e'],
        [['issue', 'public/issue/kanbanOrder'], 'f'],
        [['issue', 'public/issue/modified'], 'g'],
        [['issue', 'public/issue/priority'], 'h'],
        [['issue', 'public/issue/status'], 'i'],
        [['issue', 'public/issue/title'], 'j'],
        [['issueLabel', 'public/issueLabel/_0_version'], 'k'],
        [['issueLabel', 'public/issueLabel/id'], 'l'],
        [['issueLabel', 'public/issueLabel/issueID'], 'm'],
        [['issueLabel', 'public/issueLabel/labelID'], 'n'],
        [['label', 'public/label/_0_version'], 'o'],
        [['label', 'public/label/id'], 'p'],
        [['label', 'public/label/name'], 'q'],
      ],
      table: 'issues',
    });

    expect(columnAliases).toMatchInlineSnapshot(`
      Map {
        "a" => {
          "column": "_0_version",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "b" => {
          "column": "created",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "c" => {
          "column": "creatorID",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "d" => {
          "column": "description",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "e" => {
          "column": "id",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "f" => {
          "column": "kanbanOrder",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "g" => {
          "column": "modified",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "h" => {
          "column": "priority",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "i" => {
          "column": "status",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "j" => {
          "column": "title",
          "schema": "public",
          "subQueryName": "issue",
          "table": "issue",
        },
        "k" => {
          "column": "_0_version",
          "schema": "public",
          "subQueryName": "issueLabel",
          "table": "issueLabel",
        },
        "l" => {
          "column": "id",
          "schema": "public",
          "subQueryName": "issueLabel",
          "table": "issueLabel",
        },
        "m" => {
          "column": "issueID",
          "schema": "public",
          "subQueryName": "issueLabel",
          "table": "issueLabel",
        },
        "n" => {
          "column": "labelID",
          "schema": "public",
          "subQueryName": "issueLabel",
          "table": "issueLabel",
        },
        "o" => {
          "column": "_0_version",
          "schema": "public",
          "subQueryName": "label",
          "table": "label",
        },
        "p" => {
          "column": "id",
          "schema": "public",
          "subQueryName": "label",
          "table": "label",
        },
        "q" => {
          "column": "name",
          "schema": "public",
          "subQueryName": "label",
          "table": "label",
        },
      }
    `);
  });

  test('alias name generation (lots of columns)', () => {
    const ast: ServerAST = {
      table: 'foo',
      select: Array.from({length: 100}, (_, i) => [
        ['table', `col_${i}`],
        `foo/bar/baz/col_${i}`,
      ]),
    };
    const {columnAliases} = minifyAliases(ast);
    expect([...columnAliases.keys()]).toMatchInlineSnapshot(`
      [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "a1",
        "b1",
        "c1",
        "d1",
        "e1",
        "f1",
        "g1",
        "h1",
        "i1",
        "j1",
        "k1",
        "l1",
        "m1",
        "n1",
        "o1",
        "p1",
        "q1",
        "r1",
        "s1",
        "t1",
        "u1",
        "v1",
        "w1",
        "x1",
        "y1",
        "z1",
        "A1",
        "B1",
        "C1",
        "D1",
        "E1",
        "F1",
        "G1",
        "H1",
        "I1",
        "J1",
        "K1",
        "L1",
        "M1",
        "N1",
        "O1",
        "P1",
        "Q1",
        "R1",
        "S1",
        "T1",
        "U1",
        "V1",
      ]
    `);
  });
});

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
    CREATE TABLE "issueLabels" (
      id text PRIMARY KEY,
      "issueId" text,
      "labelId" text,
      _0_version VARCHAR(38)
    );
    CREATE TABLE labels (
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

    INSERT INTO labels (id, name, _0_version) VALUES (1, 'bug', '1a');
    INSERT INTO labels (id, name, _0_version) VALUES (2, 'feature', '1b');
    INSERT INTO labels (id, name, _0_version) VALUES (3, 'enhancement', '1c');

    INSERT INTO "issueLabels" (id, "issueId", "labelId", _0_version) VALUES (1, 3, 1, '1a');
    INSERT INTO "issueLabels" (id, "issueId", "labelId", _0_version) VALUES (2, 3, 2, '1b');
    INSERT INTO "issueLabels" (id, "issueId", "labelId", _0_version) VALUES (3, 4, 2, '1c');

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
        [['issues', 'id'], 'desc'],
        [['issues', 'title'], 'desc'],
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

    const {queryIDs, transformedAST, columnAliases} = first.value;
    expect(queryIDs).toEqual(['queryHash', 'queryHash2']);
    const expanded = transformedAST.query();
    const resultParser = queryHandler.resultParser(queryIDs, columnAliases);
    const results = await db.unsafe(expanded.query, expanded.values);

    // This is what gets synced to the client (contents) and stored in the CVR (record).
    expect(new Map(resultParser.parseResults(results))).toEqual(
      new Map([
        [
          {schema: 'public', table: 'issues', rowKey: {id: '3'}},
          {
            contents: {id: '3', owner_id: '102', parent_id: '1', title: 'foo'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '3'}},
              rowVersion: '1ca',
              queriedColumns: {
                queryHash: ['id', 'owner_id', 'parent_id', 'title'],
                queryHash2: ['id', 'owner_id', 'parent_id', 'title'],
              },
            },
          },
        ],
        [
          {schema: 'public', table: 'users', rowKey: {id: '102'}},
          {
            contents: {id: '102', name: 'Candice'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '102'}},
              rowVersion: '0c',
              queriedColumns: {
                queryHash: ['id', 'name'],
                queryHash2: ['id', 'name'],
              },
            },
          },
        ],
        [
          {schema: 'public', table: 'issues', rowKey: {id: '1'}},
          {
            contents: {id: '1', owner_id: '100', title: 'parent issue foo'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '1'}},
              rowVersion: '1a0',
              queriedColumns: {
                queryHash: ['id', 'owner_id', 'title'],
                queryHash2: ['id', 'owner_id', 'title'],
              },
            },
          },
        ],
        [
          {schema: 'public', table: 'users', rowKey: {id: '100'}},
          {
            contents: {id: '100', name: 'Alice'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '100'}},
              rowVersion: '0a',
              queriedColumns: {
                queryHash: ['id', 'name'],
                queryHash2: ['id', 'name'],
              },
            },
          },
        ],
        [
          {schema: 'public', table: 'issues', rowKey: {id: '4'}},
          {
            contents: {id: '4', owner_id: '101', parent_id: '2', title: 'bar'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '4'}},
              rowVersion: '1cd',
              queriedColumns: {
                queryHash: ['id', 'owner_id', 'parent_id', 'title'],
                queryHash2: ['id', 'owner_id', 'parent_id', 'title'],
              },
            },
          },
        ],
        [
          {schema: 'public', table: 'users', rowKey: {id: '101'}},
          {
            contents: {id: '101', name: 'Bob'},
            record: {
              id: {schema: 'public', table: 'users', rowKey: {id: '101'}},
              rowVersion: '0b',
              queriedColumns: {
                queryHash: ['id', 'name'],
                queryHash2: ['id', 'name'],
              },
            },
          },
        ],
        [
          {schema: 'public', table: 'issues', rowKey: {id: '2'}},
          {
            contents: {id: '2', owner_id: '101', title: 'parent issue bar'},
            record: {
              id: {schema: 'public', table: 'issues', rowKey: {id: '2'}},
              rowVersion: '1ab',
              queriedColumns: {
                queryHash: ['id', 'owner_id', 'title'],
                queryHash2: ['id', 'owner_id', 'title'],
              },
            },
          },
        ],
      ]),
    );
  });

  test('aggregation', async () => {
    const ast: AST = {
      table: 'issues',
      select: [[['issues', 'title'], 'title']],
      aggregate: [
        {
          aggregate: 'array',
          field: ['labels', 'name'],
          alias: 'labels',
        },
      ],
      joins: [
        {
          type: 'left',
          other: {table: 'issueLabels'},
          as: 'issueLabels',
          on: [
            ['issueLabels', 'issueId'],
            ['issues', 'id'],
          ],
        },
        {
          type: 'left',
          other: {table: 'labels'},
          as: 'labels',
          on: [
            ['labels', 'id'],
            ['issueLabels', 'labelId'],
          ],
        },
      ],
      groupBy: [['issues', 'id']],
    };

    const published = await getPublicationInfo(db);
    const queryHandler = new QueryHandler(published.tables);
    const transformed = queryHandler.transform([{id: 'queryHash', ast}]);
    const first = transformed.values().next();
    assert(!first.done);

    const {queryIDs, transformedAST, columnAliases} = first.value;
    expect(queryIDs).toEqual(['queryHash']);
    const expanded = transformedAST.query();
    const resultParser = queryHandler.resultParser(queryIDs, columnAliases);
    const results = await db.unsafe(expanded.query, expanded.values);

    expect(new Map(resultParser.parseResults(results))).toEqual(
      new Map([
        [
          {
            schema: 'public',
            table: 'issues',
            rowKey: {
              id: '2',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'issues',
                rowKey: {
                  id: '2',
                },
              },
              rowVersion: '1ab',
              queriedColumns: {
                queryHash: ['id', 'title'],
              },
            },
            contents: {
              id: '2',
              title: 'parent issue bar',
            },
          },
        ],
        [
          {
            schema: 'public',
            table: 'issues',
            rowKey: {
              id: '4',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'issues',
                rowKey: {
                  id: '4',
                },
              },
              rowVersion: '1cd',
              queriedColumns: {
                queryHash: ['id', 'title'],
              },
            },
            contents: {
              id: '4',
              title: 'bar',
            },
          },
        ],
        [
          {
            schema: 'public',
            table: 'issueLabels',
            rowKey: {
              id: '3',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'issueLabels',
                rowKey: {
                  id: '3',
                },
              },
              rowVersion: '1c',
              queriedColumns: {
                queryHash: ['id', 'issueId', 'labelId'],
              },
            },
            contents: {
              id: '3',
              issueId: '4',
              labelId: '2',
            },
          },
        ],
        [
          {
            schema: 'public',
            table: 'labels',
            rowKey: {
              id: '2',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'labels',
                rowKey: {
                  id: '2',
                },
              },
              rowVersion: '1b',
              queriedColumns: {
                queryHash: ['id', 'name'],
              },
            },
            contents: {
              id: '2',
              name: 'feature',
            },
          },
        ],
        [
          {
            schema: 'public',
            table: 'issues',
            rowKey: {
              id: '3',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'issues',
                rowKey: {
                  id: '3',
                },
              },
              rowVersion: '1ca',
              queriedColumns: {
                queryHash: ['id', 'title'],
              },
            },
            contents: {
              id: '3',
              title: 'foo',
            },
          },
        ],
        [
          {
            schema: 'public',
            table: 'issueLabels',
            rowKey: {
              id: '1',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'issueLabels',
                rowKey: {
                  id: '1',
                },
              },
              rowVersion: '1a',
              queriedColumns: {
                queryHash: ['id', 'issueId', 'labelId'],
              },
            },
            contents: {
              id: '1',
              issueId: '3',
              labelId: '1',
            },
          },
        ],
        [
          {
            schema: 'public',
            table: 'issueLabels',
            rowKey: {
              id: '2',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'issueLabels',
                rowKey: {
                  id: '2',
                },
              },
              rowVersion: '1b',
              queriedColumns: {
                queryHash: ['id', 'issueId', 'labelId'],
              },
            },
            contents: {
              id: '2',
              issueId: '3',
              labelId: '2',
            },
          },
        ],
        [
          {
            schema: 'public',
            table: 'labels',
            rowKey: {
              id: '1',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'labels',
                rowKey: {
                  id: '1',
                },
              },
              rowVersion: '1a',
              queriedColumns: {
                queryHash: ['id', 'name'],
              },
            },
            contents: {
              id: '1',
              name: 'bug',
            },
          },
        ],
        [
          {
            schema: 'public',
            table: 'issues',
            rowKey: {
              id: '1',
            },
          },
          {
            record: {
              id: {
                schema: 'public',
                table: 'issues',
                rowKey: {
                  id: '1',
                },
              },
              rowVersion: '1a0',
              queriedColumns: {
                queryHash: ['id', 'title'],
              },
            },
            contents: {
              id: '1',
              title: 'parent issue foo',
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
        [['issues', 'id'], 'desc'],
        [['issues', 'title'], 'desc'],
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

    const {queryIDs, transformedAST, columnAliases} = first.value;
    expect(queryIDs).toEqual(['queryHash', 'queryHash2']);
    const expanded = transformedAST.query();
    const resultParser = queryHandler.resultParser(queryIDs, columnAliases);
    const results = await db.unsafe(expanded.query, expanded.values);

    // This is what gets synced to the client (contents) and stored in the CVR (record).
    expect(new Map(resultParser.parseResults(results))).toEqual(
      new Map([
        [
          {rowKey: {id: '101'}, schema: 'public', table: 'users'},
          {
            contents: {id: '101', name: 'Bob'},
            record: {
              id: {
                schema: 'public',
                rowKey: {
                  id: '101',
                },
                table: 'users',
              },
              queriedColumns: {
                queryHash: ['id', 'name'],
                queryHash2: ['id', 'name'],
              },
              rowVersion: '0b',
            },
          },
        ],
        [
          {
            rowKey: {
              id: '2',
            },
            schema: 'public',
            table: 'issues',
          },
          {
            contents: {
              id: '2',
              owner_id: '101',
              parent_id: null,
              title: 'parent issue bar',
            },
            record: {
              id: {
                rowKey: {
                  id: '2',
                },
                schema: 'public',
                table: 'issues',
              },
              queriedColumns: {
                queryHash: ['id', 'owner_id', 'parent_id', 'title'],
                queryHash2: ['id', 'owner_id', 'parent_id', 'title'],
              },
              rowVersion: '1ab',
            },
          },
        ],
        [
          {
            rowKey: {
              id: '4',
            },
            schema: 'public',
            table: 'issues',
          },
          {
            contents: {
              id: '4',
              owner_id: '101',
              parent_id: '2',
              title: 'bar',
            },
            record: {
              id: {
                rowKey: {
                  id: '4',
                },
                schema: 'public',
                table: 'issues',
              },
              queriedColumns: {
                queryHash: ['id', 'owner_id', 'parent_id', 'title'],
                queryHash2: ['id', 'owner_id', 'parent_id', 'title'],
              },
              rowVersion: '1cd',
            },
          },
        ],
        [
          {
            rowKey: {
              id: '102',
            },
            schema: 'public',
            table: 'users',
          },
          {
            contents: {
              id: '102',
              name: 'Candice',
            },
            record: {
              id: {
                rowKey: {
                  id: '102',
                },
                schema: 'public',
                table: 'users',
              },
              queriedColumns: {
                queryHash: ['id', 'name'],
                queryHash2: ['id', 'name'],
              },
              rowVersion: '0c',
            },
          },
        ],
        [
          {
            rowKey: {
              id: '100',
            },
            schema: 'public',
            table: 'users',
          },
          {
            contents: {
              id: '100',
              name: 'Alice',
            },
            record: {
              id: {
                rowKey: {
                  id: '100',
                },
                schema: 'public',
                table: 'users',
              },
              queriedColumns: {
                queryHash: ['id', 'name'],
                queryHash2: ['id', 'name'],
              },
              rowVersion: '0a',
            },
          },
        ],
        [
          {
            rowKey: {
              id: '1',
            },
            schema: 'public',
            table: 'issues',
          },
          {
            contents: {
              id: '1',
              owner_id: '100',
              parent_id: null,
              title: 'parent issue foo',
            },
            record: {
              id: {
                rowKey: {
                  id: '1',
                },
                schema: 'public',
                table: 'issues',
              },
              queriedColumns: {
                queryHash: ['id', 'owner_id', 'parent_id', 'title'],
                queryHash2: ['id', 'owner_id', 'parent_id', 'title'],
              },
              rowVersion: '1a0',
            },
          },
        ],
        [
          {
            rowKey: {
              id: '3',
            },
            schema: 'public',
            table: 'issues',
          },
          {
            contents: {
              id: '3',
              owner_id: '102',
              parent_id: '1',
              title: 'foo',
            },
            record: {
              id: {
                rowKey: {
                  id: '3',
                },
                schema: 'public',
                table: 'issues',
              },
              queriedColumns: {
                queryHash: ['id', 'owner_id', 'parent_id', 'title'],
                queryHash2: ['id', 'owner_id', 'parent_id', 'title'],
              },
              rowVersion: '1ca',
            },
          },
        ],
      ]),
    );
  });
});
