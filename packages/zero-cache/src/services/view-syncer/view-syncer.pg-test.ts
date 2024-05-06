import {LogContext, consoleLogSink} from '@rocicorp/logger';
import type {AST} from '@rocicorp/zql/src/zql/ast/ast.js';
import {Queue} from 'shared/src/queue.js';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import type {PokePartBody, Upstream} from 'zero-protocol';
import {TransactionPool} from '../../db/transaction-pool.js';
import {DurableStorage} from '../../storage/durable-storage.js';
import {testDBs} from '../../test/db.js';
import {runWithFakeDurableObjectStorage} from '../../test/fake-do.js';
import {createSilentLogContext} from '../../test/logger.js';
import type {PostgresDB} from '../../types/pg.js';
import type {CancelableAsyncIterable} from '../../types/streams.js';
import {Subscription} from '../../types/subscription.js';
import type {
  InvalidationWatcher,
  QueryInvalidationUpdate,
  WatchRequest,
} from '../invalidation-watcher/invalidation-watcher.js';
import type {InvalidationWatcherRegistry} from '../invalidation-watcher/registry.js';
import {getPublicationInfo} from '../replicator/tables/published.js';
import type {TableSpec} from '../replicator/tables/specs.js';
import {loadCVR} from './cvr.js';
import {ViewSyncerService} from './view-syncer.js';

