import {createSilentLogContext} from 'shared/dist/logging-test-utils.js';
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import {getConnectionURI, initDB, testDBs} from 'zero-cache/dist/test/db.js';
import type {PostgresDB} from 'zero-cache/dist/types/pg.js';
import {Database} from 'zqlite/dist/db.js';
import {initialSync} from './initial-sync.js';

const SHARD_ID = 'initial_sync_validation_test_id';

describe('replicator/initial-sync-validation', () => {
  let upstream: PostgresDB;
  let replica: Database;

  beforeEach(async () => {
    upstream = await testDBs.create('initial_sync_validation_upstream');
    replica = new Database(createSilentLogContext(), ':memory:');
  });

  afterEach(async () => {
    await testDBs.drop(upstream);
  });

  type InvalidUpstreamCase = {
    error: string;
    setupUpstreamQuery?: string;
    requestedPublications?: string[];
    upstream?: Record<string, object[]>;
  };

  const invalidUpstreamCases: InvalidUpstreamCase[] = [
    {
      error: 'does not have a PRIMARY KEY',
      setupUpstreamQuery: `
        CREATE TABLE issues("issueID" INTEGER, "orgID" INTEGER);
      `,
    },
    {
      error: 'uses reserved column name "_0_version"',
      setupUpstreamQuery: `
        CREATE TABLE issues(
          "issueID" INTEGER PRIMARY KEY, 
          "orgID" INTEGER, 
          _0_version INTEGER);
      `,
    },
    {
      error: 'Only the default "public" schema is supported',
      setupUpstreamQuery: `
        CREATE SCHEMA _zero;
        CREATE TABLE _zero.is_not_allowed(
          "issueID" INTEGER PRIMARY KEY, 
          "orgID" INTEGER
        );
        CREATE PUBLICATION zero_foo FOR TABLES IN SCHEMA _zero;
        `,
      requestedPublications: ['zero_foo'],
    },
    {
      error: 'Only the default "public" schema is supported',
      setupUpstreamQuery: `
        CREATE SCHEMA unsupported;
        CREATE TABLE unsupported.issues ("issueID" INTEGER PRIMARY KEY, "orgID" INTEGER);
        CREATE PUBLICATION zero_foo FOR TABLES IN SCHEMA unsupported;
      `,
      requestedPublications: ['zero_foo'],
    },
    {
      error: 'Table "table/with/slashes" has invalid characters',
      setupUpstreamQuery: `
        CREATE TABLE "table/with/slashes" ("issueID" INTEGER PRIMARY KEY, "orgID" INTEGER);
      `,
    },
    {
      error: 'Table "table.with.dots" has invalid characters',
      setupUpstreamQuery: `
        CREATE TABLE "table.with.dots" ("issueID" INTEGER PRIMARY KEY, "orgID" INTEGER);
      `,
    },
    {
      error:
        'Column "column/with/slashes" in table "issues" has invalid characters',
      setupUpstreamQuery: `
        CREATE TABLE issues ("issueID" INTEGER PRIMARY KEY, "column/with/slashes" INTEGER);
      `,
    },
    {
      error:
        'Column "column.with.dots" in table "issues" has invalid characters',
      setupUpstreamQuery: `
        CREATE TABLE issues ("issueID" INTEGER PRIMARY KEY, "column.with.dots" INTEGER);
      `,
    },
  ];

  for (const c of invalidUpstreamCases) {
    test(`Invalid upstream: ${c.error}`, async () => {
      await initDB(upstream, c.setupUpstreamQuery, c.upstream);

      const result = await initialSync(
        createSilentLogContext(),
        {id: SHARD_ID, publications: c.requestedPublications ?? []},
        replica,
        getConnectionURI(upstream),
      ).catch(e => e);

      expect(result).toBeInstanceOf(Error);
      expect(String(result)).toContain(c.error);
    });
  }
});
