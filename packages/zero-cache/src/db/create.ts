import {id, idList} from '../types/sql.js';
import type {
  ColumnSpec,
  LiteIndexSpec,
  LiteTableSpec,
  TableSpec,
} from './specs.js';

export function columnDef(spec: ColumnSpec) {
  const parts = [spec.dataType];
  if (spec.characterMaximumLength) {
    parts.push(`(${spec.characterMaximumLength})`);
  }
  if (spec.notNull) {
    parts.push(' NOT NULL');
  }
  if (spec.dflt) {
    parts.push(` DEFAULT ${spec.dflt}`);
  }
  return parts.join('');
}

function isLiteTableSpec(
  spec: TableSpec | LiteTableSpec,
): spec is LiteTableSpec {
  return !('schema' in spec);
}

/**
 * Constructs a `CREATE TABLE` statement for a {@link TableSpec}.
 */
export function createTableStatement(spec: TableSpec | LiteTableSpec): string {
  // Note: DEFAULT expressions are ignored for CREATE TABLE statements,
  // as in that case, row values always come from the replication stream.
  //
  // Note: NOT NULL constraints are also ignored for SQLite (replica) tables.
  // 1. They are enforced by the replication stream.
  // 2. We need nullability for columns with defaults to support
  // write permissions on the "proposed mutation" state. Proposed
  // mutations are written to SQLite in a `BEGIN CONCURRENT` transaction in mutagen.
  // Permission policies are run against that state (to get their ruling) then the
  // transaction is rolled back.
  const defs = Object.entries(spec.columns)
    .sort(([_a, {pos: a}], [_b, {pos: b}]) => a - b)
    .map(
      ([name, columnSpec]) =>
        `${id(name)} ${columnDef({
          ...columnSpec,
          notNull: isLiteTableSpec(spec) ? null : columnSpec.notNull,
          dflt: null,
        })}`,
    );
  if (spec.primaryKey) {
    defs.push(`PRIMARY KEY (${idList(spec.primaryKey)})`);
  }

  const createStmt =
    'schema' in spec
      ? `CREATE TABLE ${id(spec.schema)}.${id(spec.name)} (`
      : `CREATE TABLE ${id(spec.name)} (`;
  return [createStmt, defs.join(',\n'), ');'].join('\n');
}

export function createIndexStatement(index: LiteIndexSpec): string {
  const columns = Object.entries(index.columns)
    .map(([name, dir]) => `${id(name)} ${dir}`)
    .join(',');
  const unique = index.unique ? 'UNIQUE' : '';
  return `CREATE ${unique} INDEX ${id(index.name)} ON ${id(
    index.tableName,
  )} (${columns});`;
}