describe('view-syncer/service', () => {
  let db: PostgresDB;
  const lc = new LogContext('debug', {}, consoleLogSink);
  createSilentLogContext();

  beforeEach(async () => {
    db = await testDBs.create('view_syncer_service_test');
    await db`
    CREATE SCHEMA zero;
    CREATE TABLE zero.clients (
      "clientID" TEXT PRIMARY KEY,
      "lastMutationID" BIGINT,
      _0_version VARCHAR(38)
    );
    CREATE TABLE issues (
      id text PRIMARY KEY,
      owner_id text,
      parent_id text,
      big int8,
      title text,
      _0_version VARCHAR(38)
    );
    CREATE TABLE users (
      id text PRIMARY KEY,
      name text,
      _0_version VARCHAR(38)
    );

    INSERT INTO zero.clients ("clientID", "lastMutationID", _0_version)
                      VALUES ('foo', 42, '0a');

    INSERT INTO users (id, name, _0_version) VALUES ('100', 'Alice', '0a');
    INSERT INTO users (id, name,  _0_version) VALUES ('101', 'Bob', '0b');
    INSERT INTO users (id, name, _0_version) VALUES ('102', 'Candice', '0c');

    INSERT INTO issues (id, title, owner_id, big, _0_version) VALUES ('1', 'parent issue foo', 100, 9007199254740991, '1a0');
    INSERT INTO issues (id, title, owner_id, big, _0_version) VALUES ('2', 'parent issue bar', 101, -9007199254740991, '1ab');
    INSERT INTO issues (id, title, owner_id, parent_id, big, _0_version) VALUES ('3', 'foo', 102, 1, 123, '1ca');
    INSERT INTO issues (id, title, owner_id, parent_id, big, _0_version) VALUES ('4', 'bar', 101, 2, 100, '1cd');

    CREATE PUBLICATION zero_all FOR ALL TABLES;
    `.simple();
  });

  afterEach(async () => {
    await testDBs.drop(db);
  });

  const serviceID = '9876';

  function clientUpstream(...up: Upstream[]): Subscription<Upstream> {
    const stream = new Subscription<Upstream>();
    up.forEach(msg => stream.push(msg));
    return stream;
  }

  const ISSUES_TITLE_QUERY: AST = {
    select: [
      ['id', 'id'],
      ['title', 'title'],
      ['big', 'big'],
    ],
    table: 'issues',
  };

  test('initializes schema', async () => {
    await runWithFakeDurableObjectStorage(async storage => {
      const watcher = new MockInvalidationWatcher();
      const vs = new ViewSyncerService(
        lc,
        serviceID,
        new DurableStorage(storage),
        watcher,
      );

      const done = vs.run();
      await vs.sync(
        {clientID: 'foo', baseCookie: null},
        {
          desiredQueriesPatch: [
            {op: 'put', hash: 'query-hash1', ast: ISSUES_TITLE_QUERY},
          ],
        },
        clientUpstream(),
      );

      expect(await storage.get('/vs/storage_schema_meta')).toEqual({
        // Update versions as necessary
        version: 1,
        maxVersion: 1,
        minSafeRollbackVersion: 1,
      });

      await vs.stop();
      return done;
    });
  });

  test('adds desired queries from initConnectionMessage', async () => {
    await runWithFakeDurableObjectStorage(async storage => {
      const watcher = new MockInvalidationWatcher();
      const vs = new ViewSyncerService(
        lc,
        serviceID,
        new DurableStorage(storage),
        watcher,
      );

      const done = vs.run();
      await vs.sync(
        {clientID: 'foo', baseCookie: null},
        {
          desiredQueriesPatch: [
            {op: 'put', hash: 'query-hash1', ast: ISSUES_TITLE_QUERY},
          ],
        },
        clientUpstream(),
      );

      const cvr = await loadCVR(new DurableStorage(storage), serviceID);
      expect(cvr).toMatchObject({
        clients: {
          foo: {
            desiredQueryIDs: ['query-hash1'],
            id: 'foo',
            patchVersion: {stateVersion: '00', minorVersion: 1},
          },
        },
        id: '9876',
        queries: {
          'query-hash1': {
            ast: ISSUES_TITLE_QUERY,
            desiredBy: {foo: {stateVersion: '00', minorVersion: 1}},
            id: 'query-hash1',
          },
        },
        version: {stateVersion: '00', minorVersion: 1},
      });

      await vs.stop();
      return done;
    });
  });

  test('subscribes and responds to initial invalidation', async () => {
    await runWithFakeDurableObjectStorage(async storage => {
      const watcher = new MockInvalidationWatcher();
      const vs = new ViewSyncerService(
        lc,
        serviceID,
        new DurableStorage(storage),
        watcher,
      );

      const done = vs.run();
      const downstream = await vs.sync(
        {clientID: 'foo', baseCookie: null},
        {
          desiredQueriesPatch: [
            {op: 'put', hash: 'query-hash1', ast: ISSUES_TITLE_QUERY},
          ],
        },
        clientUpstream(),
      );

      const request = await watcher.requests.dequeue();
      expect(request.fromVersion).toBeUndefined();
      expect(Object.keys(request.queries).length).toBe(
        2, // including internal "lmids" query
      );

      const reader = new TransactionPool(lc);
      const readerDone = reader.run(db);

      watcher.subscriptions[0].push({
        fromVersion: null,
        newVersion: '1xz',
        invalidatedQueries: new Set(),
        reader,
      });

      await watcher.consumed[0].dequeue();
      reader.setDone();

      const expectedPokes = [
        ['pokeStart', {pokeID: '1xz', baseCookie: null, cookie: '1xz'}],
        [
          'pokePart',
          {
            pokeID: '1xz',
            clientsPatch: [{clientID: 'foo', op: 'put'}],
            lastMutationIDChanges: {foo: 42},
            desiredQueriesPatches: {
              foo: [{ast: ISSUES_TITLE_QUERY, hash: 'query-hash1', op: 'put'}],
            },
            entitiesPatch: [
              {
                op: 'put',
                entityID: {id: '1'},
                entityType: 'issues',
                value: {
                  id: '1',
                  title: 'parent issue foo',
                  big: 9007199254740991,
                },
              },
              {
                op: 'put',
                entityID: {id: '2'},
                entityType: 'issues',
                value: {
                  id: '2',
                  title: 'parent issue bar',
                  big: -9007199254740991,
                },
              },
              {
                op: 'put',
                entityID: {id: '3'},
                entityType: 'issues',
                value: {id: '3', title: 'foo', big: 123},
              },
              {
                op: 'put',
                entityID: {id: '4'},
                entityType: 'issues',
                value: {id: '4', title: 'bar', big: 100},
              },
            ],
            gotQueriesPatch: [
              {ast: ISSUES_TITLE_QUERY, hash: 'query-hash1', op: 'put'},
            ],
          } satisfies PokePartBody,
        ],
        ['pokeEnd', {pokeID: '1xz'}],
      ];

      let i = 0;
      for await (const poke of downstream) {
        expect(poke).toEqual(expectedPokes[i]);
        if (++i >= expectedPokes.length) {
          break;
        }
      }

      const cvr = await loadCVR(new DurableStorage(storage), serviceID);
      expect(cvr).toMatchObject({
        clients: {
          foo: {
            desiredQueryIDs: ['query-hash1'],
            id: 'foo',
            patchVersion: {stateVersion: '00', minorVersion: 1},
          },
        },
        id: '9876',
        queries: {
          'lmids': {
            ast: {
              schema: 'zero',
              table: 'clients',
              select: [
                ['clientID', 'clientID'],
                ['lastMutationID', 'lastMutationID'],
              ],
              where: {
                type: 'conjunction',
                op: 'OR',
                conditions: [
                  {
                    type: 'simple',
                    op: '=',
                    field: 'clientID',
                    value: {type: 'literal', value: 'foo'},
                  },
                ],
              },
            },
            internal: true,
            id: 'lmids',
            transformationVersion: {stateVersion: '1xz'},
          },
          'query-hash1': {
            ast: ISSUES_TITLE_QUERY,
            desiredBy: {foo: {stateVersion: '00', minorVersion: 1}},
            id: 'query-hash1',
            patchVersion: {stateVersion: '1xz'},
            transformationVersion: {stateVersion: '1xz'},
          },
        },
        version: {stateVersion: '1xz'},
      });

      const rowRecords = await storage.list({
        prefix: `/vs/cvr/${serviceID}/d/`,
      });
      expect(new Set(rowRecords.values())).toEqual(
        new Set([
          {
            id: {rowKey: {id: '1'}, schema: 'public', table: 'issues'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {
              id: ['query-hash1'],
              title: ['query-hash1'],
              big: ['query-hash1'],
            },
            rowVersion: '1a0',
          },
          {
            id: {rowKey: {id: '2'}, schema: 'public', table: 'issues'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {
              id: ['query-hash1'],
              title: ['query-hash1'],
              big: ['query-hash1'],
            },
            rowVersion: '1ab',
          },
          {
            id: {rowKey: {id: '3'}, schema: 'public', table: 'issues'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {
              id: ['query-hash1'],
              title: ['query-hash1'],
              big: ['query-hash1'],
            },
            rowVersion: '1ca',
          },
          {
            id: {rowKey: {id: '4'}, schema: 'public', table: 'issues'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {
              id: ['query-hash1'],
              title: ['query-hash1'],
              big: ['query-hash1'],
            },
            rowVersion: '1cd',
          },
          {
            id: {rowKey: {clientID: 'foo'}, schema: 'zero', table: 'clients'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {clientID: ['lmids'], lastMutationID: ['lmids']},
            rowVersion: '0a',
          },
        ]),
      );

      const rowPatches = await storage.list({
        prefix: `/vs/cvr/${serviceID}/p/d/`,
      });
      expect(rowPatches).toEqual(
        new Map([
          [
            '/vs/cvr/9876/p/d/1xz/r/Qxp2tFD-UOgu7-78ZYiLHw',
            {
              columns: ['big', 'id', 'title'],
              id: {rowKey: {id: '4'}, schema: 'public', table: 'issues'},
              op: 'put',
              rowVersion: '1cd',
              type: 'row',
            },
          ],
          [
            '/vs/cvr/9876/p/d/1xz/r/VPg9hxKPhJtHB6oYkGqBpw',
            {
              columns: ['big', 'id', 'title'],
              id: {rowKey: {id: '2'}, schema: 'public', table: 'issues'},
              op: 'put',
              rowVersion: '1ab',
              type: 'row',
            },
          ],
          [
            '/vs/cvr/9876/p/d/1xz/r/oA1bf0ulYhik9qypZFPeLQ',
            {
              columns: ['big', 'id', 'title'],
              id: {rowKey: {id: '1'}, schema: 'public', table: 'issues'},
              op: 'put',
              rowVersion: '1a0',
              type: 'row',
            },
          ],
          [
            '/vs/cvr/9876/p/d/1xz/r/wfZrxQPRsszHpdfLRWoPzA',
            {
              columns: ['big', 'id', 'title'],
              id: {rowKey: {id: '3'}, schema: 'public', table: 'issues'},
              op: 'put',
              rowVersion: '1ca',
              type: 'row',
            },
          ],
          [
            '/vs/cvr/9876/p/d/1xz/r/RRjZLHnRXDtSeGWxUc_a4w',
            {
              columns: ['clientID', 'lastMutationID'],
              id: {
                schema: 'zero',
                table: 'clients',
                rowKey: {clientID: 'foo'},
              },
              op: 'put',
              rowVersion: '0a',
              type: 'row',
            },
          ],
        ]),
      );

      await vs.stop();
      return Promise.all([done, readerDone]);
    });
  });

  test('fails pokes with error on unsafe integer', async () => {
    await runWithFakeDurableObjectStorage(async storage => {
      const watcher = new MockInvalidationWatcher();
      const vs = new ViewSyncerService(
        lc,
        serviceID,
        new DurableStorage(storage),
        watcher,
      );

      const done = vs.run();

      // Make one value too large to send back in the current zero-protocol.
      await db`UPDATE issues SET big = 10000000000000000 WHERE id = '4';`;

      const downstream = await vs.sync(
        {clientID: 'foo', baseCookie: null},
        {
          desiredQueriesPatch: [
            {op: 'put', hash: 'query-hash1', ast: ISSUES_TITLE_QUERY},
          ],
        },
        clientUpstream(),
      );

      await watcher.requests.dequeue();
      const reader = new TransactionPool(lc);
      const readerDone = reader.run(db);

      watcher.subscriptions[0].push({
        fromVersion: null,
        newVersion: '1xz',
        invalidatedQueries: new Set(),
        reader,
      });

      await watcher.consumed[0].dequeue();
      reader.setDone();

      let err;
      let i = 0;
      try {
        for await (const _ of downstream) {
          if (++i >= 3) {
            break;
          }
        }
      } catch (e) {
        err = e;
      }
      expect(err).not.toBeUndefined();

      // Everything else should succeed, however, because CVRs are agnostic to row
      // contents, and the data in the DB is technically "valid" (and available when
      // the protocol supports it).
      const cvr = await loadCVR(new DurableStorage(storage), serviceID);
      expect(cvr).toMatchObject({
        clients: {
          foo: {
            desiredQueryIDs: ['query-hash1'],
            id: 'foo',
            patchVersion: {stateVersion: '00', minorVersion: 1},
          },
        },
        id: '9876',
        queries: {
          'lmids': {
            ast: {
              schema: 'zero',
              table: 'clients',
              select: [
                ['clientID', 'clientID'],
                ['lastMutationID', 'lastMutationID'],
              ],
              where: {
                type: 'conjunction',
                op: 'OR',
                conditions: [
                  {
                    type: 'simple',
                    op: '=',
                    field: 'clientID',
                    value: {type: 'literal', value: 'foo'},
                  },
                ],
              },
            },
            internal: true,
            id: 'lmids',
            transformationVersion: {stateVersion: '1xz'},
          },
          'query-hash1': {
            ast: ISSUES_TITLE_QUERY,
            desiredBy: {foo: {stateVersion: '00', minorVersion: 1}},
            id: 'query-hash1',
            patchVersion: {stateVersion: '1xz'},
            transformationVersion: {stateVersion: '1xz'},
          },
        },
        version: {stateVersion: '1xz'},
      });

      const rowRecords = await storage.list({
        prefix: `/vs/cvr/${serviceID}/d/`,
      });
      expect(new Set(rowRecords.values())).toEqual(
        new Set([
          {
            id: {rowKey: {id: '1'}, schema: 'public', table: 'issues'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {
              id: ['query-hash1'],
              title: ['query-hash1'],
              big: ['query-hash1'],
            },
            rowVersion: '1a0',
          },
          {
            id: {rowKey: {id: '2'}, schema: 'public', table: 'issues'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {
              id: ['query-hash1'],
              title: ['query-hash1'],
              big: ['query-hash1'],
            },
            rowVersion: '1ab',
          },
          {
            id: {rowKey: {id: '3'}, schema: 'public', table: 'issues'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {
              id: ['query-hash1'],
              title: ['query-hash1'],
              big: ['query-hash1'],
            },
            rowVersion: '1ca',
          },
          {
            id: {rowKey: {id: '4'}, schema: 'public', table: 'issues'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {
              id: ['query-hash1'],
              title: ['query-hash1'],
              big: ['query-hash1'],
            },
            rowVersion: '1cd',
          },
          {
            id: {rowKey: {clientID: 'foo'}, schema: 'zero', table: 'clients'},
            patchVersion: {stateVersion: '1xz'},
            queriedColumns: {clientID: ['lmids'], lastMutationID: ['lmids']},
            rowVersion: '0a',
          },
        ]),
      );

      const rowPatches = await storage.list({
        prefix: `/vs/cvr/${serviceID}/p/d/`,
      });
      expect(rowPatches).toEqual(
        new Map([
          [
            '/vs/cvr/9876/p/d/1xz/r/Qxp2tFD-UOgu7-78ZYiLHw',
            {
              columns: ['big', 'id', 'title'],
              id: {rowKey: {id: '4'}, schema: 'public', table: 'issues'},
              op: 'put',
              rowVersion: '1cd',
              type: 'row',
            },
          ],
          [
            '/vs/cvr/9876/p/d/1xz/r/VPg9hxKPhJtHB6oYkGqBpw',
            {
              columns: ['big', 'id', 'title'],
              id: {rowKey: {id: '2'}, schema: 'public', table: 'issues'},
              op: 'put',
              rowVersion: '1ab',
              type: 'row',
            },
          ],
          [
            '/vs/cvr/9876/p/d/1xz/r/oA1bf0ulYhik9qypZFPeLQ',
            {
              columns: ['big', 'id', 'title'],
              id: {rowKey: {id: '1'}, schema: 'public', table: 'issues'},
              op: 'put',
              rowVersion: '1a0',
              type: 'row',
            },
          ],
          [
            '/vs/cvr/9876/p/d/1xz/r/wfZrxQPRsszHpdfLRWoPzA',
            {
              columns: ['big', 'id', 'title'],
              id: {rowKey: {id: '3'}, schema: 'public', table: 'issues'},
              op: 'put',
              rowVersion: '1ca',
              type: 'row',
            },
          ],
          [
            '/vs/cvr/9876/p/d/1xz/r/RRjZLHnRXDtSeGWxUc_a4w',
            {
              columns: ['clientID', 'lastMutationID'],
              id: {
                schema: 'zero',
                table: 'clients',
                rowKey: {clientID: 'foo'},
              },
              op: 'put',
              rowVersion: '0a',
              type: 'row',
            },
          ],
        ]),
      );

      await vs.stop();
      return Promise.all([done, readerDone]);
    });
  });

  class MockInvalidationWatcher
    implements InvalidationWatcher, InvalidationWatcherRegistry
  {
    readonly requests = new Queue<WatchRequest>();
    readonly subscriptions: Subscription<QueryInvalidationUpdate>[] = [];
    readonly consumed: Queue<true>[] = [];

    watch(
      request: WatchRequest,
    ): Promise<CancelableAsyncIterable<QueryInvalidationUpdate>> {
      void this.requests.enqueue(request);
      const consumed = new Queue<true>();
      const sub = new Subscription<QueryInvalidationUpdate>({
        consumed: () => void consumed.enqueue(true),
      });
      this.subscriptions.push(sub);
      this.consumed.push(consumed);
      return Promise.resolve(sub);
    }

    async getTableSchemas(): Promise<readonly TableSpec[]> {
      const published = await getPublicationInfo(db);
      return published.tables;
    }

    getInvalidationWatcher(): Promise<InvalidationWatcher> {
      return Promise.resolve(this);
    }
  }
});
