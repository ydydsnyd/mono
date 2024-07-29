import type {Pgoutput} from 'pg-logical-replication';
import {TableTracker} from '../services/replicator/types/table-tracker.js';
import {relationRenames} from './relation-names.js';
import type {RowKeyType} from '../types/row-key.js';
import {assert} from 'shared/src/asserts.js';
import {must} from 'shared/src/must.js';
import {ZERO_VERSION_COLUMN_NAME} from '../services/replicator/schema/replication.js';
import {toLexiVersion} from 'zqlite-zero-cache-shared/src/lsn.js';
import type {LexiVersion} from '../../../zqlite-zero-cache-shared/src/lexi-version.js';

export class IvmRunner {
  readonly #tableTrackers = new Map<string, TableTracker>();
  #inTransaction = false;
  #version: LexiVersion | undefined;

  begin(lsn: string) {
    if (this.#inTransaction) {
      throw new Error('Previous transaction not committed');
    }
    this.#inTransaction = true;
    this.#version = toLexiVersion(lsn);
  }

  insert(insert: Pgoutput.MessageInsert) {
    const row = {
      ...insert.new,
      [ZERO_VERSION_COLUMN_NAME]: must(this.#version),
    };
    const key = Object.fromEntries(
      insert.relation.keyColumns.map(col => [col, insert.new[col]]),
    );
    this.#getTableTracker(insert.relation).add({
      preValue: 'none',
      postRowKey: key,
      postValue: row,
    });
  }

  update(update: Pgoutput.MessageUpdate) {
    const row = {
      ...update.new,
      [ZERO_VERSION_COLUMN_NAME]: must(this.#version),
    };
    // update.key is set with the old values if the key has changed.
    const oldKey = update.key;
    const newKey = Object.fromEntries(
      update.relation.keyColumns.map(col => [col, update.new[col]]),
    );

    this.#getTableTracker(update.relation).add({
      preRowKey: oldKey,
      preValue: 'unknown',
      postRowKey: newKey,
      postValue: row,
    });
  }

  delete(del: Pgoutput.MessageDelete) {
    assert(del.relation.replicaIdentity === 'default');
    assert(del.key);
    const rowKey = del.key;

    this.#getTableTracker(del.relation).add({
      preValue: 'unknown',
      postRowKey: rowKey,
      postValue: 'none',
    });
  }

  commit() {
    // 1. convert to diffs w/ accompanying pre-values
    // 2. push through ZqliteContext
  }

  #getRelationName(relation: Pgoutput.MessageRelation) {
    return relationRenames[relation.schema]?.[relation.name] ?? relation.name;
  }

  #getTableTracker(relation: Pgoutput.MessageRelation) {
    const key = this.#getRelationName(relation);
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
