import {test} from 'vitest';
import {string, table} from './schema2.js';

test('basics', () => {
  const x = table('issue').columns(string('id').done());
  const issue = table('issue').columns(string('id').done()).primaryKey('id');
});
