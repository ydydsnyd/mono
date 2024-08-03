import {expect, test} from 'vitest';
import {entity} from '../iterable-tree.js';
import {Materialite} from '../materialite.js';
import {MemorySource} from '../source/source.js';
import {MutableArrayView} from './mutable-array-view.js';

test('wire a source to a view and send diffs', () => {
  const m = new Materialite();
  const s = new MemorySource(m, [['id', 'asc']], 'foo');
  const v = new MutableArrayView(s.stream, {
    [entity]: [['id', 'asc']],
  });
  s.stream.addDownstream(v);

  s.add({id: '1', name: 'one'});

  expect(v.data).toEqual([
    {
      [entity]: {
        id: '1',
        name: 'one',
      },
    },
  ]);

  s.remove({id: '1'});

  expect(v.data).toEqual([]);

  s.add({id: '2', name: 'two'});
  s.add({id: '1', name: 'one'});

  expect(v.data).toEqual([
    {
      [entity]: {
        id: '1',
        name: 'one',
      },
    },
    {
      [entity]: {
        id: '2',
        name: 'two',
      },
    },
  ]);
});

test('view pulls on the source for initial data', () => {
  const m = new Materialite();
  const s = new MemorySource(m, [['id', 'asc']], 'foo');
  s.add({id: '1', name: 'one'});
  s.add({id: '2', name: 'two'});

  const v = new MutableArrayView(s.stream, {
    [entity]: [['id', 'asc']],
  });
  s.stream.addDownstream(v);

  v.pull();

  expect(v.data).toEqual([
    {
      [entity]: {
        id: '1',
        name: 'one',
      },
    },
    {
      [entity]: {
        id: '2',
        name: 'two',
      },
    },
  ]);
});
