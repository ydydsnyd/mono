import {createSignal, For} from 'solid-js';
import solidLogo from './assets/solid.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {Zero} from '@rocicorp/zero';
import {schema} from './domain/schema.js';

function App() {
  const [count, setCount] = createSignal(0);
  const z = new Zero({
    server: 'http://localhost:4848',
    userID: 'anon',
    schema,
    kvStore: 'mem',
  });

  console.log(z.clientID);

  const issuesView = z.query.issue
    .related('creator')
    .related('labels')
    .limit(100)
    .materializeSolid();
  const issues = issuesView.data;
  issuesView.hydrate();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div>
        <For each={issues} fallback={<div>Loading...</div>}>
          {issue => (
            <div>
              <span>{issue.title}</span>
              <span>{issue.creator[0]?.name ?? ''}</span>
              <For each={issue.labels} fallback={<div>Loading...</div>}>
                {label => <span>{label.name}</span>}
              </For>
            </div>
          )}
        </For>
      </div>
    </>
  );
}

export default App;
