/* eslint-disable @typescript-eslint/no-explicit-any */
import {assert} from 'shared/src/asserts.js';
import {AST, Ordering} from '../ast/ast.js';
import {BuilderDelegate, buildPipeline} from '../builder/builder.js';
import {ArrayView, Format} from '../ivm/array-view.js';
import {
  AddSelections,
  AddSubselect,
  DefaultQueryResultRow,
  GetFieldTypeNoNullOrUndefined,
  Operator,
  Query,
  QueryResultRow,
  SchemaToRow,
  Selector,
  Smash,
} from './query.js';
import {
  isFieldRelationship,
  isJunctionRelationship,
  Lazy,
  PullSchemaForRelationship,
  Schema,
} from './schema.js';
import {TypedView} from './typed-view.js';
import {Row} from '../ivm/data.js';
import {deepClone} from 'shared/src/deep-clone.js';
import {ReadonlyJSONValue} from 'shared/src/json.js';

export function newQuery<
  TSchema extends Schema,
  TReturn extends Array<QueryResultRow> = Array<DefaultQueryResultRow<TSchema>>,
>(delegate: QueryDelegate, schema: TSchema): Query<TSchema, TReturn> {
  return new QueryImpl(delegate, schema);
}

function newQueryWithAST<
  TSchema extends Schema,
  TReturn extends Array<QueryResultRow>,
  TAs extends string,
>(
  delegate: QueryDelegate,
  schema: TSchema,
  ast: AST,
  format: Format,
): Query<TSchema, TReturn, TAs> {
  return new QueryImpl(delegate, schema, ast, format);
}

export type CommitListener = () => void;
export interface QueryDelegate extends BuilderDelegate {
  addServerQuery(ast: AST): () => void;
  onTransactionCommit(cb: CommitListener): () => void;
}

class QueryImpl<
  TSchema extends Schema,
  TReturn extends Array<QueryResultRow> = Array<DefaultQueryResultRow<TSchema>>,
  TAs extends string = string,
