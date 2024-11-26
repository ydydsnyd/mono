import type {
  FieldRelationship,
  JunctionRelationship,
  Relationship,
  SchemaValue,
} from '../../../zero-schema/src/table-schema.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function table<TName extends string>(name: TName) {
  return new TableBuilder({
    name,
    columns: {},
    primaryKey: [],
    relationships: {},
  });
}

export function string() {
  return new ColumnBuilder({type: 'string', optional: false});
}

export function number() {
  return new ColumnBuilder({type: 'number', optional: false});
}

export function boolean() {
  return new ColumnBuilder({type: 'boolean', optional: false});
}

export function json() {
  return new ColumnBuilder({type: 'json', optional: false});
}

type Lazy<T> = () => T;

type TableSchema = {
  name: string;
  columns: Record<string, SchemaValue>;
  primaryKey: ColumnSchema[][number]['name'][];
  relationships: Record<string, Relationship>;
};

type StorageType = 'string' | 'number' | 'boolean' | 'null' | 'json';

type ColumnSchema = {
  name: string;
  storageType: StorageType;
  optional: boolean;
};

class TableBuilder<TShape extends TableSchema> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  columns<TColumns extends Record<string, ColumnBuilder<SchemaValue>>>(
    columns: TColumns,
  ): TableBuilderWithColumns<
    Omit<TShape, 'columns'> & {
      columns: {[K in keyof TColumns]: TColumns[K]['schema']};
    }
  > {
    const columnSchemas = Object.fromEntries(
      Object.entries(columns).map(([k, v]) => [k, v.schema]),
    ) as {[K in keyof TColumns]: TColumns[K]['schema']};
    return new TableBuilderWithColumns({
      ...this.#schema,
      columns: columnSchemas,
    }) as any;
  }
}

class TableBuilderWithColumns<TShape extends TableSchema> {
  readonly #schema: TShape;

  constructor(schema: TShape) {
    this.#schema = schema;
  }

  primaryKey<TPKColNames extends (keyof TShape['columns'])[]>(
    ...pkColumnNames: TPKColNames
  ) {
    return new TableBuilderWithColumns({
      ...this.#schema,
      primaryKey: pkColumnNames,
    });
  }

  relationships<
    TRelationships extends Record<
      string,
      | FieldRelationshipBuilder<TShape, FieldRelationship>
      | JunctionRelationshipBuilder<JunctionRelationship>
    >,
  >(
    cb: (builder: RelationshipBuilder<TShape>) => TRelationships,
  ): TableBuilderWithColumns<
    Omit<TShape, 'relationships'> & {
      relationships: {[K in keyof TRelationships]: TRelationships[K]['schema']};
    }
  > {
    const relationshipSchemas = Object.fromEntries(
      Object.entries(cb(new RelationshipBuilderImpl<TShape>())).map(
        ([k, v]) => [k, v.schema],
      ),
    ) as {[K in keyof TRelationships]: TRelationships[K]['schema']};

    return new TableBuilderWithColumns({
      ...this.#schema,
      relationships: relationshipSchemas,
    });
  }

  build() {
    return this.#schema;
  }
}

interface RelationshipBuilder<TShape extends TableSchema> {
  field(
    source: keyof TShape['columns'] & string,
  ): FieldRelationshipBuilder<TShape, FieldRelationship>;
  // junctionRelationship<TSourceSchema extends TableSchema>(): JunctionRelationshipBuilder<JunctionRelationship>;
}

class RelationshipBuilderImpl<TShape extends TableSchema>
  implements RelationshipBuilder<TShape>
{
  field = <TSourceSchema extends TableSchema>(
    source: keyof TSourceSchema['columns'] & string,
  ): FieldRelationshipBuilder<TShape, FieldRelationship> =>
    new FieldRelationshipBuilder({
      source,
      dest: null as any,
    });
}

class ColumnBuilder<TShape extends SchemaValue> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  optional() {
    return new ColumnBuilder({...this.#schema, optional: true});
  }

  get schema() {
    return this.#schema;
  }
}

class FieldRelationshipBuilder<
  TSource extends TableSchema,
  TShape extends FieldRelationship,
> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  source<TColName extends keyof TSource['columns']>(colName: TColName) {
    return new FieldRelationshipBuilder({
      ...this.#schema,
      source: colName,
    });
  }

  dest<TDestSchema extends TableSchema>(
    destSchema: TDestSchema | Lazy<TDestSchema>,
    destField: keyof TDestSchema['columns'],
  ) {
    return new FieldRelationshipBuilder({
      ...this.#schema,
      dest: {
        field: destField,
        schema: destSchema,
      },
    });
  }

  get schema() {
    return this.#schema;
  }
}

class JunctionRelationshipBuilder<TShape extends JunctionRelationship> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  get schema() {
    return this.#schema;
  }
}
