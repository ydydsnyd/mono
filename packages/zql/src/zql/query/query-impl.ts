/* eslint-disable @typescript-eslint/no-explicit-any */
import {assert} from 'shared/src/asserts.js';
import {AST, Ordering} from '../ast/ast.js';
import {BuilderDelegate, buildPipeline} from '../builder/builder.js';
import {ArrayView} from '../ivm/array-view.js';
import {
  AddSelections,
  DefaultQueryResultRow,
  GetWhereFieldType,
  Operator,
  Query,
  QueryResultRow,
  FieldReference,
  SchemaToRow,
  Selector,
  Smash,
  RowReference,
  AddSubselect,
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

export function newQuery<
  TSchema extends Schema,
  TReturn extends Array<QueryResultRow> = Array<DefaultQueryResultRow<TSchema>>,
>(delegate: QueryDelegate, schema: TSchema): Query<TSchema, TReturn> {
  return new QueryImpl(delegate, schema);
}

function newQueryWithAST<
  TSchema extends Schema,
  TReturn extends Array<QueryResultRow>,
>(
  delegate: QueryDelegate,
  schema: TSchema,
  ast: AST,
  correlation?: Correlation | undefined,
): Query<TSchema, TReturn> {
  return new QueryImpl(delegate, schema, ast, correlation);
}

export type CommitListener = () => void;
export interface QueryDelegate extends BuilderDelegate {
  addServerQuery(ast: AST): () => void;
  onTransactionCommit(cb: CommitListener): () => void;
}

type Correlation = {
  parentField: FieldReference<unknown>;
  childField: string;
};

class QueryImpl<
  TSchema extends Schema,
  TReturn extends Array<QueryResultRow> = Array<DefaultQueryResultRow<TSchema>>,
> implements Query<TSchema, TReturn>
{
  readonly #ast: AST;
  readonly #delegate: QueryDelegate;
  readonly #schema: TSchema;

  #correlation: Correlation | undefined = undefined;

  constructor(
    delegate: QueryDelegate,
    schema: TSchema,
    ast?: AST | undefined,
    correlation?: Correlation | undefined,
  ) {
    this.#ast = ast ?? {
      table: schema.tableName,
    };
    this.#delegate = delegate;
    this.#schema = schema;
    this.#correlation = correlation;
  }

  get ast() {
    return this.#ast;
  }

  get correlation() {
    return this.#correlation;
  }

  get schema() {
    return this.#schema;
  }

  select<TFields extends Selector<TSchema>[]>(
    ..._fields: TFields
  ): Query<TSchema, AddSelections<TSchema, TFields, TReturn>[]> {
    // we return all columns for now so we ignore the selection set and only use it for type inference
    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      this.#ast,
      this.#correlation,
    );
  }

  materialize(): TypedView<Smash<TReturn>> {
    const ast = this.#completeAst();
    const removeServerQuery = this.#delegate.addServerQuery(ast);
    const view = new ArrayView(buildPipeline(ast, this.#delegate));
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
          >
        >,
        TReturn,
        TRelationship & string
      >
    >
  >;
  related<
    TRelationship extends keyof TSchema['relationships'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TSub extends Query<any, any>,
  >(
    relationship: TRelationship,
    cb: (
      query: Query<
        PullSchemaForRelationship<TSchema, TRelationship>,
        Array<
          DefaultQueryResultRow<
            PullSchemaForRelationship<TSchema, TRelationship>
          >
        >
      >,
    ) => TSub = q => q as any,
  ) {
    const related = this.#schema.relationships?.[relationship as string];
    assert(related, 'Invalid relationship');
    const related1 = related;
    const related2 = related;
    if (isFieldRelationship(related1)) {
      // TODO: Why is 'as' needed here?
      const destSchema = resolveSchema(
        related1.dest.schema,
      ) as PullSchemaForRelationship<TSchema, TRelationship>;
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
              subquery: addPrimaryKeysToAst(
                destSchema,
                cb(
                  newQueryWithAST(this.#delegate, destSchema, {
                    table: destSchema.tableName,
                    alias: relationship as string,
                  }),
                ).ast,
              ),
            },
          ],
        },
        this.#correlation,
      );
    }

    if (isJunctionRelationship(related2)) {
      const destSchema = resolveSchema(
        related2.dest.schema,
      ) as PullSchemaForRelationship<TSchema, TRelationship>;
      const junctionSchema = resolveSchema(related2.junction.schema);
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
                    subquery: addPrimaryKeysToAst(
                      destSchema,
                      cb(
                        newQueryWithAST(
                          this.#delegate,
                          destSchema,
                          {
                            table: destSchema.tableName,
                            alias: relationship as string,
                          },
                          undefined,
                        ),
                      ).ast,
                    ),
                  },
                ],
              },
            },
          ],
        },
        this.#correlation,
      );
    }
    throw new Error(`Invalid relationship ${relationship as string}`);
  }

  sub<
    TRelationship extends string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TSub extends Query<any, any>,
  >(
    name: TRelationship,
    cb: (parent: RowReference<TSchema>) => TSub,
  ): Query<TSchema, Array<AddSubselect<TSub, TReturn, TRelationship>>> {
    const rowReference = Object.fromEntries(
      Object.keys(this.#schema.columns).map(k => [
        k,
        new FieldReference(this, k),
      ]),
    );

    const sq = cb(
      rowReference as RowReference<TSchema>,
    ) as unknown as QueryImpl<any, any>;

    if (sq.correlation === undefined) {
      throw new Error(
        "subqueries must include a correlation with parent query by using `where('field', '=', parentQuery.ref('field'))`",
      );
    }

    if (sq.correlation.parentField.query !== this) {
      throw new Error(
        'Invalid reference in subquery. Subqueries can only reference fields from immediate parent query.',
      );
    }

    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      {
        ...this.#ast,
        related: [
          ...(this.#ast.related ?? []),
          {
            correlation: {
              parentField: sq.correlation.parentField.column,
              childField: sq.correlation.childField,
              op: '=',
            },
            subquery: addPrimaryKeysToAst(sq.schema, {
              ...sq.ast,
              alias: name,
            }),
          },
        ],
      },
      this.#correlation,
    );
  }

  where<TSelector extends Selector<TSchema>>(
    field: TSelector,
    op: Operator,
    value: GetWhereFieldType<TSchema, TSelector, Operator>,
  ): Query<TSchema, TReturn> {
    if (value instanceof FieldReference) {
      if (this.#correlation) {
        throw new Error('Subqueries only support one reference');
      }
      if (op !== '=') {
        throw new Error(
          'Only equality is supported for subqueries correlations',
        );
      }
      this.#correlation = {
        parentField: value,
        childField: field as string,
      };
      return this;
    }

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
      this.#correlation,
    );
  }

  start(
    row: Partial<SchemaToRow<TSchema>>,
    opts?: {inclusive: boolean} | undefined,
  ): Query<TSchema, TReturn> {
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
      this.#correlation,
    );
  }

  limit(limit: number): Query<TSchema, TReturn> {
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
      this.#correlation,
    );
  }

  orderBy<TSelector extends keyof TSchema['columns']>(
    field: TSelector,
    direction: 'asc' | 'desc',
  ): Query<TSchema, TReturn> {
    return newQueryWithAST(
      this.#delegate,
      this.#schema,
      {
        ...this.#ast,
        orderBy: [...(this.#ast.orderBy ?? []), [field as string, direction]],
      },
      this.#correlation,
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
