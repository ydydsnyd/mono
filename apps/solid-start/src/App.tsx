import {createSignal, For} from 'solid-js';
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
      <h1>Zero + Solid</h1>
      <div>
        <div>
          Filter to creator:
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
        </div>
        <div>
          <For each={issues()}>
            {issue => (
              <div class="row">
                <div>Title:&nbsp;{issue.title}</div>
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
      </div>
    </>
  );
}

export default App;
