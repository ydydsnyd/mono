import type {AST} from 'zql/dist/zql/ast/ast.js';
import type {Format} from 'zql/dist/zql/ivm/array-view.js';
import {AbstractQuery} from 'zql/dist/zql/query/query-impl.js';
import type {
  DefaultQueryResultRow,
  Query,
  QueryType,
  Smash,
} from 'zql/dist/zql/query/query.js';
import type {TableSchema} from 'zql/dist/zql/query/schema.js';
import type {TypedView} from 'zql/dist/zql/query/typed-view.js';

export class ConfigQuery<
  TTableSchema extends TableSchema,
  TReturn extends QueryType = DefaultQueryResultRow<TTableSchema>,
> extends AbstractQuery<TTableSchema, TReturn> {
  constructor(
    schema: TTableSchema,
    ast?: AST | undefined,
    format?: Format | undefined,
  ) {
    super(schema, ast, format);
  }

  get ast() {
    return this._completeAst();
  }

  protected _newQuery<TSchema extends TableSchema, TReturn extends QueryType>(
    schema: TSchema,
    ast: AST,
    format: Format | undefined,
  ): Query<TSchema, TReturn> {
    return new ConfigQuery(schema, ast, format);
  }

  materialize(): TypedView<Smash<TReturn>> {
    throw new Error('ConfigQuery cannot be materialized');
  }

  preload(): {
    cleanup: () => void;
  } {
    throw new Error('ConfigQuery cannot be preloaded');
  }
}
