import * as v from '../../../shared/src/valita.js';

export function table(name: string) {
  return new TableSchemaConfig({name, columns: [], primaryKey: []});
}

type TableSchema<
  TName extends string,
  TColumns extends ColumnSchema<string>[] = ColumnSchema<string>[],
> = {
  name: TName;
  columns: TColumns;
  primaryKey: TColumns[number]['name'][];
};

type ColumnSchema<TName extends string> = {
  name: TName;
  type: v.Type;
};

class TableSchemaConfig<TName extends string> {
  readonly #schema: TableSchema<TName>;
  constructor(schema: TableSchema<TName>) {
    this.#schema = schema;
  }

  columns<TColumns extends ColumnSchema<string>[]>(
    ...columns: TColumns
  ): TableSchemaConfigWithColumns<TName, TColumns> {
    return new TableSchemaConfigWithColumns({...this.#schema, columns});
  }
}

class TableSchemaConfigWithColumns<
  TName extends string,
  TColumns extends ColumnSchema<string>[],
> {
  readonly #schema: TableSchema<TName, TColumns>;

  constructor(schema: TableSchema<TName, TColumns>) {
    this.#schema = schema;
  }

  primaryKey<TPKColNames extends TColumns[number]['name'][]>(
    ...pkColumnNames: TPKColNames
  ) {
    return new TableSchemaConfigWithColumns({
      ...this.#schema,
      primaryKey: pkColumnNames,
    });
  }

  relationships() {}
}
