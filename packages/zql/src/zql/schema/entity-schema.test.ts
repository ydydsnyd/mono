import * as v from 'shared/src/valita.js';
import {expectTypeOf, test} from 'vitest';
import type {EntityQuery, SchemaToQuery} from '../query/entity-query.js';
import {InferType, table} from './entity-schema.js';

test('basic schema', () => {
  const userSchema = table('user', {
    id: v.string(),
    name: v.string(),
    email: v.string(),
  });
  const issueSchema = table(
    'issue',
    {
      id: v.string(),
      title: v.string(),
      description: v.string().optional(),
      assignee: v.string(),
    },
    ['id'],
    {
      assignee: () => userSchema,
    },
  );

  type User = InferType<typeof userSchema>;
  type UserQuery = SchemaToQuery<typeof userSchema>;

  expectTypeOf<UserQuery>().toMatchTypeOf<
    EntityQuery<
      {
        user: Readonly<{
          id: string;
          name: string;
          email: string;
        }>;
      },
      []
    >
  >();

  expectTypeOf<User>().toMatchTypeOf<{
    id: string;
    name: string;
    email: string;
  }>();

  type Issue = InferType<typeof issueSchema>;
  expectTypeOf<Issue>().toMatchTypeOf<{
    id: string;
    title: string;
    description?: string | undefined;
    assignee: string;
  }>();
});
