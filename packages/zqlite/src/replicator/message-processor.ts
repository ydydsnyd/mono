import type {LogContext} from '@rocicorp/logger';
import type Database from 'better-sqlite3';
import type {Pgoutput} from 'pg-logical-replication';
import {toLexiVersion} from 'zqlite-zero-cache-shared/src/lsn.js';
import type {LexiVersion} from 'zqlite-zero-cache-shared/src/lexi-version.js';
import {DB, queries} from '../internal/db.js';
import {ZERO_VERSION_COLUMN_NAME} from '../consts.js';
import {assert} from 'shared/src/asserts.js';
import type {ServiceProvider} from '../services/service-provider.js';
import {TableTracker} from '../services/duped/table-tracker.js';
import type {ZQLiteContext} from '../context.js';
import type {RowKeyType} from '../services/duped/row-key.js';
import type {UpdateRowChange} from '../services/duped/table-tracker.js';
import {must} from '../../../shared/src/must.js';

const relationRenames: Record<string, Record<string, string>> = {
  zero: {
    clients: '_zero_clients',
  },
};

/**
 * Handles incoming messages from the replicator.
 * Applies them to SQLite.
 * Commits the transaction once a boundary is reached, unless
 * IVM pipelines are still processing. In that case, continues
 * processing new writes until all pipelines are done and we reach a commit boundary.
 *
 * Tells IVM pipelines to process once tx boundary is reached and committed.
 */
export class MessageProcessor {
  readonly #db: DB;
  readonly #setCommittedLsnStmt: Database.Statement;
  readonly #ivmContext: ZQLiteContext;
  readonly #serviceProvider: ServiceProvider;
  readonly #tableTrackers = new Map<string, TableTracker>();
  #version: LexiVersion;
  #inTransaction = false;

  constructor(
    serviceProvider: ServiceProvider,
    ivmContext: ZQLiteContext,
    sqliteDbPath: string,
  ) {
    this.#serviceProvider = serviceProvider;
    this.#db = new DB(sqliteDbPath);
    this.#ivmContext = ivmContext;
    this.#version = toLexiVersion(ivmContext.lsn);

    this.#setCommittedLsnStmt = this.#db.prepare(queries.setCommittedLsn);
  }

  processMessage(lc: LogContext, lsn: string, message: Pgoutput.Message) {
    try {
      this.processMessageImpl(lc, lsn, message);
    } catch (e) {
      if (this.#inTransaction) {
        this.#db.rollbackImperativeTransaction();
      }
      throw e;
    }
  }

  processMessageImpl(lc: LogContext, lsn: string, message: Pgoutput.Message) {
    switch (message.tag) {
      case 'begin':
        this.#begin(lsn);
        break;
      case 'commit':
        this.#commit(lsn);
        break;
      case 'relation':
        break;
      case 'insert':
        this.#insert(message);
        break;
      case 'update':
        this.#update(message);
        break;
      case 'delete':
        this.#delete(message);
        break;
      case 'truncate':
        this.#truncate(message);
        break;
      case 'origin':
        lc.info?.('Ignoring ORIGIN message in replication stream', message);
        break;
      case 'type':
        throw new Error(
          `Custom types are not supported (received "${message.typeName}")`,
        );
      default:
        lc.error?.(
          `Received unexpected message of type ${message.tag}`,
          message,
        );
        throw new Error(
          `Don't know how to handle message of type ${message.tag}`,
        );
    }
  }

