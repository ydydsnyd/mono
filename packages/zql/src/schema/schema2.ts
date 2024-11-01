/* eslint-disable @typescript-eslint/no-explicit-any */
export function table<TName extends string>(name: TName) {
  return new TableSchemaConfig({
    name,
    columns: [],
    primaryKey: [],
    relationships: [],
  });
}

export function string<TName extends string>(name: TName) {
  return new ColumnConfig({name, storageType: 'string'});
}

export function number<TName extends string>(name: TName) {
  return new ColumnConfig({name, storageType: 'number'});
}

export function boolean<TName extends string>(name: TName) {
  return new ColumnConfig({name, storageType: 'boolean'});
}

export function json<TName extends string>(name: TName) {
  return new ColumnConfig({name, storageType: 'json'});
}

export function fieldRelationship<
  TName extends string,
  TSourceSchema extends TableSchema,
>(string: TName) {
  return (schema: TSourceSchema) =>
    new FieldRelationshipConfig({
      name: string,
      sourceSchema: schema,
    });
}

export function junctionRelationship<
  TName extends string,
  TSourceSchema extends TableSchema,
>(string: TName) {
  return (schema: TSourceSchema) =>
    new JunctionRelationshipConfig({
      name: string,
      sourceSchema: schema,
    });
}

type Lazy<T> = () => T;

type TableSchema = {
  name: string;
  columns: ColumnSchema[];
  primaryKey: ColumnSchema[][number]['name'][];
  relationships: RelationshipSchema[];
};

type StorageType = 'string' | 'number' | 'boolean' | 'null' | 'json';

type ColumnSchema = {
  name: string;
  storageType: StorageType;
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

class TableSchemaConfig<TShape extends TableSchema> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  columns<TColumns extends ColumnConfig<ColumnSchema>[]>(
    ...columns: TColumns
  ): TableSchemaConfigWithColumns<
    Omit<TShape, 'columns'> & {
      columns: TColumns[number]['schema'][];
    }
  > {
    return new TableSchemaConfigWithColumns({...this.#schema, columns}) as any;
  }
}

class TableSchemaConfigWithColumns<TShape extends TableSchema> {
  readonly #schema: TShape;

  constructor(schema: TShape) {
    this.#schema = schema;
  }

  primaryKey<TPKColNames extends TShape['columns'][number]['name'][]>(
    ...pkColumnNames: TPKColNames
  ) {
    return new TableSchemaConfigWithColumns({
      ...this.#schema,
      primaryKey: pkColumnNames,
    });
  }

  relationships<
    TRelationships extends (
      | FieldRelationshipConfig<RelationshipSchema>
      | JunctionRelationshipConfig<RelationshipSchema>
    )[],
  >(...relationships: TRelationships) {
    return new TableSchemaConfigWithColumns({
      ...this.#schema,
      relationships: relationships.map(r => r.schema),
    });
  }
}

class ColumnConfig<TShape extends ColumnSchema> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  get schema() {
    return this.#schema;
  }
}

class FieldRelationshipConfig<TShape extends RelationshipSchema> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  get schema() {
    return this.#schema;
  }
}

class JunctionRelationshipConfig<TShape extends RelationshipSchema> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  get schema() {
    return this.#schema;
  }
}
