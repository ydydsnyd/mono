import {compareUTF8} from 'compare-utf8';
import {describe, expect, test} from 'vitest';
import {z} from 'zod';
import type {Entity} from '../../entity.js';
import type {AST, Condition, SimpleCondition} from '../ast/ast.js';
import {makeTestContext} from '../context/test-context.js';
import type {DifferenceStream} from '../ivm/graph/difference-stream.js';
import {Materialite} from '../ivm/materialite.js';
import * as agg from '../query/agg.js';
import {conditionToString} from '../query/condition-to-string.js';
import {EntityQuery, astForTesting as ast} from '../query/entity-query.js';
import {buildPipeline, getOperator} from './pipeline-builder.js';

const e1 = z.object({
  id: z.string(),
  a: z.number(),
  b: z.number(),
  c: z.string().optional(),
  d: z.boolean(),
});
type E1 = z.infer<typeof e1>;

const context = makeTestContext();

const comparator = (l: E1, r: E1) => compareUTF8(l.id, r.id);
const ordering = [['id'], 'asc'] as const;
test('A simple select', () => {
  const q = new EntityQuery<{e1: E1}>(context, 'e1');
  const m = new Materialite();
  let s = m.newSetSource<E1>(comparator, ordering);
  let pipeline = buildPipeline(
    () => s.stream as unknown as DifferenceStream<Entity>,
    ast(q.select('id', 'a', 'b', 'c', 'd')),
  );

  let effectRunCount = 0;
  pipeline.effect(x => {
    expect(x).toEqual(expected[effectRunCount++]);
  });

  const expected = [
    {id: 'a', a: 1, b: 1, c: '', d: true},
    {id: 'b', a: 2, b: 2, d: false},
  ] as const;

  s.add(expected[0]);
  s.add(expected[1]);
  expect(effectRunCount).toBe(2);

  s = m.newSetSource(comparator, ordering);
  pipeline = buildPipeline(
    () => s.stream as unknown as DifferenceStream<Entity>,
    ast(q.select('a', 'd')),
  );
  effectRunCount = 0;
  pipeline.effect(x => {
    // We actually return the full data. It is just the types that change based on selection.
    expect(x).toEqual(expected[effectRunCount++]);
  });

  s.add(expected[0]);
  s.add(expected[1]);
  expect(effectRunCount).toBe(2);
});

test('Count', () => {
  const q = new EntityQuery<{e1: E1}>(context, 'e1');
  const m = new Materialite();
  const s = m.newSetSource<E1>(comparator, ordering);
  const pipeline = buildPipeline(
    () => s.stream as unknown as DifferenceStream<Entity>,
    ast(q.select(agg.count())),
  );

  let effectRunCount = 0;
  pipeline.effect((x, mult) => {
    if (mult > 0) {
      expect(x).toEqual(expected[effectRunCount++]);
    }
  });
  const expected = [1, 2, 1, 0].map(x => ({
    a: 1,
    b: 1,
    count: x,
    d: false,
    id: '1',
  }));

  s.add({id: '1', a: 1, b: 1, d: false});
  s.add({id: '2', a: 1, b: 1, d: false});
  s.delete({id: '1', a: 1, b: 1, d: false});
  s.delete({id: '2', a: 1, b: 1, d: false});
  expect(effectRunCount).toBe(4);
});

test('Where', () => {
  const q = new EntityQuery<{e1: E1}>(context, 'e1');
  const m = new Materialite();
  const s = m.newSetSource<E1>(comparator, ordering);
  const pipeline = buildPipeline(
    () => s.stream as unknown as DifferenceStream<Entity>,
    ast(q.select('id').where('a', '>', 1).where('b', '<', 2)),
  );

  let effectRunCount = 0;
  pipeline.effect(x => {
    expect(x).toEqual(expected[effectRunCount++]);
  });
  const expected = [{id: 'b', a: 2, b: 1, d: false}];

  s.add({id: 'a', a: 1, b: 1, d: false});
  s.add({id: 'b', a: 2, b: 1, d: false});
  s.add({id: 'c', a: 1, b: 2, d: false});
  s.add({id: 'd', a: 2, b: 2, d: false});
  expect(effectRunCount).toBe(1);
});

