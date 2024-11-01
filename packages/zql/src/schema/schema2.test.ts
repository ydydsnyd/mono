import * as v from '../../../shared/src/valita.js';

import {test} from 'vitest';
import {table} from './schema2.js';

test('basics', () => {
  const issue = table('issue')
    .columns({name: 'id', type: v.string()} as const)
    .primaryKey('id');
});
