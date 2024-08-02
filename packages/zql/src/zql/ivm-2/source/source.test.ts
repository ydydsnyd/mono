import {expect, test} from 'vitest';
import {ADD, event, entity, REMOVE} from '../iterable-tree.js';
import {Materialite} from '../materialite.js';
import {MemorySource} from './source.js';

test('add and remove outside a tx auto-commits', () => {
  const m = new Materialite();
  const s = new MemorySource(m, [['id', 'asc']], 'foo');

  let committed = 0;
  let dataSeen;
  let commitCalls = 0;
  let differenceCalls = 0;
  s.stream.addDownstream({
    commit(version) {
      committed = version;
      commitCalls++;
    },
    newDifference(_version, data) {
      dataSeen = data;
      differenceCalls++;
    },
  });

  s.add({id: '1', name: 'one'});

  expect(committed).toBe(1);
  expect(dataSeen).toEqual([
    {
      [entity]: {id: '1', name: 'one'},
      [event]: ADD,
    },
  ]);
  expect(commitCalls).toBe(1);
  expect(differenceCalls).toBe(1);

  s.remove({id: '1', name: 'one'});

  expect(committed).toBe(2);
  expect(dataSeen).toEqual([
    {
      [entity]: {id: '1', name: 'one'},
      [event]: REMOVE,
    },
  ]);
  expect(commitCalls).toBe(2);
  expect(differenceCalls).toBe(2);
});

test('add and remove inside a tx does not auto-commit', () => {
  const m = new Materialite();
  const s = new MemorySource(m, [['id', 'asc']], 'foo');

  let commitCalls = 0;
  let differenceCalls = 0;
  s.stream.addDownstream({
    commit(_) {
      commitCalls++;
    },
    newDifference(_version, _data) {
      differenceCalls++;
    },
  });

  m.tx(() => {
    s.add({id: '1', name: 'one'});
    expect(commitCalls).toBe(0);
    expect(differenceCalls).toBe(1);
    s.remove({id: '1', name: 'one'});
    expect(commitCalls).toBe(0);
    expect(differenceCalls).toBe(2);
  });

  expect(commitCalls).toBe(1);
  expect(differenceCalls).toBe(2);
});
