import {test} from 'vitest';
import {boolean, number, string, table} from './schema2.js';

test('basics', () => {
  const label = table('label')
    .columns({
      id: string(),
      name: string(),
    })
    .primaryKey('id')
    .build();

  const issue = table('issue')
    .columns({
      id: string(),
      title: string(),
      open: boolean(),
      created: number(),
      modified: number(),
    })
    .primaryKey('id')
    .relationships(source => ({
      comments: source('id').dest(() => comment, 'issueId'),
      labels: source('id')
        .junction(() => issueLabel, 'issueId', 'labelId')
        .dest(label, 'id'),
    }))
    .build();

  const issueLabel = table('issueLabel')
    .columns({
      issueId: string(),
      labelId: string(),
    })
    .primaryKey('issueId', 'labelId')
    .build();

  const comment = table('comment')
    .columns({
      id: string(),
      issueId: string(),
      content: string(),
    })
    .build();

  console.log(issue);
});
