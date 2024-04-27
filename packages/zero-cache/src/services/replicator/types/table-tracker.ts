/**
 * Invalidation involves computing invalidation tags on the pre-transaction and
 * post-transaction state of each changed row, the former requiring a db lookup
 * for UPDATE and DELETE changes.
 *
 * During the course of a transaction, however, a row may be updated multiple times,
 * producing the intermediate state that is irrelevant for the purpose of
 * invalidation. A row may even appear and disappear within a transaction and
 * produce no effective change outside of the transaction (i.e. an "ephemeral" row).
 *
 * Similarly, the `ChangeLog` entries for a transaction represents the final state
 * for each row that changed; intermediate changes should not be manifested.
 *
 * The {@link TableTracker} distills a chronological sequence of row changes
 * into the effective pre- and post- transaction values, dropping
 * intermediate and ephemeral changes.
 */
import {assert} from 'shared/out/asserts.js';
import type {RowKey, RowKeyType, RowValue} from '../../../types/row-key.js';
import {rowKeyString} from '../../../types/row-key.js';

export type InsertRowChange = {
  preRowKey?: undefined;
  preValue: 'none';
  postRowKey: RowKey;
  postValue: RowValue;
};

export type UpdateRowChange = {
  /** `preRowKey` is set for an UPDATE in which the row key changed. */
  preRowKey?: RowKey | null;
  preValue: 'unknown';
  postRowKey: RowKey;
  postValue: RowValue;
};

export type DeleteRowChange = {
  preRowKey?: undefined;
  preValue: 'unknown';
  postRowKey: RowKey;
  postValue: 'none';
};

/** A RowChange represents an INSERT, UPDATE, or DELETE. */
export type RowChange = InsertRowChange | UpdateRowChange | DeleteRowChange;

/**
 * The EffectiveRowChange encapsulates the pre- and post- state of a row
 * (i.e. before and after the transaction).
 */
export type EffectiveRowChange = {
  readonly rowKey: RowKey;
  readonly preValue: 'unknown' | 'none';
  readonly postValue: RowValue | 'none';
};

/**
 * Distills a chronological sequence of row changes over the course of a transaction
 * into the effective pre-transaction and post-transaction state of each row, allowing
 * the determination of the minimal diffs used for invalidation (i.e. ignoring
 * intermediate ephemeral state).
 *
 * Row changes which result in a row key change (e.g. UPDATEs that modify key values)
 * are represented as effective changes to rows of both the old and new key.
 */
export class TableTracker {
  readonly schema: string;
  readonly table: string;
  readonly rowKeyType: RowKeyType;

  readonly #rows = new Map<string, EffectiveRowChange>();
  #truncated = false;

  constructor(schema: string, table: string, rowKeyType: RowKeyType) {
    this.schema = schema;
    this.table = table;
    this.rowKeyType = rowKeyType;
  }

  add(change: RowChange) {
    const {postValue} = change;

    const postKey = rowKeyString(change.postRowKey);
    const sameKeyNodes = this.#rows.get(postKey);

    if (sameKeyNodes) {
      this.#rows.set(postKey, {...sameKeyNodes, postValue});
    } else {
      // First time this row has appeared in this transaction.
      // If this was an UPDATE from a preRowKey, treat it as an INSERT of the postRowKey.
      const preValue = change.preRowKey ? 'none' /* INSERT */ : change.preValue;
      this.#rows.set(postKey, {
        rowKey: change.postRowKey,
        preValue,
        postValue,
      });
    }
    if (change.preRowKey) {
      const preKey = rowKeyString(change.preRowKey);
      assert(preKey !== postKey);

      // In the case of an UPDATE with a row key change, set the terminal state of the
      // old row key to `null` as if it were DELETE'd.
      const parentNodes = this.#rows.get(preKey);
      if (parentNodes) {
        this.#rows.set(preKey, {...parentNodes, postValue: 'none'});
      } else {
        // First time this row has appeared in this transaction.
        this.#rows.set(preKey, {
          rowKey: change.preRowKey,
          preValue: change.preValue,
          postValue: 'none',
        });
      }
    }
  }

  truncate() {
    // Every time the table is truncated, the row changes are cleared since
    // they are no longer relevant.
    this.#rows.clear();
    this.#truncated = true;
  }

  getEffectiveRowChanges(): {
    truncated: boolean;
    changes: Map<string, EffectiveRowChange>;
  } {
    return {
      truncated: this.#truncated,
      changes: new Map(
        [...this.#rows].filter(
          // Exclude non-changes, i.e. previously non-existent rows that were INSERT'ed
          // but ultimately DELETE'd.
          ([_, change]) =>
            !(change.preValue === 'none' && change.postValue === 'none'),
        ),
      ),
    };
  }
}