describe('OR', () => {
  type E = {
    id: string;
    a: number;
    b: number;
  };

  type DeleteE = {
    delete: E;
  };

  type Case = {
    name?: string | undefined;
    where: Condition;
    values?: (E | DeleteE)[] | undefined;
    expected: (E | [v: E, multiplicity: number])[];
  };

  const defaultValues: (E | DeleteE)[] = [
    {id: 'a', a: 1, b: 1},
    {id: 'b', a: 2, b: 1},
    {id: 'c', a: 1, b: 2},
    {id: 'd', a: 2, b: 2},
  ];

  const cases: Case[] = [
    {
      where: {
        type: 'conjunction',
        op: 'OR',
        conditions: [
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'b'],
            value: {type: 'value', value: 2},
          },
        ],
      },
      expected: [
        {id: 'a', a: 1, b: 1},
        {id: 'c', a: 1, b: 2},
        {id: 'd', a: 2, b: 2},
      ],
    },
    {
      where: {
        type: 'conjunction',
        op: 'OR',
        conditions: [
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
        ],
      },
      expected: [
        {id: 'a', a: 1, b: 1},
        {id: 'c', a: 1, b: 2},
      ],
    },
    {
      where: {
        type: 'conjunction',
        op: 'OR',
        conditions: [
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'b'],
            value: {type: 'value', value: 2},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 2},
          },
        ],
      },
      values: [
        {id: 'a', a: 1, b: 1},
        {id: 'b', a: 2, b: 1},
        {id: 'c', a: 1, b: 2},
        {id: 'd', a: 3, b: 3},
      ],
      expected: [
        {id: 'a', a: 1, b: 1},
        {id: 'b', a: 2, b: 1},
        {id: 'c', a: 1, b: 2},
      ],
    },
    {
      where: {
        type: 'conjunction',
        op: 'OR',
        conditions: [
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
        ],
      },
      expected: [
        {id: 'a', a: 1, b: 1},
        {id: 'c', a: 1, b: 2},
      ],
    },
    {
      where: {
        type: 'conjunction',
        op: 'OR',
        conditions: [
          {
            type: 'conjunction',
            op: 'AND',
            conditions: [
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 1},
              },
              {
                type: 'simple',
                op: '=',
                field: ['items', 'b'],
                value: {type: 'value', value: 1},
              },
            ],
          },
          {
            type: 'conjunction',
            op: 'AND',
            conditions: [
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 2},
              },
              {
                type: 'simple',
                op: '=',
                field: ['items', 'b'],
                value: {type: 'value', value: 2},
              },
            ],
          },
        ],
      },
      expected: [
        {id: 'a', a: 1, b: 1},
        {id: 'd', a: 2, b: 2},
      ],
    },

    {
      where: {
        type: 'conjunction',
        op: 'AND',
        conditions: [
          {
            type: 'conjunction',
            op: 'OR',
            conditions: [
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 1},
              },
              {
                type: 'simple',
                op: '=',
                field: ['items', 'b'],
                value: {type: 'value', value: 1},
              },
            ],
          },
          {
            type: 'conjunction',
            op: 'OR',
            conditions: [
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 2},
              },
              {
                type: 'simple',
                op: '=',
                field: ['items', 'b'],
                value: {type: 'value', value: 2},
              },
            ],
          },
        ],
      },
      expected: [
        {id: 'b', a: 2, b: 1},
        {id: 'c', a: 1, b: 2},
      ],
    },

    {
      where: {
        type: 'conjunction',
        op: 'AND',
        conditions: [
          {
            type: 'conjunction',
            op: 'OR',
            conditions: [
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 1},
              },
              {
                type: 'simple',
                op: '=',
                field: ['items', 'b'],
                value: {type: 'value', value: 1},
              },
            ],
          },
          {
            type: 'conjunction',
            op: 'OR',
            conditions: [
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 1},
              },
              {
                type: 'simple',
                op: '=',
                field: ['items', 'b'],
                value: {type: 'value', value: 1},
              },
            ],
          },
        ],
      },
      expected: [
        {id: 'a', a: 1, b: 1},
        {id: 'b', a: 2, b: 1},
        {id: 'c', a: 1, b: 2},
      ],
    },

    {
      name: 'Repeat identical conditions',
      where: {
        type: 'conjunction',
        op: 'OR',
        conditions: [
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
        ],
      },
      expected: [
        {id: 'a', a: 1, b: 1},
        {id: 'c', a: 1, b: 2},
      ],
    },

    {
      where: {
        type: 'conjunction',
        op: 'OR',
        conditions: [
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 3},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 4},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 5},
          },
        ],
      },
      expected: [],
    },

    {
      where: {
        type: 'conjunction',
        op: 'AND',
        conditions: [
          {
            type: 'conjunction',
            op: 'OR',
            conditions: [
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 1},
              },
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 2},
              },
              {
                type: 'simple',
                op: '=',
                field: ['items', 'a'],
                value: {type: 'value', value: 3},
              },
            ],
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'b'],
            value: {type: 'value', value: 1},
          },
        ],
      },
      values: [
        {id: 'a', a: 1, b: 1},
        {id: 'b', a: 2, b: 2},
        {id: 'c', a: 3, b: 1},
        {id: 'd', a: 4, b: 1},
      ],
      expected: [
        {id: 'a', a: 1, b: 1},
        {id: 'c', a: 3, b: 1},
      ],
    },

    {
      name: 'With delete',
      where: {
        type: 'conjunction',
        op: 'OR',
        conditions: [
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 1},
          },
          {
            type: 'simple',
            op: '=',
            field: ['items', 'a'],
            value: {type: 'value', value: 2},
          },
        ],
      },
      values: [
        {id: 'a', a: 1, b: 1},
        // Even though it is really nonsensical to delete this entry since this
        // entry does not exist in the model it should still work.
        {delete: {id: 'a', a: 1, b: 3}},
        {id: 'a', a: 2, b: 2},
        {delete: {id: 'c', a: 3, b: 2}},
      ],
      expected: [
        {id: 'a', a: 1, b: 1},
        [{id: 'a', a: 1, b: 3}, -1],
        {id: 'a', a: 2, b: 2},
      ],
    },
  ];

  const comparator = (l: E, r: E) => compareUTF8(l.id, r.id);

  for (const c of cases) {
    test((c.name ? c.name + ': ' : '') + conditionToString(c.where), () => {
      const {values = defaultValues} = c;
      const m = new Materialite();
      const s = m.newSetSource<E>(comparator, [['id'], 'asc']);

      const ast: AST = {
        table: 'items',
        select: [
          [['items', 'id'], 'id'],
          [['items', 'a'], 'a'],
          [['items', 'b'], 'b'],
        ],
        where: c.where,
        orderBy: [[['items', 'id']], 'asc'],
      };

      const pipeline = buildPipeline(
        () => s.stream as unknown as DifferenceStream<Entity>,
        ast,
      );

      const log: unknown[] = [];
      pipeline.effect((value, multiplicity) => {
        if (multiplicity === 1) {
          log.push(value);
        } else {
          log.push([value, multiplicity]);
        }
      });

      for (const value of values) {
        if ('delete' in value) {
          s.delete(value.delete);
          continue;
        } else {
          s.add(value);
        }
      }

      expect(log).toEqual(c.expected);
    });
  }
});

