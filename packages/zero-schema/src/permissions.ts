import type {Query} from '../../zql/src/query/query.js';
import type {Schema} from './schema.js';
import type {TableSchema, TableSchemaToRow} from './table-schema.js';

export type Action = 'select' | 'insert' | 'update' | 'delete';

type InstanceAuthzRule<TAuthDataShape, TSchema extends TableSchema> = (
  authData: TAuthDataShape,
  row: TableSchemaToRow<TSchema>,
) => Query<TableSchema>;

export type Queries<TSchema extends Schema> = {
  [K in keyof TSchema['tables']]: Query<TSchema['tables'][K]>;
};

type StaticAuthzRule<TAuthDataShape> = (
  authData: TAuthDataShape,
) => Query<TableSchema>;

type StaticAssetAuthorization<TAuthDataShape> = {
  [K in Action]?: StaticAuthzRule<TAuthDataShape>[];
};

type InstanceAssetAuthorization<TAuthDataShape, TSchema extends TableSchema> = {
  [K in Action]?: InstanceAuthzRule<TAuthDataShape, TSchema>[];
};

export type AuthorizationConfig<TAuthDataShape, TSchema extends Schema> = {
  [K in keyof TSchema['tables']]?: {
    table?: StaticAssetAuthorization<TAuthDataShape>;
    column?: {
      [C in keyof TSchema['tables'][K]['columns']]?: StaticAssetAuthorization<TAuthDataShape>;
    };
    row?: InstanceAssetAuthorization<TAuthDataShape, TSchema['tables'][K]>;
    cell?: {
      [C in keyof TSchema['tables'][K]['columns']]?: InstanceAssetAuthorization<
        TAuthDataShape,
        TSchema['tables'][K]
      >;
    };
  };
};
