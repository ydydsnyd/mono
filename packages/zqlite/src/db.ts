import SQLite3Database, {
  type RunResult,
  type Statement as SQLite3Statement,
  SqliteError,
} from '@rocicorp/zero-sqlite3';
import {trace, type Attributes} from '@opentelemetry/api';
import {version} from '../../otel/src/version.js';
import {manualSpan} from '../../otel/src/span.js';

const tracer = trace.getTracer('view-syncer', version);

export class Database {
  readonly #db: SQLite3Database.Database;
  readonly #threshold: number;

  constructor(
    path: string,
    options?: SQLite3Database.Options,
    slowQueryThreshold = 100,
  ) {
    this.#db = new SQLite3Database(path, options);
    this.#threshold = slowQueryThreshold;
  }

  prepare(sql: string): Statement {
    return this.#run(
      'prepare',
      sql,
      () =>
        new Statement(
          {class: 'Statement', sql},
          this.#db.prepare(sql),
          this.#threshold,
        ),
    );
  }

  exec(sql: string): void {
    this.#run('exec', sql, () => this.#db.exec(sql));
  }

  pragma(sql: string): unknown {
    return this.#run('pragma', sql, () => this.#db.pragma(sql));
  }

  #run<T>(method: string, sql: string, fn: () => T): T {
    const start = performance.now();
    try {
      return fn();
    } catch (e) {
      if (e instanceof SqliteError) {
        e.message += `: ${sql}`;
      }
      throw e;
    } finally {
      logIfSlow(performance.now() - start, {method}, this.#threshold);
    }
  }

  close(): void {
    this.#db.close();
  }

  transaction<T>(fn: () => T): T {
    return this.#db.transaction(fn)();
  }

  get name() {
    return this.#db.name;
  }

  get inTransaction() {
    return this.#db.inTransaction;
  }
}

export class Statement {
  readonly #stmt: SQLite3Statement;
  readonly #threshold: number;
  readonly #attrs: Attributes;

  constructor(attrs: Attributes, stmt: SQLite3Statement, threshold: number) {
    this.#attrs = attrs;
    this.#stmt = stmt;
    this.#threshold = threshold;
  }

  safeIntegers(useBigInt: boolean): this {
    this.#stmt.safeIntegers(useBigInt);
    return this;
  }

  run(...params: unknown[]): RunResult {
    const start = performance.now();
    const ret = this.#stmt.run(...params);
    logIfSlow(
      performance.now() - start,
      {...this.#attrs, method: 'run'},
      this.#threshold,
    );
    return ret;
  }

  get<T>(...params: unknown[]): T {
    const start = performance.now();
    const ret = this.#stmt.get(...params);
    logIfSlow(
      performance.now() - start,
      {...this.#attrs, method: 'get'},
      this.#threshold,
    );
    return ret as T;
  }

  all<T>(...params: unknown[]): T[] {
    const start = performance.now();
    const ret = this.#stmt.all(...params);
    logIfSlow(
      performance.now() - start,
      {...this.#attrs, method: 'all'},
      this.#threshold,
    );
    return ret as T[];
  }

  iterate<T>(...params: unknown[]): IterableIterator<T> {
    return new LoggingIterableIterator(
      this.#attrs,
      this.#stmt.iterate(...params),
      this.#threshold,
    ) as IterableIterator<T>;
  }
}

class LoggingIterableIterator<T> implements IterableIterator<T> {
  readonly #it: IterableIterator<T>;
  readonly #threshold: number;
  readonly #attrs: Attributes;
  #start: number;
  #sqliteRowTimeSum: number;

  constructor(
    attrs: Attributes,
    it: IterableIterator<T>,
    slowQueryThreshold: number,
  ) {
    this.#attrs = attrs;
    this.#it = it;
    this.#start = NaN;
    this.#threshold = slowQueryThreshold;
    this.#sqliteRowTimeSum = 0;
  }

  next(): IteratorResult<T> {
    const start = performance.now();
    const ret = this.#it.next();
    const elapsed = performance.now() - start;
    this.#sqliteRowTimeSum += elapsed;
    if (ret.done) {
      this.#log();
    }
    return ret;
  }

  #log() {
    logIfSlow(
      performance.now() - this.#start,
      {...this.#attrs, type: 'total', method: 'iterate'},
      this.#threshold,
    );
    logIfSlow(
      this.#sqliteRowTimeSum,
      {...this.#attrs, type: 'sqlite', method: 'iterate'},
      this.#threshold,
    );
  }

  [Symbol.iterator](): IterableIterator<T> {
    this.#start = performance.now();
    return this;
  }

  return(): IteratorResult<T> {
    this.#log();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.#it.return?.() as any;
  }

  throw(e: unknown): IteratorResult<T> {
    this.#log();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.#it.throw?.(e) as any;
  }
}

function logIfSlow(
  elapsed: number,
  attrs: Attributes,
  threshold: number,
): void {
  if (elapsed >= threshold) {
    manualSpan(tracer, 'db.slow-query', elapsed, attrs);
  }
}
