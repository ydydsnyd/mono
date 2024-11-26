import type {Relationship, SchemaValue, TableSchema} from './table-schema.js';

type ColumnBuilders = Record<string, ColumnBuilder>;
type Relationships = Record<string, Relationship>;
type ColumnDefinition = {name: string} & SchemaValue;

type ColumnBuildersToColumnDefinitions<TColumns extends ColumnBuilders> = {
  [K in keyof TColumns]: ColumnDefinition;
};

type PrimaryKey = [ColumnDefinition, ...ColumnDefinition[]];

export function table<const TColumns extends ColumnBuilders>(
  name: string,
  columns: TColumns,
  cb: (columns: ColumnBuildersToColumnDefinitions<TColumns>) => {
    primaryKey: PrimaryKey;
    relationships: Relationships;
  },
): TableSchema {
  const builtColumns = Object.fromEntries(
    Object.entries(columns).map(([k, v]) => [k, v.build()]),
  ) as ColumnBuildersToColumnDefinitions<TColumns>;
  const {primaryKey, relationships} = cb(builtColumns);
  return {
    tableName: name,
    columns: builtColumns,
    primaryKey: primaryKey.map(c => c.name) as [string, ...string[]],
    relationships,
  };
}

class ColumnBuilder {
  readonly #def: SchemaValue;

  constructor(def: SchemaValue) {
    this.#def = def;
  }

  optional(): ColumnBuilder {
    return new ColumnBuilder({...this.#def, optional: true});
  }

  build(): SchemaValue {
    return this.#def;
  }
}

export const column = {
  string() {
    return new ColumnBuilder({type: 'string'});
  },
  number() {
    return new ColumnBuilder({type: 'number'});
  },
  boolean() {
    return new ColumnBuilder({type: 'boolean'});
  },
  json() {
    return new ColumnBuilder({type: 'json'});
  },
};
