import {describe, expect, test} from 'vitest';
import {makeTestContext} from '../context/context.js';
import {astForTesting, EntityQuery} from '../query/entity-query.js';
import {getRequiredColumns} from './required-columns.js';
import * as agg from '../query/agg.js';

type E1 = {
  id: string;
  name: string;
};
const context = makeTestContext();

describe('RequiredColumns', () => {
  const q = new EntityQuery<{e1: E1}>(context, 'e1', 'e1');
  test.each([
    {
      test: 'basic select of id',
      q: q.select('id'),
      expected: new Map([['e1', new Set(['id'])]]),
    },
    {
      test: 'basic select of id and name',
      q: q.select('id', 'name'),
      expected: new Map([['e1', new Set(['id', 'name'])]]),
    },
    {
      test: 'where',
      q: q.where('name', '=', 'foo'),
      expected: new Map([['e1', new Set(['name'])]]),
    },
    {
      test: 'group by',
      q: q.groupBy('name'),
      expected: new Map([['e1', new Set(['name'])]]),
    },
    {
      test: 'order by',
      q: q.asc('name'),
      expected: new Map([['e1', new Set(['name'])]]),
    },
    {
      test: 'aggregate',
      q: q.select(agg.avg('name')),
      expected: new Map([['e1', new Set(['name'])]]),
    },
    {
      test: 'aggregate with alias',
      q: q.select(agg.avg('name', 'blame')),
      expected: new Map([['e1', new Set(['name'])]]),
    },
    {
      test: 'join',
      q: q.join(q, 'e2', 'e1.id', 'id'),
      expected: new Map([['e1', new Set(['id'])]]),
    },
    {
      test: 'where against aliased join',
      q: q.join(q, 'e2', 'e1.id', 'id').where('e2.name', '=', 'foo'),
      expected: new Map([['e1', new Set(['id', 'name'])]]),
    },
  ])('$test', ({q, expected}) => {
    expect(getRequiredColumns(astForTesting(q))).toEqual(expected);
  });
});
