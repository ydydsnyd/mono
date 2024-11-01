/* eslint-disable @typescript-eslint/no-explicit-any */
export function table<TName extends string>(name: TName) {
  return new TableSchemaConfig({name, columns: [], primaryKey: []});
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

type TableSchema = {
  name: string;
  columns: ColumnSchema[];
  primaryKey: ColumnSchema[][number]['name'][];
};

type StorageType = 'string' | 'number' | 'boolean' | 'null' | 'json';

type ColumnSchema = {
  name: string;
  storageType: StorageType;
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

  relationships() {}
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
