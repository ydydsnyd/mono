import type {Context} from 'zql/src/zql/context/context.js';
import type {Database, Statement} from 'better-sqlite3';
import {TableSource} from './table-source.js';
import type {PipelineEntity} from 'zql/src/zql/ivm/types.js';
import type {Source} from 'zql/src/zql/ivm/source/source.js';
import type {ZQLite} from './ZQLite.js';
import type { Materialite } from 'zql/src/zql/ivm/materialite.js';

const emptyFunction = () => {};
export class ZqliteContext implements Context {
  readonly materialite: Materialite;
  readonly #db: Database;
  readonly #sources = new Map<string, Source<PipelineEntity>>();
  readonly #columnsStatement: Statement;

  constructor(
    materialite: Materialite,
    db: Database,
  ) {
    this.materialite = materialite;
    this.#db = db;
    const sql = `SELECT name FROM pragma_table_info(?)`;
    this.#columnsStatement = this.#db.prepare(sql);
  }

  getSource<T extends PipelineEntity>(name: string): Source<T> {
    let existing = this.#sources.get(name);
    if (existing) {
      return existing as Source<T>;
    }
    const columns = this.#columnsStatement.all(name);
    existing = this.materialite.constructSource(
      internal =>
        new TableSource(
          this.#db,
          internal,
          name,
          columns.map(c => c.name),
        ),
    );
    this.#sources.set(name, existing);
    return existing as Source<T>;
  }
  subscriptionAdded = () => emptyFunction;
}

export function createContext(materialite: ZQLite, db: Database): Context {
  return new ZqliteContext(materialite, db);
}
