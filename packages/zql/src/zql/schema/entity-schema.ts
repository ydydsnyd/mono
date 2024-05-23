import * as v from 'shared/src/valita.js';
import type {ReadonlyJSONObject} from 'shared/src/json.js';

export type Entity = {
  readonly id: string;
} & ReadonlyJSONObject;

// id will not be required in later iterations where we support compound primary keys.
// we'll use the `primaryKey` field of `TableSchema` instead.
export type RowSchema = {id: v.Type<Readonly<string>>};

/**
 * Example:
 * const user = Table(
 *  {
 *    id: v.string(),
 *    name: v.string(),
 *    email: v.string(),
 *   },
 *  ['id'],
 * );
 * const issue = Table(
 *   {
 *     id: v.string(),
 *     title: v.string(),
 *     description: v.string().optional(),
 *     assignee: v.string(),
 *   },
 *   ['id'],
 *   {
 *     assignee: () => user,
 *   },
 * );
 */
export type TableSchema<R extends RowSchema, Name extends string> = {
  readonly name: Name;
  readonly fields: v.ObjectType<R>;
  readonly primaryKey: (keyof R)[];
  readonly foreignKeys?: ForeignKeys<R> | undefined;
};

export function table<R extends RowSchema, Name extends string>(
  name: Name,
  rowSchema: R,
  primaryKey: (keyof R)[] = ['id'],
  foreignKeys?: ForeignKeys<R> | undefined,
): TableSchema<R, Name> {
  return {
    name,
    fields: v.object(rowSchema),
    primaryKey,
    foreignKeys,
  };
}

type ForeignKeys<R extends RowSchema> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key in keyof R]?: () => TableSchema<any, any>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferType<T extends TableSchema<any, any>> = Readonly<
  v.Infer<T['fields']>
>;
