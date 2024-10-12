import {createSignal, For} from 'solid-js';
import solidLogo from './assets/solid.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {Zero} from '@rocicorp/zero';
import {schema} from './domain/schema.js';

function App() {
  const z = new Zero({
    server: 'http://localhost:4848',
    userID: 'anon',
    schema,
    kvStore: 'mem',
  });

  console.log(z.clientID);

  const usersView = z.query.user.materializeSolid();
  usersView.hydrate();
  const users = usersView.data;

  const labelsView = z.query.label.limit(6).materializeSolid();
  labelsView.hydrate();
  const labels = labelsView.data;

  const [selectedUserID, setSelectedUserID] = createSignal<string | undefined>(
    undefined,
  );

  const issues = () => {
    let issueQuery = z.query.issue
      .related('creator')
      .related('labels')
      .limit(100);
    const userID = selectedUserID();
    if (userID) {
      issueQuery = issueQuery.where('creatorID', '=', userID);
    }
    const issuesView = issueQuery.materializeSolid();

    issuesView.hydrate();
    return issuesView.data;
  };

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
      <div>
        <button onClick={() => setSelectedUserID(undefined)}>Clear</button>
        <For each={users}>
          {user => (
            <button
              onClick={() => {
                selectedUserID() === user.id
                  ? setSelectedUserID(undefined)
                  : setSelectedUserID(user.id);
              }}
            >
              {user.name}
            </button>
          )}
        </For>
        <For each={issues()} fallback={<div>Loading...</div>}>
          {issue => (
            <div>
              <div>{issue.title}</div>
              <div>Creator:&nbsp;{issue.creator[0]?.name}</div>
              <div>
                Labels:&nbsp;
                <For each={issue.labels}>
                  {label => (
                    <>
                      <button
                        onClick={() => {
                          void z.mutate.issueLabel.delete({
                            issueID: issue.id,
                            labelID: label.id,
                          });
                        }}
                      >
                        {label.name}
                      </button>
                      ,&nbsp;
                    </>
                  )}
                </For>
              </div>
              <div>
                Add Labels:&nbsp;
                <For each={labels}>
                  {label => (
                    <button
                      onClick={() => {
                        void z.mutate.issueLabel.set({
                          issueID: issue.id,
                          labelID: label.id,
                        });
                      }}
                    >
                      {label.name}
                    </button>
                  )}
                </For>
              </div>
            </div>
          )}
        </For>
      </div>
    </>
  );
}

export default App;
