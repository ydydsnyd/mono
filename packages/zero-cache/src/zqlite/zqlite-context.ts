import type {Context} from 'zql/src/zql/context/context.js';
import type {Materialite} from 'zql/src/zql/ivm/materialite.js';
import type {Database} from 'better-sqlite3';
import {TableSource} from './table-source.js';
import type {PipelineEntity} from 'zql/src/zql/ivm/types.js';
import type {Source} from 'zql/src/zql/ivm/source/source.js';
import {queries} from './db/db.js';

const emptyFunction = () => {};

export type ZQLiteContext = Context & {
  lsn: string;
  db: Database;
};

export function createContext(
  materialite: Materialite,
  db: Database,
): ZQLiteContext {
  const sources = new Map<string, Source<PipelineEntity>>();
  const lsn = db.prepare(queries.getCommittedLsn).pluck().get() ?? '0/00000000';
  const columnsStatement = db.prepare(queries.getColumnNames).pluck();

  return {
    lsn,
    db,
    materialite,
    getSource: <T extends PipelineEntity>(name: string): Source<T> => {
      let existing = sources.get(name);
      if (existing) {
        return existing as Source<T>;
      }
      const columns = columnsStatement.all(name);
      existing = materialite.constructSource(
        internal => new TableSource(db, internal, name, columns),
      );
      sources.set(name, existing);
      return existing as Source<T>;
    },
    subscriptionAdded: () => emptyFunction,
  };
}
