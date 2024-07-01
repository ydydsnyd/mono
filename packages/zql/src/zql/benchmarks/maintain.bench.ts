import {bench} from 'vitest';
import {TestContext} from '../context/test-context.js';
import {EntityQuery} from '../query/entity-query.js';

type Issue = {
  id: string;
  title: string;
  priority: number;
  status: number;
};
const context = new TestContext();
const source = context.getSource<Issue>('issue');

source.add({id: '1', title: 'a', priority: 1, status: 1});
source.add({id: '2', title: 'b', priority: 1, status: 1});
source.add({id: 'c', title: 'c', priority: 1, status: 1});

const issueQuery = new EntityQuery<{issue: Issue}>(context, 'issue');
const stmt = issueQuery
  .where('issue.priority', '=', 1)
  .where('issue.status', '>', 0)
  .where('title', 'LIKE', 'a')
  .select('issue.id', 'issue.title')
  .prepare();

let i = 0;
bench('maintain some writes', async () => {
  source.delete({id: '1', title: 'a', priority: 1, status: 1});
  source.add({id: '1', title: 'd', priority: 1, status: ++i});
  await stmt.exec();
});
