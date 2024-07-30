import type {
  Ordering,
  OrderPart,
  Primitive,
  Selector,
} from 'zql/src/zql/ast/ast.js';
import {DifferenceStream} from 'zql/src/zql/ivm/graph/difference-stream.js';
import {
  createPullResponseMessage,
  PullMsg,
  Request,
} from 'zql/src/zql/ivm/graph/message.js';
import type {MaterialiteForSourceInternal} from 'zql/src/zql/ivm/materialite.js';
import type {Entry, Multiset} from 'zql/src/zql/ivm/multiset.js';
import type {Source, SourceInternal} from 'zql/src/zql/ivm/source/source.js';
import type {PipelineEntity, Version} from 'zql/src/zql/ivm/types.js';
import {genMap, genCached, gen} from 'zql/src/zql/util/iterables.js';
import type {Database, Statement} from 'better-sqlite3';
import type {HoistedCondition} from 'zql/src/zql/ivm/graph/message.js';
import type {HashIndex} from 'zql/src/zql/ivm/source/source-hash-index.js';
import {StatementCache} from './internal/statement-cache.js';
import {TableSourceHashIndex} from './table-source-hash-index.js';
import {mergeRequests} from 'zql/src/zql/ivm/source/set-source.js';
import {assert} from 'shared/src/asserts.js';
import {compile, sql} from './internal/sql.js';

const resolved = Promise.resolve();

// ID is only used for debugging.
let id = 0;

/**
 * An IVM source that is backed by a table in the database.
 *
 * When callers add or remove data from the source, downstream
 * IVM pipelines will be run.
 *
 * The source will also update the underlying database table with
 * the new data being added or removed.
 *
 * As of this commit, the source does not yet write to SQLite.
 */
export class TableSource<T extends PipelineEntity> implements Source<T> {
  readonly #stream: DifferenceStream<T>;
  readonly #internal: SourceInternal;
  readonly #name: string;
  readonly #materialite: MaterialiteForSourceInternal;
  readonly #db: Database;
  // The query used to get history varies with what downstream operators
  // request. We keep a cache to avoid preparing each unique request more than
  // once.
  readonly #historyStatements: StatementCache;
  readonly #historyRequests: Map<number, PullMsg> = new Map();
  readonly #insertStmt: Statement;
  readonly #deleteStmt: Statement;

  // Field for debugging.
  #id = id++;
  // Pending changes to be committed in the current transaction.
  #pending: Multiset<T> | undefined;

