import {test} from 'vitest';
import {boolean, number, string, table} from './schema2.js';

// test('basics', () => {
//   const issue = table('issue')
//     .columns(
//       string('id'),
//       string('title'),
//       boolean('open'),
//       number('created'),
//       number('modified'),
//     )
//     .primaryKey()
//     .build();
// });

test('basics', () => {
  const issue = table('issue')
    .columns({
      id: string(),
      title: string(),
      open: boolean(),
      created: number(),
      modified: number(),
    })
    .primaryKey('id')
    .build();
});