> implements Query<TSchema, TReturn, TAs>
{
  readonly #ast: AST;
  readonly #delegate: QueryDelegate;
  readonly #schema: TSchema;
  readonly #format: Format;

  constructor(
    delegate: QueryDelegate,
    schema: TSchema,
    ast?: AST | undefined,
    format?: Format | undefined,
  ) {
    this.#ast = ast ?? {
      table: schema.tableName,
    };
    this.#delegate = delegate;
    this.#schema = schema;
    this.#format = format ?? ['multiple', {}];
  }

  get ast() {
    return this.#ast;
  }

  get format() {
    return this.#format;
  }

  select<TFields extends Selector<TSchema>[]>(
    ..._fields: TFields
  ): Query<TSchema, AddSelections<TSchema, TFields, TReturn>[], TAs> {
    // we return all columns for now so we ignore the selection set and only use it for type inference
    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      this.#ast,
      this.#format,
    );
  }

  materialize(): TypedView<Smash<TReturn>> {
    const ast = this.#completeAst();
    const removeServerQuery = this.#delegate.addServerQuery(ast);
    const view = new ArrayView(
      buildPipeline(ast, this.#delegate),
      this.#format,
    );
    const removeCommitObserver = this.#delegate.onTransactionCommit(() => {
      view.flush();
    });
    view.onDestroy = () => {
      removeCommitObserver();
      removeServerQuery();
    };
    return view as unknown as TypedView<Smash<TReturn>>;
  }

  preload(): {
    cleanup: () => void;
  } {
    const ast = this.#completeAst();
    const unsub = this.#delegate.addServerQuery(ast);
    return {
      cleanup: unsub,
    };
  }

  #completeAst(): AST {
    const finalOrderBy = addPrimaryKeys(this.#schema, this.#ast.orderBy);
    if (this.#ast.start) {
      const {row} = this.#ast.start;
      const narrowedRow: Row = {};
      for (const [field] of finalOrderBy) {
        narrowedRow[field] = row[field];
      }
      return {
        ...this.#ast,
        start: {
          ...this.#ast.start,
          row: narrowedRow,
        },
        orderBy: finalOrderBy,
      };
    }
    return {
      ...this.#ast,
      orderBy: addPrimaryKeys(this.#schema, this.#ast.orderBy),
    };
  }

  related<TRelationship extends keyof TSchema['relationships']>(
    relationship: TRelationship,
  ): Query<
    TSchema,
    Array<
      AddSubselect<
        Query<
          PullSchemaForRelationship<TSchema, TRelationship>,
          Array<
            DefaultQueryResultRow<
              PullSchemaForRelationship<TSchema, TRelationship>
            >
          >,
          TRelationship & string
        >,
        TReturn
      >
    >,
    TAs
  >;
  related<
    TRelationship extends keyof TSchema['relationships'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TSub extends Query<any, any, any>,
  >(
    relationship: TRelationship,
    cb: (
      query: Query<
        PullSchemaForRelationship<TSchema, TRelationship>,
        Array<
          DefaultQueryResultRow<
            PullSchemaForRelationship<TSchema, TRelationship>
          >
        >,
        TRelationship & string
      >,
    ) => TSub = q => q as any,
  ): Query<TSchema, Array<AddSubselect<TSub, TReturn>>, TAs> {
    const related = this.#schema.relationships?.[relationship as string];
    assert(related, 'Invalid relationship');
    const related1 = related;
    const related2 = related;
    if (isFieldRelationship(related1)) {
      const destSchema = resolveSchema(related1.dest.schema);

      const sq = cb(
        newQueryWithAST(
          this.#delegate,
          destSchema,
          {
            table: destSchema.tableName,
            alias: relationship as string,
          },
          ['multiple', {}],
        ),
      );

      const destFormat = deepClone(this.#format as ReadonlyJSONValue) as Format;
      destFormat[1]![relationship as string] = sq.format;

      return newQueryWithAST(
        this.#delegate,
        this.#schema,
        {
          ...this.#ast,
          related: [
            ...(this.#ast.related ?? []),
            {
              correlation: {
                parentField: related1.source,
                childField: related1.dest.field,
                op: '=',
              },
              subquery: addPrimaryKeysToAst(destSchema, sq.ast),
            },
          ],
        },
        destFormat,
      );
    }

    if (isJunctionRelationship(related2)) {
      const destSchema = resolveSchema(related2.dest.schema);
      const junctionSchema = resolveSchema(related2.junction.schema);

      const sq = cb(
        newQueryWithAST(
          this.#delegate,
          destSchema,
          {
            table: destSchema.tableName,
            alias: relationship as string,
          },
          ['multiple', {}],
        ),
      );

      const destFormat = deepClone(this.#format as ReadonlyJSONValue) as Format;
      destFormat[1]![relationship as string] = sq.format;

      return newQueryWithAST(
        this.#delegate,
        this.#schema,
        {
          ...this.#ast,
          related: [
            ...(this.#ast.related ?? []),
            {
              correlation: {
                parentField: related2.source,
                childField: related2.junction.sourceField,
                op: '=',
              },
              subquery: {
                table: junctionSchema.tableName,
                alias: relationship as string,
                orderBy: addPrimaryKeys(junctionSchema, undefined),
                related: [
                  {
                    correlation: {
                      parentField: related2.junction.destField,
                      childField: related2.dest.field,
                      op: '=',
                    },
                    hidden: true,
                    subquery: addPrimaryKeysToAst(destSchema, sq.ast),
                  },
                ],
              },
            },
          ],
        },
        destFormat,
      );
    }
    throw new Error(`Invalid relationship ${relationship as string}`);
  }

  where<TSelector extends Selector<TSchema>>(
    field: TSelector,
    op: Operator,
    value: GetFieldTypeNoNullOrUndefined<TSchema, TSelector, Operator>,
  ): Query<TSchema, TReturn, TAs> {
    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      {
        ...this.#ast,
        where: [
          ...(this.#ast.where ?? []),
          {
            type: 'simple',
            op,
            field: field as string,
            value,
          },
        ],
      },
      this.#format,
    );
  }

  as<TAs2 extends string>(alias: TAs2): Query<TSchema, TReturn, TAs2> {
    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      {
        ...this.#ast,
        alias,
      },
      this.#format,
    );
  }

  start(
    row: Partial<SchemaToRow<TSchema>>,
    opts?: {inclusive: boolean} | undefined,
  ): Query<TSchema, TReturn, TAs> {
    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      {
        ...this.#ast,
        start: {
          row,
          exclusive: !opts?.inclusive,
        },
      },
      this.#format,
    );
  }

  limit(limit: number): Query<TSchema, TReturn, TAs> {
    if (limit < 0) {
      throw new Error('Limit must be non-negative');
    }
    if ((limit | 0) !== limit) {
      throw new Error('Limit must be an integer');
    }

    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      {
        ...this.#ast,
        limit,
      },
      this.#format,
    );
  }

  orderBy<TSelector extends keyof TSchema['columns']>(
    field: TSelector,
    direction: 'asc' | 'desc',
  ): Query<TSchema, TReturn, TAs> {
    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      {
        ...this.#ast,
        orderBy: [...(this.#ast.orderBy ?? []), [field as string, direction]],
      },
      this.#format,
    );
  }
}

function resolveSchema(maybeSchema: Schema | Lazy<Schema>): Schema {
  if (typeof maybeSchema === 'function') {
    return maybeSchema();
  }

  return maybeSchema;
}

function addPrimaryKeys(
  schema: Schema,
  orderBy: Ordering | undefined,
): Ordering {
  orderBy = orderBy ?? [];
  const {primaryKey} = schema;
  const primaryKeysToAdd = new Set(primaryKey);

  for (const [field] of orderBy) {
    primaryKeysToAdd.delete(field);
  }

  if (primaryKeysToAdd.size === 0) {
    return orderBy;
  }

  return [
    ...orderBy,
    ...[...primaryKeysToAdd].map(key => [key, 'asc'] as [string, 'asc']),
  ];
}

function addPrimaryKeysToAst(schema: Schema, ast: AST): AST {
  return {
    ...ast,
    orderBy: addPrimaryKeys(schema, ast.orderBy),
  };
}
