import {TestContext} from 'zql/dist/zql/context/test-context.js';
import {EntityQuery} from 'zql/dist/zql/query/entity-query.js';
import './App.css';

const ctx = new TestContext();
type Issue = {
  id: string;
  title: string;
};
const issueQuery = new EntityQuery<{issue: Issue}>(ctx, 'issue');
const issueSource = ctx.getSource('issue');

ctx.materialite.tx(() => {
  for (let i = 0; i < 10_000; i++) {
    issueSource.add({id: i.toString().padStart(6, '0'), title: `Issue ${i}`});
  }
});

function App() {
  async function runZQL() {
    const stmt = issueQuery
      .select('id', 'title')
      .where('title', '=', 'Issue 5000')
      .prepare();
    const rows = await stmt.exec();
    console.log(rows);
    stmt.destroy();
  }

  return (
    <div
      onClick={runZQL}
      style={{
        cursor: 'pointer',
        background: 'grey',
        padding: 5,
        borderRadius: 5,
        color: 'white',
      }}
    >
      Run ZQL
    </div>
  );
}

export default App;
