import {UndoManager} from '@rocicorp/undo';
import ReactDOM from 'react-dom/client';
import {Zero} from 'zero-client';
import App, {Collections} from './app.jsx';
import {ZeroProvider} from './hooks/use-zero.jsx';
import './index.css';
import type {Comment, Issue, IssueLabel, Label, Member} from './issue.js';

async function init() {
  const z = new Zero({
    server: import.meta.env.VITE_PUBLIC_SERVER,
    userID: 'anon',
    kvStore: 'idb',
    queries: {
      issue: v => v as Issue,
      comment: v => v as Comment,
      label: v => v as Label,
      issueLabel: v => v as IssueLabel,
      member: v => v as Member,
    },
  });
  const undoManager = new UndoManager();

  const fields = [
    'created',
    'creatorID',
    'description',
    'id',
    'kanbanOrder',
    'priority',
    'modified',
    'status',
    'title',
  ] as const;
  const preloadIssueLimit = 10_000;
  const preloadIncrement = 500;
  const createdPreloadQueryBase = z.query.issue
    .select(...fields)
    .desc('created');

  function preload(limit: number) {
    const createdPreloadStatement = createdPreloadQueryBase
      .limit(limit)
      .prepare();

    console.log('prefetching', limit);
    const unsub = createdPreloadStatement.subscribe(result => {
      console.log('got', result.length);
      if (result.length === limit && limit < preloadIssueLimit) {
        preload(limit + preloadIncrement);
        console.log('unsub', limit);
        unsub();
        createdPreloadStatement.destroy();
      }
    });
  }

  preload(preloadIncrement);

  function Home({
    zero,
    undoManager,
  }: {
    zero: Zero<Collections>;
    undoManager: UndoManager;
  }) {
    return (
      <div className="repliear">
        <ZeroProvider zero={zero}>
          <App undoManager={undoManager} />
        </ZeroProvider>
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <Home zero={z} undoManager={undoManager} />,
  );
}

await init();
