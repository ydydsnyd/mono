import type {AST} from '../../ast/ast.js';
import type {Query} from '../query.js';
import type {SchemaToRow, TableSchema} from '../schema.js';

export function table(name: string): TableDefiner<[]> {
  return new TableDefinerImpl({
    table: name,
  });
}

type ColumnsFromDefiners<TColumnDefiners extends ColumnDefiner<unknown>[]> = {};

interface TableDefiner<TColumns> {
  columns<ColumnDefiners extends ColumnDefiner<unknown>[]>(
    ...columns: ColumnDefiners
  ): TableDefiner<ColumnsFromDefiners<ColumnDefiners>>;
  primaryKey(...keys: string[]): TableDefiner<TColumns>;
  rowPermissions(
    cb: (definer: RowPermissionsDefiner) => RowPermissionsDefiner,
  ): TableDefiner<TColumns>;
  tablePermissions(
    cb: (definer: TablePermissionsDefiner) => TablePermissionsDefiner,
  ): TableDefiner<TColumns>;
}

type StaticPermissionRule<TAuthDataShape> = (
  authData: TAuthDataShape,
) => Query<TableSchema>;

type StaticAssetPermissions<TAuthDataShape> = {
  [K in Action]?: StaticPermissionRule<TAuthDataShape>[];
};

type InstancePermissionRule<TAuthDataShape, TSchema extends TableSchema> = (
  authData: TAuthDataShape,
  row: SchemaToRow<TSchema>,
) => Query<TableSchema>;

type InstanceAssetPermissions<TAuthDataShape, TSchema extends TableSchema> = {
  [K in Action]?: InstancePermissionRule<TAuthDataShape, TSchema>[];
};

interface RowPermissionsDefiner {
  select(policy: AST[]): RowPermissionsDefiner;
  insert(policy: AST[]): RowPermissionsDefiner;
  update(policy: AST[]): RowPermissionsDefiner;
  delete(policy: AST[]): RowPermissionsDefiner;
}

interface ColumnDefiner<TValueType> {
  readonly definition: ColumnDefinition;

  permissions(): ColumnDefiner<TValueType>;
  storage(): ColumnDefiner<TValueType>;
  optional(): ColumnDefiner<TValueType | undefined>;
}

type TableDefinition = {
  readonly table: string;
  readonly primaryKey?: readonly string[];
  readonly columns?: Readonly<Record<string, ColumnDefinition>>;
  readonly rowPermissions?: PermissionsDefinition;
  readonly tablePermissions?: PermissionsDefinition;
  readonly projections?: {
    readonly surface: 'auth' | 'client';
    readonly columns: readonly string[];
  }[];
};

type ColumnDefinition = {
  type: string;
  name: string;
  optional?: boolean;
  cellPermissions?: PermissionsDefinition;
  columnPermissions?: PermissionsDefinition;
};

type Action = 'select' | 'insert' | 'update' | 'delete';
type Policy = AST[];
type PermissionsDefinition = Record<Action, Policy>;

class TableDefinerImpl<TColumns> implements TableDefiner<TColumns> {
  readonly definition: TableDefinition;
  constructor(definition: TableDefinition) {
    this.definition = definition;
  }

  columns<ColumnDefiners extends ColumnDefiner<unknown>[]>(
    ...columns: ColumnDefiners
  ): TableDefiner<ColumnsFromDefiners<ColumnDefiners>> {
    return new TableDefinerImpl({
      ...this.definition,
      columns: Object.fromEntries(
        columns.map(column => [column.definition.name, column.definition]),
      ),
    });
  }

  primaryKey(...keys: string[]): TableDefiner<TColumns> {
    return new TableDefinerImpl({
      ...this.definition,
      primaryKey: keys,
    });
  }
}

abstract class ColumnDefinerBase<TValueType>
  implements ColumnDefiner<TValueType>
{
  readonly definition: ColumnDefinition;
  constructor(definition: ColumnDefinition) {
    this.definition = definition;
  }

  permissions(): ColumnDefiner<TValueType> {
    return this;
  }
  storage(): ColumnDefiner<TValueType> {
    return this;
  }
  optional(): ColumnDefiner<TValueType | undefined> {
    return this as ColumnDefiner<TValueType | undefined>;
  }
}

class StringColumnDefiner extends ColumnDefinerBase<string> {}

export const column = {
  string(): ColumnDefiner<string> {
    return new StringColumnDefiner();
  },
};