  #begin(lsn: string) {
    this.#inTransaction = true;
    this.#version = toLexiVersion(lsn);
    this.#db.beginImperativeTransaction();
  }

  #insert(insert: Pgoutput.MessageInsert) {
    const relationName =
      relationRenames[insert.relation.schema]?.[insert.relation.name] ??
      insert.relation.name;
    const row = {
      ...insert.new,
      [ZERO_VERSION_COLUMN_NAME]: this.#version,
    };
    const key = Object.fromEntries(
      insert.relation.keyColumns.map(col => [col, insert.new[col]]),
    );

    this.#getTableTracker(insert.relation).add({
      preValue: 'none',
      postRowKey: key,
      postValue: row,
    });

    // TODO: in the future we can look up an already prepared statement
    const columns = Object.keys(row)
      .map(c => `"${c}"`)
      .join(', ');
    const valuePlaceholders = Object.keys(row)
      .map(c => `@${c}`)
      .join(', ');
    this.#db
      .prepare(
        `INSERT INTO "${relationName}" (${columns}) VALUES (${valuePlaceholders})`,
      )
      .run(row);
  }

  #update(update: Pgoutput.MessageUpdate) {
    const relationName =
      relationRenames[update.relation.schema]?.[update.relation.name] ??
      update.relation.name;
    const row = {
      ...update.new,
      [ZERO_VERSION_COLUMN_NAME]: this.#version,
    };
    const oldKey = update.key;
    const newKey = Object.fromEntries(
      update.relation.keyColumns.map(col => [col, update.new[col]]),
    );

    this.#getTableTracker(update.relation).add({
      preRowKey: oldKey,
      preValue: must(update.old),
      postRowKey: newKey,
      postValue: row,
    } as const);

    const rowKey = oldKey ?? newKey;
    const keyConditions = getKeyConditions(rowKey);

    // TODO: bring in @databases query builder (https://www.atdatabases.org/docs/sql)
    // so we don't need to do this manual mangling.
    // Do _not_ use their SQLite bindings, however. Just the builder.
    // TODO: accumulate write lambdas into a queue
    // run them all after IVM is run.
    this.#db
      .prepare(
        `UPDATE "${relationName}" SET ${Object.keys(row)
          .map(c => `"${c}" = @${c}`)
          .join(', ')} WHERE ${keyConditions.join(' AND ')}`,
      )
      .run({
        ...row,
        ...rowKey,
      });
  }

  #delete(del: Pgoutput.MessageDelete) {
    const relationName =
      relationRenames[del.relation.schema]?.[del.relation.name] ??
      del.relation.name;
    assert(del.relation.replicaIdentity === 'default');
    assert(del.key);
    const keyConditions = getKeyConditions(del.key);
    const rowKey = del.key;

    this.#getTableTracker(del.relation).add({
      preValue: must(del.old),
      postRowKey: rowKey,
      postValue: 'none',
    } as const);

    this.#db
      .prepare(
        `DELETE FROM "${relationName}" WHERE ${keyConditions.join(' AND ')}`,
      )
      .run(rowKey);
  }

  #truncate(truncate: Pgoutput.MessageTruncate) {
    for (const relation of truncate.relations) {
      const relationName =
        relationRenames[relation.schema]?.[relation.name] ?? relation.name;
      this.#db.prepare(`DELETE FROM "${relationName}"`).run();
    }
    // VACUUM could be rather expensive. How shall we schedule this?
    this.#db.prepare('VACUUM').run();
  }

  #commit(lsn: string) {
    this.#setCommittedLsnStmt.run(lsn);
    this.#inTransaction = false;
    this.#db.commitImperativeTransaction();

    this.#runIvm();
    this.#ivmContext.lsn = lsn;
    this.#updateClients();
    // this.#setIvmLsnStmt.run(lsn);
  }

  #runIvm() {
    // The future implementation will not block. As in,
    // ViewSyncers are in separate processes and we can continue taking writes while
    // they're running.
    this.#ivmContext.materialite.tx(() => {
      for (const [name, tableData] of this.#tableTrackers) {
        const source = this.#ivmContext.getSource(name);
        source.__directlyEnqueueDiffs(tableData.getDiffs());
      }
    });
  }

  #updateClients() {
    this.#serviceProvider.mapViewSyncers(viewSyncer => {
      // Errors handled in the view syncer.
      // If a view syncer fails for a given client connection,
      // it will restart that connection.
      // TODO: we need a way to monitor this queue such that IVM isn't
      // generating more events than we can flush to clients.
      void viewSyncer.newQueryResultsReady();
    });
  }

  #getTableTracker(relation: Pgoutput.MessageRelation) {
    const key =
      relationRenames[relation.schema]?.[relation.name] ?? relation.name;
    const rowKeyType: RowKeyType = Object.fromEntries(
      relation.keyColumns.map(name => {
        const column = relation.columns.find(c => c.name === name);
        assert(column);
        return [name, column];
      }),
    );
    let tracker = this.#tableTrackers.get(key);
    if (!tracker) {
      tracker = new TableTracker(relation.schema, relation.name, rowKeyType);
      this.#tableTrackers.set(key, tracker);
    }
    return tracker;
  }
}

function getKeyConditions(rowKey: Record<string, unknown>) {
  return Object.keys(rowKey).map(col => `"${col}" = @${col}`);
}
