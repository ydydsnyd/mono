import * as v from '../../../shared/src/valita.js';

import {test} from 'vitest';
import {table} from './schema2.js';

test('basics', () => {
  const x = table('issue').columns({
    name: 'id',
    storageType: 'string',
  } as const);
  const issue = table('issue')
    .columns({name: 'id', storageType: 'string'} as const)
    .primaryKey('id');
});
