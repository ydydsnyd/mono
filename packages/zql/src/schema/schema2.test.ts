import {test} from 'vitest';
import {string, table} from './schema2.js';

test('basics', () => {
  const x = table('issue').columns(string('id'));
  const issue = table('issue').columns(string('id')).primaryKey('id');
});
