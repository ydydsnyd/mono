import type {SchemaValue} from '../../../zero-schema/src/table-schema.js';

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

export function fieldRelationship<
  TName extends string,
  TSourceSchema extends TableSchema,
>(string: TName) {
  return (schema: TSourceSchema) =>
    new FieldRelationshipBuilder({
      name: string,
      sourceSchema: schema,
    });
}

export function junctionRelationship<
  TName extends string,
  TSourceSchema extends TableSchema,
>(string: TName) {
  return (schema: TSourceSchema) =>
    new JunctionRelationshipBuilder({
      name: string,
      sourceSchema: schema,
    });
}

type Lazy<T> = () => T;

type TableSchema = {
  name: string;
  columns: Record<string, SchemaValue>;
  primaryKey: ColumnSchema[][number]['name'][];
  relationships: Record<string, RelationshipSchema>;
};

type StorageType = 'string' | 'number' | 'boolean' | 'null' | 'json';

type ColumnSchema = {
  name: string;
  storageType: StorageType;
  optional: boolean;
};

type RelationshipSchema = {
  name: string;
  sourceSchema: TableSchema;
  sourceField?: string | undefined;
  junction?:
    | {
        junctionSchema: TableSchema;
        sourceField: string;
        destField: string;
      }
    | undefined;
  dest?: {
    field: string;
    schema: TableSchema | Lazy<TableSchema>;
  };
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
      | FieldRelationshipBuilder<RelationshipSchema>
      | JunctionRelationshipBuilder<RelationshipSchema>
    >,
  >(
    relationships: TRelationships,
  ): TableBuilderWithColumns<
    Omit<TShape, 'relationships'> & {
      relationships: {[K in keyof TRelationships]: TRelationships[K]['schema']};
    }
  > {
    const relationshipSchemas = Object.fromEntries(
      Object.entries(relationships).map(([k, v]) => [k, v.schema]),
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

class FieldRelationshipBuilder<TShape extends RelationshipSchema> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  get schema() {
    return this.#schema;
  }
}

class JunctionRelationshipBuilder<TShape extends RelationshipSchema> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  get schema() {
    return this.#schema;
  }
}