  constructor(
    db: Database,
    materialite: MaterialiteForSourceInternal,
    name: string,
    columns: string[],
  ) {
    this.#materialite = materialite;
    this.#name = name;
    this.#stream = new DifferenceStream<T>();
    this.#stream.setUpstream({
      commit: () => {},
      messageUpstream: (message: Request) => {
        this.processMessage(message);
      },
      destroy: () => {},
    });
    this.#db = db;
    this.#historyStatements = new StatementCache(db);
    this.#insertStmt = db.prepare(
      compile(
        sql`INSERT INTO ${sql.ident(name)} (${sql.join(
          columns.map(c => sql.ident(c)),
          sql`, `,
        )}) VALUES (${sql.__dangerous__rawValue(
          new Array(columns.length).fill('?').join(', '),
        )})`,
      ),
    );
    this.#deleteStmt = db.prepare(
      compile(sql`DELETE FROM ${sql.ident(name)} WHERE ${sql.ident('id')} = ?`),
    );

    this.#internal = {
      onCommitEnqueue: (version: Version) => {
        if (this.#pending === undefined && this.#historyRequests.size === 0) {
          return;
        }

        if (this.#historyRequests.size > 0) {
          assert(this.#pending === undefined);
          for (const request of this.#historyRequests.values()) {
            this.#sendHistory(request);
          }
          this.#historyRequests.clear();
          return;
        }

        const pending = this.#pending;
        if (pending !== undefined) {
          this.#stream.newDifference(
            version,
            // we'd need to ensure that the iterable is never
            // re-entered.
            // We need to re-work the pipelines to take an `Iterator` and not an `Iterable`.
            // Only allowing things to be pulled once.
            // Places this fails:
            // 1. self join
            // 2. `or` or any branch in the pipeline
            // The other option of course is `genCached` which ensures that side-effects
            // are not re-run if the same iterable is pulled many times.
            // Well does branching break the whole plan of writing to the DB as we go?
            // If a branch pulls values before another side is ready. Branches getting ahead.
            // This happens, right? The source could have 10 pipelines attached.
            // The first pipeline will exhaust the iterator and run all the writes.
            // The next pipeline will restart the iterator but the writes are already
            // applied.
            //
            // so... we must write before we enqueue and enqueue things item by item :/
            gen<Entry<T>>(() =>
              vendAndWrite(
                this.#db,
                this.#insertStmt,
                this.#deleteStmt,
                pending,
              ),
            ),
            undefined,
          );
        }

        this.#pending = undefined;
      },
      onCommitted: (version: Version) => {
        this.#stream.commit(version);
      },
      onRollback: () => {
        this.#pending = undefined;
      },
    };
  }

  get stream(): DifferenceStream<T> {
    return this.#stream;
  }

  /**
   * This method is required so ZQL can work unchanged on the server.
   * This method will be replaced with `pull` in the future.
   */
  getOrCreateAndMaintainNewHashIndex<K extends Primitive>(
    column: Selector,
  ): HashIndex<K, T> {
    return new TableSourceHashIndex(this.#db, this.#name, column);
  }

  /**
   * The assumption is that the Replicator will collect all the effective
   * changes for a source and then send them all at once for that source.
   *
   * This method allows the replicator to do that by directly enqueuing the
   * differences.
   */
  directlyEnqueueDiffs(diffs: Multiset<T>): void {
    this.#pending = diffs;
    this.#materialite.addDirtySource(this.#internal);
  }

  add(_: T): this {
    throw new Error('Unsupported. Use `directlyEnqueueDiffs` instead.');
  }

  delete(_: T): this {
    throw new Error('Unsupported. Use `directlyEnqueueDiffs` instead.');
  }

  processMessage(message: Request): void {
    switch (message.type) {
      case 'pull': {
        this.#materialite.addDirtySource(this.#internal);
        this.#historyRequests.set(
          message.id,
          mergeRequests(message, this.#historyRequests.get(message.id)),
        );
        break;
      }
    }
  }

  #sendHistory(msg: PullMsg): void {
    const {hoistedConditions} = msg;
    const conditionsForThisSource = hoistedConditions.filter(
      c => c.selector[0] === this.#name,
    );
    const sort = this.#getSort(msg);

    const sortedConditions = conditionsForThisSource
      .concat()
      .sort((a, b) =>
        a.selector[1] > b.selector[1]
          ? 1
          : a.selector[1] === b.selector[1]
          ? 0
          : -1,
      );
    const sql = conditionsAndSortToSQL(this.#name, sortedConditions, sort);
    const stmt = this.#historyStatements.get(sql);

    try {
      this.#stream.newDifference(
        this.#materialite.getVersion(),
        // cached since multiple downstreams may pull on the same iterator.
        // E.g., if the stream is forked.
        genCached(
          genMap(
            // using `iterate` allows us to enforce `limit` in the `view`
            // by having the `view` stop pulling.
            stmt.iterate(...getConditionBindParams(sortedConditions)),
            v => [v, 1],
          ),
        ),
        createPullResponseMessage(msg, this.#name, sort),
      );
    } finally {
      this.#historyStatements.return(sql);
    }
  }

  #getSort(msg: PullMsg): Ordering | undefined {
    // returns the set of fields we were able to sort by from the request.
    // undefined if none.
    if (msg.order === undefined) {
      return undefined;
    }

    const orderParts: OrderPart[] = [];
    for (const orderPart of msg.order) {
      const selector = orderPart[0];
      if (selector[0] === this.#name) {
        orderParts.push(orderPart);
      } else {
        break;
      }
    }

    if (orderParts.length === 0) {
      return undefined;
    }

    return orderParts;
  }

  seed(_: Iterable<T>): this {
    throw new Error('Should not be called for table-source');
  }

  isSeeded(): boolean {
    return true;
  }

  awaitSeeding(): PromiseLike<void> {
    return resolved;
  }

  toString(): string {
    return this.#name + ' ' + this.#id;
  }
}

function* vendAndWrite<T>(
  db: Database,
  insertStmt: Statement,
  deleteStmt: Statement,
  diffs: Multiset<T>,
) {
  for (const diff of diffs) {
    // do the sqlite write
    yield diff;
  }
}

/**
 * When receiving a `pull` request from downstream,
 * the source needs to convert that to SQL. This function
 * does this conversion.
 */
export function conditionsAndSortToSQL(
  table: string,
  conditions: HoistedCondition[],
  sort: Ordering | undefined,
) {
  let query = sql`SELECT * FROM ${sql.ident(table)}`;
  if (conditions.length > 0) {
    query = sql`${query} WHERE ${sql.join(
      conditions.map(c => {
        if (c.op === 'IN') {
          // we use `json_each` so we do not create a different number of bind params each time we see an `IN`
          return sql`${sql.ident(c.selector[1])} ${sql.__dangerous__rawValue(
            c.op,
          )} (SELECT value FROM json_each(?))`;
        } else if (c.op === 'ILIKE') {
          // The default configuration of SQLite only supports case-insensitive comparisons of ASCII characters
          return sql`${sql.ident(c.selector[1])} LIKE ?`;
        }
        return sql`${sql.ident(c.selector[1])} ${sql.__dangerous__rawValue(
          c.op,
        )} ?`;
      }),
      sql` AND `,
    )}`;
  }
  if (sort) {
    query = sql`${query} ORDER BY ${sql.join(
      sort.map(s => sql`${sql.ident(s[0][1])} ${s[1]}`),
      sql`, `,
    )}`;
  }

  return compile(query);
}

export function getConditionBindParams(conditions: HoistedCondition[]) {
  return conditions.map(c =>
    c.op === 'IN' ? JSON.stringify(c.value) : c.value,
  );
}
