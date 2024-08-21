import {Context} from '../context/context.js';
import {EntityQuery, EntitySchema, QueryResultRow} from './entity-query.js';

const mockQuery = {
  select() {
    return this;
  },
  run() {
    return this;
  },
  sub() {
    return this;
  },
  related() {
    return this;
  },
  where() {
    return this;
  },
  as() {
    return this;
  },
};

export function newEntityQuery<
  TSchema extends EntitySchema,
  TReturn extends QueryResultRow[] = [],
>(_context: Context, _table: string): EntityQuery<TSchema, TReturn> {
  return mockQuery as unknown as EntityQuery<TSchema, TReturn>;
}
