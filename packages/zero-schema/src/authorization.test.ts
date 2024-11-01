import {expect, test} from 'vitest';
import {createSchema} from './schema.js';
import {type TableSchema} from './table-schema.js';
import {defineAuthorization} from './authorization.js';
import type {ExpressionBuilder} from '../../zql/src/query/expression.js';
import {table, column} from './table-builder.js';

const {string} = column;

const userSchema = table('user')
  .columns({
    id: string(),
    login: string(),
    name: string(),
    avatar: string(),
    role: string(),
  })
  .primaryKey('id')
  .build();

const schema = createSchema({
  version: 1,
  tables: {
    user: userSchema,
  },
});

type AuthData = {
  sub: string;
  role: 'admin' | 'user';
};

test('authorization rules create query ASTs', async () => {
  const config = await defineAuthorization<AuthData, typeof schema>(
    schema,
    () => {
      const allowIfAdmin = (
        authData: AuthData,
        {cmpLit}: ExpressionBuilder<TableSchema>,
      ) => cmpLit(authData.role, '=', 'admin');

      return {
        user: {
          row: {
            insert: [allowIfAdmin],
            update: {
              preMutation: [allowIfAdmin],
            },
            delete: [allowIfAdmin],
          },
        },
      };
    },
  );

  expect(config).toMatchInlineSnapshot(`
    {
      "user": {
        "cell": undefined,
        "row": {
          "delete": [
            [
              "allow",
              {
                "left": {
                  "anchor": "authData",
                  "field": "role",
                  "type": "static",
                },
                "op": "=",
                "right": {
                  "type": "literal",
                  "value": "admin",
                },
                "type": "simple",
              },
            ],
          ],
          "insert": [
            [
              "allow",
              {
                "left": {
                  "anchor": "authData",
                  "field": "role",
                  "type": "static",
                },
                "op": "=",
                "right": {
                  "type": "literal",
                  "value": "admin",
                },
                "type": "simple",
              },
            ],
          ],
          "select": undefined,
          "update": {
            "postProposedMutation": undefined,
            "preMutation": [
              [
                "allow",
                {
                  "left": {
                    "anchor": "authData",
                    "field": "role",
                    "type": "static",
                  },
                  "op": "=",
                  "right": {
                    "type": "literal",
                    "value": "admin",
                  },
                  "type": "simple",
                },
              ],
            ],
          },
        },
      },
    }
  `);
});
