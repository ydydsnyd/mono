import type {LogContext} from '@rocicorp/logger';
import type Database from 'better-sqlite3';
import type {Pgoutput} from 'pg-logical-replication';
import {toLexiVersion} from 'zqlite-zero-cache-shared/src/lsn.js';
import type {LexiVersion} from 'zqlite-zero-cache-shared/src/lexi-version.js';
import {DB, queries} from '../internal/db.js';
import {ZERO_VERSION_COLUMN_NAME} from '../consts.js';
import {assert} from '../../../shared/src/asserts.js';
import type {Context} from 'zql/src/zql/context/context.js';
import type {ServiceProvider} from '../services/service-provider.js';

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
  readonly #setIvmLsnStmt: Database.Statement;
  readonly #ivmContext: Context;
  readonly #serviceProvider: ServiceProvider;
  #rowVersion: LexiVersion | undefined;
  #inTransaction = false;

  constructor(
    serviceProvider: ServiceProvider,
    ivmContext: Context,
    sqliteDbPath: string,
  ) {
    this.#serviceProvider = serviceProvider;
    this.#db = new DB(sqliteDbPath);
    this.#ivmContext = ivmContext;

    this.#setCommittedLsnStmt = this.#db.prepare(queries.setCommittedLsn);
    this.#setIvmLsnStmt = this.#db.prepare(queries.setIvmLsn);
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
    this.#rowVersion = toLexiVersion(lsn);
    this.#db.beginImperativeTransaction();
  }

  #insert(insert: Pgoutput.MessageInsert) {
    const row = {
      ...insert.new,
      [ZERO_VERSION_COLUMN_NAME]: this.#rowVersion,
    };

    // TODO: in the future we can look up an already prepared statement
    const columns = Object.keys(row)
      .map(c => `"${c}"`)
      .join(', ');
    const valuePlaceholders = Object.keys(row)
      .map(c => `@${c}`)
      .join(', ');
    this.#db
      .prepare(
        `INSERT INTO "${insert.relation.name}" (${columns}) VALUES (${valuePlaceholders})`,
      )
      .run(row);
  }

  #update(update: Pgoutput.MessageUpdate) {
    const row = {
      ...update.new,
      [ZERO_VERSION_COLUMN_NAME]: this.#rowVersion,
    };
    const oldKey = update.key;
    const newKey = Object.fromEntries(
      update.relation.keyColumns.map(col => [col, update.new[col]]),
    );
    const rowKey = oldKey ?? newKey;
    const keyConditions = getKeyConditions(rowKey);

    // TODO: bring in @databases query builder (https://www.atdatabases.org/docs/sql)
    // so we don't need to do this manual mangling.
    // Do _not_ use their SQLite bindings, however. Just the builder.
    this.#db
      .prepare(
        `UPDATE "${update.relation.name}" SET ${Object.keys(row)
          .map(c => `"${c}" = @${c}`)
          .join(', ')} WHERE ${keyConditions.join(' AND ')}`,
      )
      .run({
        ...row,
        ...rowKey,
      });
  }

  #delete(del: Pgoutput.MessageDelete) {
    assert(del.relation.replicaIdentity === 'default');
    assert(del.key);
    const keyConditions = getKeyConditions(del.key);
    const rowKey = del.key;

    this.#db
      .prepare(
        `DELETE FROM "${del.relation.name}" WHERE ${keyConditions.join(
          ' AND ',
        )}`,
      )
      .run(rowKey);
  }

  #truncate(truncate: Pgoutput.MessageTruncate) {
    for (const relation of truncate.relations) {
      this.#db.prepare(`DELETE FROM "${relation.name}"`).run();
    }
    // VACUUM could be rather expensive. How shall we schedule this?
    this.#db.prepare('VACUUM').run();
  }

  #commit(lsn: string) {
    this.#setCommittedLsnStmt.run(lsn);
    this.#inTransaction = false;
    this.#db.commitImperativeTransaction();

    this.#runIvm();
    this.#updateCvrs();
    this.#setIvmLsnStmt.run(lsn);
    // The async bit. Should be serialized with queries that need to run from scratch.
    // Any promise that fails here will cause the connection to reset.
    this.#flushChangesToClients();
  }

  #runIvm() {
    // The future implementation will not block. As in,
    // ViewSyncers are in separate processes and we can continue taking writes while
    // they're running.
    // Pipeline manager has all pipelines.
    // We shove through the source.
    // loop through each accumulated row for each source via (table-tracker)
    // apply those diffs through the IVMContext in a single transaction.
    // 1. Run IVM across all sources
    // 2. Get all view syncers
    // 3. Tell them all their query results are ready
    // 4. They iterate over their pipelines and deal with that
    this.#ivmContext.materialite.tx(() => {
      for (const tableData of this.#tableTrackers) {
        const source = this.#ivmContext.getSource(tableData.name);
        source.directlyEnqueueDiffs(tableData.diffs);
      }
    });
  }

  #updateCvrs() {
    this.#serviceProvider.mapViewSyncers(viewSyncer => {
      viewSyncer.updateCvrWithNewQueryResults();
    });
  }

  #flushChangesToClients() {
    this.#serviceProvider.mapViewSyncers(viewSyncer => {
      viewSyncer.flushChangesToClients();
    });
  }
}

function getKeyConditions(rowKey: Record<string, unknown>) {
  return Object.keys(rowKey).map(col => `"${col}" = @${col}`);
}
