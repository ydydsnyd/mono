/* eslint-disable @typescript-eslint/no-explicit-any */
export function table<TName extends string>(name: TName) {
  return new TableBuilder({
    name,
    columns: [],
    primaryKey: [],
    relationships: [],
  });
}

export function string<TName extends string>(name: TName) {
  return new ColumnBuilder({name, storageType: 'string', optional: false});
}

export function number<TName extends string>(name: TName) {
  return new ColumnBuilder({name, storageType: 'number', optional: false});
}

export function boolean<TName extends string>(name: TName) {
  return new ColumnBuilder({name, storageType: 'boolean', optional: false});
}

export function json<TName extends string>(name: TName) {
  return new ColumnBuilder({name, storageType: 'json', optional: false});
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

  columns<TColumns extends ColumnBuilder<ColumnSchema>[]>(
    ...columns: TColumns
  ): TableBuilderWithColumns<
    Omit<TShape, 'columns'> & {
      columns: TColumns[number]['schema'][];
    }
  > {
    return new TableBuilderWithColumns({...this.#schema, columns}) as any;
  }
}

class TableBuilderWithColumns<TShape extends TableSchema> {
  readonly #schema: TShape;

  constructor(schema: TShape) {
    this.#schema = schema;
  }

  primaryKey<TPKColNames extends TShape['columns'][number]['name'][]>(
    ...pkColumnNames: TPKColNames
  ) {
    return new TableBuilderWithColumns({
      ...this.#schema,
      primaryKey: pkColumnNames,
    });
  }

  relationships<
    TRelationships extends (
      | FieldRelationshipConfig<RelationshipSchema>
      | JunctionRelationshipConfig<RelationshipSchema>
    )[],
  >(
    ...relationships: TRelationships
  ): TableBuilderWithColumns<
    Omit<TShape, 'relationships'> & {
      relationships: TRelationships[number]['schema'][];
    }
  > {
    return new TableBuilderWithColumns({
      ...this.#schema,
      relationships: relationships.map(r => r.schema),
    });
  }

  build() {
    return this.#schema;
  }
}

class ColumnBuilder<TShape extends ColumnSchema> {
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
