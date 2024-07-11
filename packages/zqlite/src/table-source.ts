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
import type {Multiset} from 'zql/src/zql/ivm/multiset.js';
import type {Source, SourceInternal} from 'zql/src/zql/ivm/source/source.js';
import type {PipelineEntity, Version} from 'zql/src/zql/ivm/types.js';
import {genMap, genCached} from 'zql/src/zql/util/iterables.js';
import type {Database} from 'better-sqlite3';
import type {HoistedCondition} from 'zql/src/zql/ivm/graph/message.js';
import type {HashIndex} from 'zql/src/zql/ivm/source/source-hash-index.js';
import {StatementCache} from './internal/statement-cache.js';
import {TableSourceHashIndex} from './table-source-hash-index.js';
import {mergeRequests} from 'zql/src/zql/ivm/source/set-source.js';
import {assert} from 'shared/src/asserts.js';

const resolved = Promise.resolve();

// ID is only used for debugging.
let id = 0;

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

  // Field for debugging.
  #id = id++;
  // Pending changes to be committed in the current transaction.
  #pending: Multiset<T> | undefined;

  constructor(
    db: Database,
    materialite: MaterialiteForSourceInternal,
    name: string,
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

        if (this.#pending !== undefined) {
          this.#stream.newDifference(version, this.#pending, undefined);
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

  getOrCreateAndMaintainNewHashIndex<K extends Primitive>(
    column: Selector,
  ): HashIndex<K, T> {
    return new TableSourceHashIndex(this.#db, this.#name, column);
  }

  add(_: T): this {
    throw new Error('Unsupported');
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  __directlyEnqueueDiffs(diffs: Multiset<T>): void {
    this.#pending = diffs;
    this.#materialite.addDirtySource(this.#internal);
  }

  delete(_: T): this {
    throw new Error('Unsupported');
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

export function conditionsAndSortToSQL(
  table: string,
  conditions: HoistedCondition[],
  sort: Ordering | undefined,
) {
  let sql = `SELECT * FROM ${table}`;
  if (conditions.length > 0) {
    sql += ' WHERE ';
    sql += conditions.map(c => `${c.selector[1]} ${c.op} ?`).join(' AND ');
  }
  if (sort) {
    sql += ' ORDER BY ';
    sql += sort.map(s => `"${s[0][1]}" ${s[1]}`).join(', ');
  }

  return sql;
}

export function getConditionBindParams(conditions: HoistedCondition[]) {
  return conditions.map(c => c.value);
}
