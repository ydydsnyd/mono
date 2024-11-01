import {test} from 'vitest';
import {boolean, number, string, table} from './schema2.js';

test('basics', () => {
  const issue = table('issue')
    .columns(
      string('id'),
      string('title'),
      boolean('open'),
      number('created'),
      number('modified'),
    )
    .primaryKey('id');
});
