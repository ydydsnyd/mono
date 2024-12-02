import {expect, test} from 'vitest';
import type {PrimaryKey} from '../../zero-protocol/src/primary-key.js';
import {
  normalizePrimaryKey,
  normalizeTableSchema,
} from './normalize-table-schema.js';
import {assertFieldRelationship, type TableSchema} from './table-schema.js';

// Use JSON to preserve the order of properties since
// the testing framework doesn't care about the order.
function normalizeTableSchemaJSON(tableSchema: TableSchema): string {
  return JSON.stringify(normalizeTableSchema(tableSchema), null, 2);
}

test('normalizePrimaryKey', () => {
  let pk: PrimaryKey = ['a'];
  expect(normalizePrimaryKey(pk)).toBe(pk);
  pk = ['a', 'b'];
  expect(normalizePrimaryKey(pk)).toBe(pk);

  pk = ['b', 'a'];
  expect(normalizePrimaryKey(pk)).toBe(pk);

  pk = ['b', 'a', 'c'];
  expect(normalizePrimaryKey(pk)).toBe(pk);

  pk = ['a', 'b', 'a'];
  expect(() => normalizePrimaryKey(pk)).toThrow(
    new Error('Primary key must not contain duplicates'),
  );
});

test('sort the column names', () => {
  expect(
    normalizeTableSchemaJSON({
      tableName: 'foo',
      primaryKey: ['id'],
      columns: {
        id: {type: 'string'},
        a: {type: 'number'},
      },
      relationships: {},
    }),
  ).toMatchInlineSnapshot(`
    "{
      "tableName": "foo",
      "primaryKey": [
        "id"
      ],
      "columns": {
        "a": {
          "type": "number",
          "optional": false
        },
        "id": {
          "type": "string",
          "optional": false
        }
      },
      "relationships": {}
    }"
  `);
});

test('Invalid primary key type', () => {
  expect(() =>
    normalizeTableSchema({
      tableName: 'foo',
      primaryKey: ['id'],
      columns: {
        id: {type: 'null'},
        a: {type: 'number'},
      },
      relationships: {},
    }),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: Primary key column "id" must be a string, number, or boolean. Got null]`,
  );
});

test('Invalid primary key column not found', () => {
  expect(() =>
    normalizeTableSchema({
      tableName: 'foo',
      primaryKey: ['id'],
      columns: {
        a: {type: 'number'},
      },
      relationships: {},
    }),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: Primary key column "id" not found]`,
  );
});

