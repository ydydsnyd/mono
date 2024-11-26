import type {PermissionRule} from './permissions.js';
import type {TableSchema} from './table-schema.js';

export function newPermissions<TAuthDataShape>() {
  return <TSchema extends TableSchema>(schema: TSchema) => {
    permissions<TAuthDataShape, TSchema>(schema);
  };
}

function permissions<TAuthDataShape, TSchema extends TableSchema>(
  schema: TableSchema,
) {}

class PermissionsBuilder<TAuthDataShape, TSchema extends TableSchema> {
  constructor() {}

  select(...rules: PermissionRule<TAuthDataShape, TSchema>[]) {}
  insert(...rules: PermissionRule<TAuthDataShape, TSchema>[]) {}
  update(...rules: PermissionRule<TAuthDataShape, TSchema>[]) {}
  delete(...rules: PermissionRule<TAuthDataShape, TSchema>[]) {}
}
