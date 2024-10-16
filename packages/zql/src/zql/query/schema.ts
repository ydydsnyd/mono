import type {SchemaValue, TableSchemaBase} from '../ivm/schema.js';

export type TableSchema = TableSchemaBase & {
  readonly relationships: {readonly [name: string]: Relationship};
};

/**
 * Given a schema value, return the TypeScript type.
 *
 * This allows us to create the correct return type for a
 * query that has a selection.
 */
export type SchemaValueToTSType<T extends SchemaValue> =
  | (T extends {type: 'string'}
      ? string
      : T extends {type: 'number'}
      ? number
      : T extends {type: 'boolean'}
      ? boolean
      : T extends {type: 'null'}
      ? null
      : never)
  | (T extends {optional: true} ? undefined : never);

export type SchemaToRow<T extends TableSchema> = {
  [K in keyof T['columns']]: SchemaValueToTSType<T['columns'][K]>;
};

/**
 * A schema might have a relationship to itself.
 * Given we cannot reference a variable in the same statement we initialize
 * the variable, we use a function to get around this.
 */
export type Lazy<T> = () => T;

export type Relationship =
  | FieldRelationship<TableSchema, TableSchema>
  | JunctionRelationship<TableSchema, TableSchema, TableSchema>;

/**
 * A relationship between two entities where
 * that relationship is defined via fields on both entities.
 */
export type FieldRelationship<
  TSourceSchema extends TableSchema,
  TDestSchema extends TableSchema,
> = {
  source: keyof TSourceSchema['columns'];
  dest: {
    field: keyof TDestSchema['columns'];
    schema: TDestSchema | Lazy<TDestSchema>;
  };
};

/**
 * A relationship between two entities where
 * that relationship is defined via a junction table.
 */
export type JunctionRelationship<
  TSourceSchema extends TableSchema,
  TJunctionSchema extends TableSchema,
  TDestSchema extends TableSchema,
> = {
  source: keyof TSourceSchema['columns'];
  junction: {
    sourceField: keyof TJunctionSchema['columns'];
    destField: keyof TJunctionSchema['columns'];
    schema: TDestSchema | Lazy<TJunctionSchema>;
  };
  dest: {
    field: keyof TDestSchema['columns'];
    schema: TDestSchema | Lazy<TJunctionSchema>;
  };
};

export function isFieldRelationship(
  relationship: Relationship,
): relationship is FieldRelationship<TableSchema, TableSchema> {
  return (
    (
      relationship as JunctionRelationship<
        TableSchema,
        TableSchema,
        TableSchema
      >
    ).junction === undefined
  );
}

export function isJunctionRelationship(
  relationship: Relationship,
): relationship is JunctionRelationship<TableSchema, TableSchema, TableSchema> {
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
  TSchema extends TableSchema,
  TRelationship extends keyof TSchema['relationships'],
> = TSchema['relationships'][TRelationship] extends FieldRelationship<
  TableSchema,
  infer TSchema
>
  ? TSchema
  : TSchema['relationships'][TRelationship] extends JunctionRelationship<
      TableSchema,
      TableSchema,
      infer TSchema
    >
  ? TSchema
  : never;
