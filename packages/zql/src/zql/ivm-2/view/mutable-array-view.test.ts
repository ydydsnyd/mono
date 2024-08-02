import {describe, expect, test} from 'vitest';
import {makeComparator} from '../compare.js';
import {ADD, entity, event, IterableTree} from '../iterable-tree.js';
import type {Entity} from '../types.js';
import {updateViews, View} from './mutable-array-view.js';

describe('updateViews', () => {
  test.each([
    {
      name: 'no nesting',
      input: [
        {
          [entity]: {
            id: '1',
          },
          [event]: ADD,
        },
        {
          [entity]: {
            id: '2',
          },
          [event]: ADD,
        },
        {
          [entity]: {
            id: '3',
          },
          [event]: ADD,
        },
      ] satisfies IterableTree<Entity>,
      initialView: [],
      expected: [
        {
          [entity]: {
            id: '1',
          },
        },
        {
          [entity]: {
            id: '2',
          },
        },
        {
          [entity]: {
            id: '3',
          },
        },
      ],
    },
    {
      name: '1 level of nesting',
      input: [
        {
          [event]: ADD,
          [entity]: {
            id: '1',
          },
          children: [
            {
              [event]: ADD,
              [entity]: {
                id: '1',
              },
            },
            {
              [event]: ADD,
              [entity]: {
                id: '2',
              },
            },
          ],
        },
        {
          [event]: ADD,
          [entity]: {
            id: '2',
          },
          children: [],
        },
      ] satisfies IterableTree<Entity>,
      expected: [
        {
          children: [
            {
              [entity]: {
                id: '1',
              },
            },
            {
              [entity]: {
                id: '2',
              },
            },
          ],
          [entity]: {
            id: '1',
          },
        },
        {
          children: [],
          [entity]: {
            id: '2',
          },
        },
      ],
    },
    // {
    //   name: 'nesting while also updating a view with existing data',
    // },
  ])('$name', ({input, initialView, expected}) => {
    const view: View = initialView ?? [];
    const comparators = {
      [entity]: makeComparator([['id', 'asc']]),
    };
    updateViews(view, input, comparators);
    expect(view).toEqual(expected);
  });
});
