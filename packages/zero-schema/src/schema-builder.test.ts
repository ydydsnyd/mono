import {test} from 'vitest';
import {column, table} from './schema-builder.js';

test('schema-builder', () => {
  table(
    'user',
    {
      id: column.string(),
      name: column.string(),
      role: column.string(),
      age: column.number().optional(),
    },
    columns => ({
      primaryKey: [columns.id],
      relationships: {},
    }),
  );
});

// do not like the above
// the schema-2 format is better
// but we need to try to target the schema-1 format with it.
