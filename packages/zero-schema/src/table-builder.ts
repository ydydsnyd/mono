import type {
  FieldRelationship,
  JunctionRelationship,
  SchemaValue,
  TableSchema,
} from './table-schema.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function table<TName extends string>(name: TName) {
  return new TableBuilder({
    tableName: name,
    columns: {},
    primaryKey: null as any,
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

export const column = {
  string,
  number,
  boolean,
  json,
};

type Lazy<T> = () => T;

class TableBuilder<TShape extends TableSchema> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  columns<TColumns extends Record<string, ColumnBuilder<SchemaValue>>>(
    columns: TColumns,
  ): TableBuilderWithColumns<{
    tableName: TShape['tableName'];
    columns: {[K in keyof TColumns]: TColumns[K]['schema']};
    primaryKey: TShape['primaryKey'];
    relationships: TShape['relationships'];
  }> {
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
      | FieldRelationshipBuilder<FieldRelationship>
      | JunctionRelationshipBuilder<JunctionRelationship>
    >,
  >(
    cb: (
      source: (
        field: keyof TShape['columns'] & string,
      ) => UndeterminedRelationshipBuilder<TShape>,
    ) => TRelationships,
  ): TableBuilderWithColumns<{
    tableName: TShape['tableName'];
    columns: TShape['columns'];
    primaryKey: TShape['primaryKey'];
    relationships: {[K in keyof TRelationships]: TRelationships[K]['schema']};
  }> {
    const relationshipSchemas = Object.fromEntries(
      Object.entries(cb(source)).map(([k, v]) => [k, v.schema]),
    ) as {[K in keyof TRelationships]: TRelationships[K]['schema']};

    return new TableBuilderWithColumns({
      ...this.#schema,
      relationships: relationshipSchemas,
    }) as any;
  }

  build() {
    return this.#schema;
  }
}

export function source<TShape extends TableSchema>(
  sourceField: keyof TShape['columns'] & string,
) {
  return new UndeterminedRelationshipBuilder(sourceField);
}

class UndeterminedRelationshipBuilder<TShape extends TableSchema> {
  readonly #sourceField;
  constructor(sourceField: keyof TShape['columns'] & string) {
    this.#sourceField = sourceField;
  }

  dest<TDestSchema extends TableSchema>(
    destSchema: TDestSchema | Lazy<TDestSchema>,
    destField: keyof TDestSchema['columns'] & string,
  ) {
    return new FieldRelationshipBuilder({
      source: this.#sourceField,
      dest: {
        field: destField,
        schema: destSchema,
      },
    });
  }

  junction<TJunctionSchema extends TableSchema>(
    junctionSchema: TJunctionSchema | Lazy<TJunctionSchema>,
    sourceField: keyof TJunctionSchema['columns'] & string,
    destField: keyof TJunctionSchema['columns'] & string,
  ) {
    return new JunctionRelationshipBuilder({
      source: this.#sourceField,
      dest: null as any,
      junction: {
        source: sourceField,
        dest: {
          field: destField,
          schema: junctionSchema,
        },
      },
    });
  }
}

class ColumnBuilder<TShape extends SchemaValue> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
  }

  optional(): ColumnBuilder<{
    type: TShape['type'];
    optional: true;
  }> {
    return new ColumnBuilder({
      ...this.#schema,
      optional: true,
    } as const);
  }

  get schema() {
    return this.#schema;
  }
}

class FieldRelationshipBuilder<TShape extends FieldRelationship> {
  readonly #schema: TShape;
  constructor(schema: TShape) {
    this.#schema = schema;
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

  dest<TDestSchema extends TableSchema>(
    destSchema: TDestSchema | Lazy<TDestSchema>,
    destField: keyof TDestSchema['columns'] & string,
  ): JunctionRelationshipBuilder<{
    source: TShape['source'];
    junction: TShape['junction'];
    dest: {
      field: typeof destField;
      schema: TDestSchema | Lazy<TDestSchema>;
    };
  }> {
    return new JunctionRelationshipBuilder({
      ...this.#schema,
      dest: {
        field: destField,
        schema: destSchema,
      },
    } as const);
  }

  get schema() {
    return this.#schema;
  }
}
