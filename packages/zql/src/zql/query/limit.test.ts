import {describe, test} from 'vitest';

/**
 * To make sure `limit` is actually `limiting` the amount of data we're processing
 * from a source, we need to test it with an infinite source.
 *
 * There are some forms of queries which are not supported with an infinite source
 * but here we test all those that we expect to work.
 */
describe('pulling from an infinite source', () => {
  test('bare select', () => {});
  test('select and where', () => {});

  // need to make join lazy
  // test('select and join', () => {});

  // need the `contiguou groups` optimization
  // test('select and group-by', () => {});
});
