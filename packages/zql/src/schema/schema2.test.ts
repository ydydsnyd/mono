import {test} from 'vitest';
import {boolean, fieldRelationship, number, string, table} from './schema2.js';

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
    .relationships(({field}) => ({
      comments: field('id').dest('issueID'),
    }))
    .build();

  table('malformed')
    .columns({
      id: string(),
      title: string(),
      open: boolean(),
      created: number(),
      modified: number(),
    })
    // @ts-expect-error missing field as primary key
    .primaryKey('foo');
});
