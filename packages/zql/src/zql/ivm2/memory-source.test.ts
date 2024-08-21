import {expect, test} from 'vitest';
import {Ordering} from '../ast2/ast.js';
import {compareRowsTest} from './data.test.js';
import {MemorySource} from './memory-source.js';
import {runCases} from './test/source-cases.js';
import {ValueType} from './schema.js';
import {Catch} from './catch.js';

runCases(
  (
    _name: string,
    columns: Record<string, ValueType>,
    requiredIndexes: Ordering[],
    primaryKeys: readonly string[],
  ) => new MemorySource(columns, primaryKeys, requiredIndexes),
);

test('schema', () => {
  compareRowsTest((order: Ordering) => {
    const ms = new MemorySource({a: 'string'}, ['a'], [order]);
    const out = new Catch(ms);
    ms.addOutput(out, order);
    return ms.getSchema(out).compareRows;
  });
});

test('output-sorts-must-be-pre-registered', () => {
  const ms = new MemorySource({a: 'string'}, ['a'], [[['a', 'asc']]]);

  // Can add the pre-registered sort.
  ms.addOutput(new Catch(ms), [['a', 'asc']]);

  // Can't add other sorts.
  expect(() => ms.addOutput(new Catch(ms), [['a', 'desc']])).throws(
    'Required index not found: a,desc',
  );
  expect(() => ms.addOutput(new Catch(ms), [['b', 'asc']])).throws(
    'Required index not found: b,asc',
  );
});