test('Invalid primary key column optional', () => {
  expect(() =>
    normalizeTableSchema({
      tableName: 'foo',
      primaryKey: ['id'],
      columns: {
        id: {type: 'string', optional: true},
        a: {type: 'number'},
      },
      relationships: {},
    }),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: Primary key column "id" cannot be optional]`,
  );
});

test('add optional to schema value', () => {
  expect(
    normalizeTableSchemaJSON({
      tableName: 'foo',
      primaryKey: ['id'],
      columns: {
        id: {type: 'string'},
        a: {type: 'number', optional: true},
      },
      relationships: {},
    }),
  ).toMatchInlineSnapshot(
    `
    "{
      "tableName": "foo",
      "primaryKey": [
        "id"
      ],
      "columns": {
        "a": {
          "type": "number",
          "optional": true
        },
        "id": {
          "type": "string",
          "optional": false
        }
      },
      "relationships": {}
    }"
  `,
  );
});

test('relationships should be sorted', () => {
  const barSchema: TableSchema = {
    tableName: 'bar',
    primaryKey: ['id'],
    columns: {
      id: {type: 'string'},
    },
    relationships: {},
  };
  const fooSchema: TableSchema = {
    tableName: 'foo',
    primaryKey: ['id'],
    columns: {
      id: {type: 'string'},
    },
    relationships: {
      b: {
        sourceField: ['bar-source'],
        destField: ['field'],
        destSchema: barSchema,
      },
      a: {
        sourceField: ['bar-source'],
        destField: ['field'],
        destSchema: () => barSchema,
      },
    },
  };

  expect(normalizeTableSchemaJSON(fooSchema)).toMatchInlineSnapshot(
    `
    "{
      "tableName": "foo",
      "primaryKey": [
        "id"
      ],
      "columns": {
        "id": {
          "type": "string",
          "optional": false
        }
      },
      "relationships": {
        "a": {
          "sourceField": [
            "bar-source"
          ],
          "destField": [
            "field"
          ],
          "destSchema": {
            "tableName": "bar",
            "primaryKey": [
              "id"
            ],
            "columns": {
              "id": {
                "type": "string",
                "optional": false
              }
            },
            "relationships": {}
          }
        },
        "b": {
          "sourceField": [
            "bar-source"
          ],
          "destField": [
            "field"
          ],
          "destSchema": {
            "tableName": "bar",
            "primaryKey": [
              "id"
            ],
            "columns": {
              "id": {
                "type": "string",
                "optional": false
              }
            },
            "relationships": {}
          }
        }
      }
    }"
  `,
  );
});

test('Cyclic relationship should be supported', () => {
  const fooTableSchema: TableSchema = {
    tableName: 'foo',
    primaryKey: ['id'],
    columns: {
      id: {type: 'string'},
    },
    relationships: {
      bar: {
        sourceField: ['bar-source'],
        destField: ['field'],
        destSchema: () => fooTableSchema,
      },
    },
  };

  const normalizedFooTableSchema = normalizeTableSchema(fooTableSchema);

  assertFieldRelationship(normalizedFooTableSchema.relationships.bar);
  expect(normalizedFooTableSchema.relationships.bar.destSchema).toBe(
    normalizedFooTableSchema,
  );
});

test('Mutually resolving relationships should be supported', () => {
  const fooTableSchema: TableSchema = {
    tableName: 'foo',
    primaryKey: ['id'],
    columns: {
      id: {type: 'string'},
    },
    relationships: {
      bar: {
        sourceField: ['bar-source'],
        destField: ['field'],
        destSchema: () => barTableSchema,
      },
    },
  };

  const barTableSchema: TableSchema = {
    tableName: 'bar',
    primaryKey: ['id'],
    columns: {
      id: {type: 'string'},
    },
    relationships: {
      foo: {
        sourceField: ['foo-source'],
        destField: ['field'],
        destSchema: () => fooTableSchema,
      },
    },
  };

  const normalizedFooTableSchema = normalizeTableSchema(fooTableSchema);

  assertFieldRelationship(normalizedFooTableSchema.relationships.bar);
  assertFieldRelationship(
    normalizedFooTableSchema.relationships.bar.destSchema.relationships.foo,
  );
  expect(
    normalizedFooTableSchema.relationships.bar.destSchema.relationships.foo
      .destSchema,
  ).toBe(normalizedFooTableSchema);
});

test('Missing relationships should be normalized to empty object', () => {
  const fooTableSchema: TableSchema = {
    tableName: 'foo',
    primaryKey: ['id'],
    columns: {
      id: {type: 'string'},
    },
  };

  const normalizedFooTableSchema = normalizeTableSchema(fooTableSchema);
  expect(normalizedFooTableSchema).toMatchInlineSnapshot(`
    NormalizedTableSchema {
      "columns": {
        "id": {
          "optional": false,
          "type": "string",
        },
      },
      "primaryKey": [
        "id",
      ],
      "relationships": {},
      "tableName": "foo",
    }
  `);
});

test('field names should be normalized to compound keys', () => {
  const fooTableSchema: TableSchema = {
    tableName: 'foo',
    primaryKey: ['id'],
    columns: {
      id: {type: 'string'},
    },
    relationships: {
      bar: {
        sourceField: 'bar-source',
        destField: ['field'],
        destSchema: () => barTableSchema,
      },
    },
  };

  const barTableSchema: TableSchema = {
    tableName: 'bar',
    primaryKey: ['id'],
    columns: {
      id: {type: 'string'},
    },
    relationships: {
      foo: {
        sourceField: ['foo-source'],
        destField: 'field',
        destSchema: () => fooTableSchema,
      },
    },
  };

  const normalizedFooTableSchema = normalizeTableSchema(fooTableSchema);
  expect(normalizedFooTableSchema).toMatchInlineSnapshot(`
    NormalizedTableSchema {
      "columns": {
        "id": {
          "optional": false,
          "type": "string",
        },
      },
      "primaryKey": [
        "id",
      ],
      "relationships": {
        "bar": {
          "destField": [
            "field",
          ],
          "destSchema": NormalizedTableSchema {
            "columns": {
              "id": {
                "optional": false,
                "type": "string",
              },
            },
            "primaryKey": [
              "id",
            ],
            "relationships": {
              "foo": {
                "destField": [
                  "field",
                ],
                "destSchema": [Circular],
                "sourceField": [
                  "foo-source",
                ],
              },
            },
            "tableName": "bar",
          },
          "sourceField": [
            "bar-source",
          ],
        },
      },
      "tableName": "foo",
    }
  `);
});

test('string primary key should be normalized to PrimaryKey', () => {
  const fooTableSchema: TableSchema = {
    tableName: 'foo',
    primaryKey: 'id',
    columns: {
      id: {type: 'string'},
    },
  };

  const normalizedFooTableSchema = normalizeTableSchema(fooTableSchema);
  expect(normalizedFooTableSchema.primaryKey).toEqual(['id']);
  expect(normalizedFooTableSchema).toMatchInlineSnapshot(`
    NormalizedTableSchema {
      "columns": {
        "id": {
          "optional": false,
          "type": "string",
        },
      },
      "primaryKey": [
        "id",
      ],
      "relationships": {},
      "tableName": "foo",
    }
  `);
});

test('column types should be normalized to SchemaValue', () => {
  const fooTableSchema: TableSchema = {
    tableName: 'foo',
    primaryKey: ['string'],
    columns: {
      string: 'string',
      number: 'number',
      boolean: 'boolean',
      null: 'null',
      json: 'json',

      stringOptional: {type: 'string', optional: true},
      numberOptional: {type: 'number', optional: true},
      booleanOptional: {type: 'boolean', optional: true},
      nullOptional: {type: 'null', optional: true},
      jsonOptional: {type: 'json', optional: true},
    },
  };

  const normalizedFooTableSchema = normalizeTableSchema(fooTableSchema);
  expect(normalizedFooTableSchema).toMatchInlineSnapshot(`
    NormalizedTableSchema {
      "columns": {
        "boolean": {
          "optional": false,
          "type": "boolean",
        },
        "booleanOptional": {
          "optional": true,
          "type": "boolean",
        },
        "json": {
          "optional": false,
          "type": "json",
        },
        "jsonOptional": {
          "optional": true,
          "type": "json",
        },
        "null": {
          "optional": false,
          "type": "null",
        },
        "nullOptional": {
          "optional": true,
          "type": "null",
        },
        "number": {
          "optional": false,
          "type": "number",
        },
        "numberOptional": {
          "optional": true,
          "type": "number",
        },
        "string": {
          "optional": false,
          "type": "string",
        },
        "stringOptional": {
          "optional": true,
          "type": "string",
        },
      },
      "primaryKey": [
        "string",
      ],
      "relationships": {},
      "tableName": "foo",
    }
  `);
});