describe('getOperator', () => {
  const cases = [
    {type: 'simple', op: '=', left: 1, right: 1, expected: true},
    {op: '!=', left: 1, right: 1, expected: false},
    {type: 'simple', op: '=', left: 'a', right: 'a', expected: true},
    {op: '!=', left: 'a', right: 'a', expected: false},
    {type: 'simple', op: '=', left: true, right: true, expected: true},
    {op: '!=', left: true, right: true, expected: false},

    {type: 'simple', op: '=', left: 1, right: 2, expected: false},
    {op: '!=', left: 1, right: 2, expected: true},
    {type: 'simple', op: '=', left: 'a', right: 'b', expected: false},
    {op: '!=', left: 'a', right: 'b', expected: true},
    {type: 'simple', op: '=', left: true, right: false, expected: false},
    {op: '!=', left: true, right: false, expected: true},

    {op: '>', left: 1, right: 1, expected: false},
    {op: '>=', left: 1, right: 1, expected: true},
    {op: '<', left: 1, right: 1, expected: false},
    {op: '<=', left: 1, right: 1, expected: true},
    {op: '>', left: 'a', right: 'a', expected: false},
    {op: '>=', left: 'a', right: 'a', expected: true},
    {op: '<', left: 'a', right: 'a', expected: false},
    {op: '<=', left: 'a', right: 'a', expected: true},

    {op: '>', left: 1, right: 2, expected: false},
    {op: '>=', left: 1, right: 2, expected: false},
    {op: '<', left: 1, right: 2, expected: true},
    {op: '<=', left: 1, right: 2, expected: true},
    {op: '>', left: 'a', right: 'b', expected: false},
    {op: '>=', left: 'a', right: 'b', expected: false},
    {op: '<', left: 'a', right: 'b', expected: true},
    {op: '<=', left: 'a', right: 'b', expected: true},

    {op: 'IN', left: 1, right: [1, 2, 3], expected: true},
    {op: 'IN', left: 1, right: [2, 3], expected: false},
    {op: 'IN', left: 'a', right: ['a', 'b', 'c'], expected: true},
    {op: 'IN', left: 'a', right: ['b', 'c'], expected: false},
    {op: 'IN', left: true, right: [true, false], expected: true},
    {op: 'IN', left: true, right: [false], expected: false},

    {op: 'LIKE', left: 'abc', right: 'abc', expected: true},
    {op: 'LIKE', left: 'abc', right: 'ABC', expected: false},
    {op: 'LIKE', left: 'abc', right: 'ab', expected: false},
    {op: 'LIKE', left: 'abc', right: 'ab%', expected: true},
    {op: 'LIKE', left: 'abc', right: '%bc', expected: true},
    {op: 'LIKE', left: 'abbc', right: 'a%c', expected: true},
    {op: 'LIKE', left: 'abc', right: 'a_c', expected: true},
    {op: 'LIKE', left: 'abc', right: 'a__', expected: true},
    {op: 'LIKE', left: 'abc', right: '_bc', expected: true},
    {op: 'LIKE', left: 'abc', right: '___', expected: true},
    {op: 'LIKE', left: 'abc', right: '%', expected: true},
    {op: 'LIKE', left: 'abc', right: '_', expected: false},
    {op: 'LIKE', left: 'abc', right: 'a', expected: false},
    {op: 'LIKE', left: 'abc', right: 'b', expected: false},
    {op: 'LIKE', left: 'abc', right: 'c', expected: false},
    {op: 'LIKE', left: 'abc', right: 'd', expected: false},
    {op: 'LIKE', left: 'abc', right: 'ab', expected: false},

    {op: 'ILIKE', left: 'abc', right: 'abc', expected: true},
    {op: 'ILIKE', left: 'abc', right: 'ABC', expected: true},
    {op: 'ILIKE', left: 'Abc', right: 'ab', expected: false},
    {op: 'ILIKE', left: 'Abc', right: 'ab%', expected: true},
    {op: 'ILIKE', left: 'Abc', right: '%bc', expected: true},
    {op: 'ILIKE', left: 'Abbc', right: 'a%c', expected: true},
    {op: 'ILIKE', left: 'Abc', right: 'a_c', expected: true},
    {op: 'ILIKE', left: 'Abc', right: 'a__', expected: true},
    {op: 'ILIKE', left: 'Abc', right: '_bc', expected: true},
    {op: 'ILIKE', left: 'Abc', right: '___', expected: true},
    {op: 'ILIKE', left: 'Abc', right: '%', expected: true},
    {op: 'ILIKE', left: 'Abc', right: '_', expected: false},
    {op: 'ILIKE', left: 'Abc', right: 'a', expected: false},
    {op: 'ILIKE', left: 'Abc', right: 'b', expected: false},
    {op: 'ILIKE', left: 'Abc', right: 'c', expected: false},
    {op: 'ILIKE', left: 'Abc', right: 'd', expected: false},
    {op: 'ILIKE', left: 'Abc', right: 'ab', expected: false},

    // and some tricky likes
    {op: 'LIKE', left: 'abc', right: 'a%b%c', expected: true},
    {op: 'LIKE', left: 'abc', right: 'a%b', expected: false},
    {op: 'LIKE', left: 'abc', right: '.*', expected: false},
    {op: 'LIKE', left: 'abc', right: '...', expected: false},
    ...Array.from('/\\[](){}^$+?*.|%_', c => ({
      op: 'LIKE',
      left: c,
      right: '_',
      expected: true,
    })),
    {op: 'LIKE', left: 'a%b', right: 'a\\%b', expected: true},
    {op: 'LIKE', left: 'a_b', right: 'a\\_b', expected: true},

    {op: 'LIKE', left: 'a\\bc', right: 'a\\\\bc', expected: true},
    {op: 'LIKE', left: 'a\\Bc', right: 'a\\\\Bc', expected: true},
    {op: 'LIKE', left: 'ab', right: 'a\\b', expected: true},
    {op: 'LIKE', left: 'a"b', right: 'a"b', expected: true},
    {op: 'LIKE', left: "a'b", right: "a'b", expected: true},

    {op: 'LIKE', left: 'a{', right: 'a{', expected: true},
    {op: 'LIKE', left: 'a{', right: 'a\\{', expected: true},
    {op: 'LIKE', left: 'a\n', right: 'a\n', expected: true},
    {op: 'LIKE', left: 'an', right: 'a\\n', expected: true},
    {op: 'LIKE', left: 'a ', right: 'a\\s', expected: false},

    {op: 'INTERSECTS', left: [1, 2, 3], right: [2, 3, 4], expected: true},
    {op: 'INTERSECTS', left: [1, 2, 3], right: [4, 5, 6], expected: false},
    {op: 'INTERSECTS', left: [1, 2, 3], right: [1, 2, 3], expected: true},
    {op: 'INTERSECTS', left: [1, 2, 3], right: [1], expected: true},
    {op: 'INTERSECTS', left: [1], right: [1, 2, 3], expected: true},
    {op: 'INTERSECTS', left: 1, right: [1, 2, 3], expected: true},
    {op: 'INTERSECTS', left: [], right: [], expected: false},
    {op: 'INTERSECTS', left: 1, right: [], expected: false},

    {op: 'SUPERSET', left: [1, 2, 3], right: [2, 3], expected: true},
    {op: 'SUPERSET', left: [1, 2, 3], right: [4, 5], expected: false},
    {op: 'SUPERSET', left: [1, 2, 3], right: [3, 4], expected: false},
    {op: 'SUPERSET', left: [1, 2, 3], right: [1, 2, 3], expected: true},
    {op: 'SUPERSET', left: [1, 2, 3], right: [1, 2, 3, 4], expected: false},
    {op: 'SUPERSET', left: [1, 2, 3], right: [], expected: true},
    {op: 'SUPERSET', left: [], right: [], expected: true},
    {op: 'SUPERSET', left: 1, right: [1, 2, 3], expected: false},
    {op: 'SUPERSET', left: 1, right: [], expected: true},
    {op: 'SUPERSET', left: 1, right: [1], expected: true},

    {op: 'SUBSET', left: [2, 3], right: [1, 2, 3], expected: true},
    {op: 'SUBSET', left: [4, 5], right: [1, 2, 3], expected: false},
    {op: 'SUBSET', left: [3, 4], right: [1, 2, 3], expected: false},
    {op: 'SUBSET', left: [1, 2, 3], right: [1, 2, 3], expected: true},
    {op: 'SUBSET', left: [1, 2, 3, 4], right: [1, 2, 3], expected: false},
    {op: 'SUBSET', left: [], right: [], expected: true},
    {op: 'SUBSET', left: [], right: [1, 2, 3], expected: true},
    {op: 'SUBSET', left: [1], right: [1, 2, 3], expected: true},
    {op: 'SUBSET', left: 1, right: [1, 2], expected: true},
    {op: 'SUBSET', left: 1, right: [], expected: false},
    {op: 'SUBSET', left: 1, right: [1], expected: true},

    {op: 'DISJOINT', left: [1, 2, 3], right: [4, 5, 6], expected: true},
    {op: 'DISJOINT', left: [1, 2, 3], right: [3, 4, 5], expected: false},
    {op: 'DISJOINT', left: [1, 2, 3], right: [1, 2, 3], expected: false},
    {op: 'DISJOINT', left: [1, 2, 3], right: [1], expected: false},
    {op: 'DISJOINT', left: [1], right: [1, 2, 3], expected: false},
    {op: 'DISJOINT', left: 1, right: [1, 2, 3], expected: false},
    {op: 'DISJOINT', left: [], right: [], expected: true},
    {op: 'DISJOINT', left: 1, right: [], expected: true},

    {op: 'CONGRUENT', left: [1, 2, 3], right: [1, 2, 3], expected: true},
    {op: 'CONGRUENT', left: [1, 2, 3], right: [3, 2, 1], expected: true},
    {op: 'CONGRUENT', left: [1, 2, 3], right: [1, 2], expected: false},
    {op: 'CONGRUENT', left: [1, 2], right: [1, 2, 3], expected: false},
    {op: 'CONGRUENT', left: [1, 2, 3], right: [1, 2, 4], expected: false},
    {op: 'CONGRUENT', left: [], right: [], expected: true},
    {op: 'CONGRUENT', left: 1, right: [1, 2, 3], expected: false},
    {op: 'CONGRUENT', left: 1, right: [], expected: false},
    {op: 'CONGRUENT', left: 1, right: [1], expected: true},

    {op: 'INCONGRUENT', left: [1, 2, 3], right: [1, 2, 3], expected: false},
    {op: 'INCONGRUENT', left: [1, 2, 3], right: [3, 2, 1], expected: false},
    {op: 'INCONGRUENT', left: [1, 2, 3], right: [1, 2], expected: true},
    {op: 'INCONGRUENT', left: [1, 2], right: [1, 2, 3], expected: true},
    {op: 'INCONGRUENT', left: [1, 2, 3], right: [1, 2, 4], expected: true},
    {op: 'INCONGRUENT', left: [], right: [], expected: false},
    {op: 'INCONGRUENT', left: 1, right: [1, 2, 3], expected: true},
    {op: 'INCONGRUENT', left: 1, right: [], expected: true},
    {op: 'INCONGRUENT', left: 1, right: [1], expected: false},
  ] as const;

  for (const c of cases) {
    test(`${c.left} ${c.op} ${c.right} === ${c.expected}`, () => {
      const condition = {
        type: 'simple',
        op: c.op,
        field: ['table', 'field'],
        value: {type: 'value', value: c.right},
      } as SimpleCondition;
      expect(getOperator(condition)(c.left)).toBe(c.expected);
    });

    if (['LIKE', 'IN'].includes(c.op)) {
      test(`${c.left} NOT ${c.op} ${c.right} === ${!c.expected}`, () => {
        const condition = {
          type: 'simple',
          op: 'NOT ' + c.op,
          field: ['table', 'field'],
          value: {type: 'value', value: c.right},
        } as SimpleCondition;
        expect(getOperator(condition)(c.left)).toBe(!c.expected);
      });
    }

    // if op is LIKE and expected is true then test ILIKE as well
    if (c.op === 'LIKE' && c.expected) {
      test(`${c.left} ILIKE ${c.right}`, () => {
        const condition = {
          type: 'simple',
          op: 'ILIKE',
          field: ['table', 'field'],
          value: {type: 'value', value: c.right},
        } as SimpleCondition;
        expect(getOperator(condition)(c.left)).toBe(c.expected);
      });
    }
  }

  expect(() =>
    getOperator({
      type: 'simple',
      op: 'LIKE',
      field: ['table', 'field'],
      value: {type: 'value', value: '\\'},
    } as SimpleCondition),
  ).toThrow('LIKE pattern must not end with escape character');
});

// order-by and limit are properties of the materialize view
// and not a part of the pipeline.
