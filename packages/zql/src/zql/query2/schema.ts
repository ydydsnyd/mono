import {ValueType} from '../ivm2/schema.js';

/**
 * `related` calls need to know what the available relationships are.
 * The `schema` type encodes this information.
 */
export type SchemaValue = {
  type: ValueType;
  optional?: boolean;
};
export type Schema = {
  readonly table: string;
  primaryKey: readonly [keyof Schema['fields'], ...(keyof Schema['fields'])[]];
  readonly fields: Record<string, SchemaValue>;
  readonly relationships?: {
    [key: string]:
      | FieldRelationship<Schema, Schema>
      | JunctionRelationship<Schema, Schema, Schema>;
  };
};

/**
 * IVM operators take a slightly different form of `Schema`
 *
 * 1. `columns` don't encode optionality. They probably should.
 * 2. `relationships` does not encode the type of the relationship (junction vs field edge).
 * 3. `relationships` doesn't support recursive relationships
 * 4. IVM schema requires a `compareRows` function.
 * 5. Query schema requires a `table` field.
 *
 * 1, 2 and 3 can probably be made common between the two types.
 * 5 could be thrown into `IVM Schema` and ignored
 * 4 is fundamentally different but can be computed
 * from the other information allowing `IVMSchema` to be a subtype of `EntitySchema`.
 */
export function toInputArgs(schema: Schema) {
  const columns: Record<string, ValueType> = {};
  for (const [key, value] of Object.entries(schema.fields)) {
    columns[key] = value.type;
  }
  return {
    primaryKey: schema.primaryKey,
    columns,
    table: schema.table,
  };
}

/**
 * A schema might have a relationship to itself.
 * Given we cannot reference a variable in the same statement we initialize
 * the variable, we use a lazy function to get around this.
 */
export type Lazy<T> = () => T;

type Relationship =
  | FieldRelationship<Schema, Schema>
  | JunctionRelationship<Schema, Schema, Schema>;

/**
 * A relationship between two entities where
 * that relationship is defined via fields on both entities.
 */
type FieldRelationship<
  TSourceSchema extends Schema,
  TDestSchema extends Schema,
> = {
  source: keyof TSourceSchema['fields'];
  dest: {
    field: keyof TDestSchema['fields'];
    schema: TDestSchema | Lazy<TDestSchema>;
  };
};

/**
 * A relationship between two entities where
 * that relationship is defined via a junction table.
 */
type JunctionRelationship<
  TSourceSchema extends Schema,
  TJunctionSchema extends Schema,
  TDestSchema extends Schema,
> = {
  source: keyof TSourceSchema['fields'];
  junction: {
    sourceField: keyof TJunctionSchema['fields'];
    destField: keyof TJunctionSchema['fields'];
    schema: TDestSchema | Lazy<TJunctionSchema>;
  };
  dest: {
    field: keyof TDestSchema['fields'];
    schema: TDestSchema | Lazy<TJunctionSchema>;
  };
};

export function isFieldRelationship(
  relationship: Relationship,
): relationship is FieldRelationship<Schema, Schema> {
  return (
    (relationship as JunctionRelationship<Schema, Schema, Schema>).junction ===
    undefined
  );
}

export function isJunctionRelationship(
  relationship: Relationship,
): relationship is JunctionRelationship<Schema, Schema, Schema> {
  return !isFieldRelationship(relationship);
}

/**
 * Calling `related` on `Query` returns a new Query
 * since `related` moves through the relationship. This function takes
 * 1. A schema
 * 2. A relationship name
 * and returns the schema of the entity at the other end of the
 * relationship.
 */
export type PullSchemaForRelationship<
  TSchema extends Schema,
  TRelationship extends keyof TSchema['relationships'],
> = TSchema['relationships'][TRelationship] extends FieldRelationship<
  Schema,
  infer TSchema
>
  ? TSchema
  : TSchema['relationships'][TRelationship] extends JunctionRelationship<
      Schema,
      Schema,
      infer TSchema
    >
  ? TSchema
  : never;
