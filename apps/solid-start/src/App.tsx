import {Accessor, createMemo, createSignal, For, onCleanup} from 'solid-js';
import './App.css';
import {Query, QueryType, Smash, TableSchema, Zero} from '@rocicorp/zero';
import {schema} from './domain/schema.js';

function useQuery<TSchema extends TableSchema, TReturn extends QueryType>(
  querySignal: () => Query<TSchema, TReturn>,
): Accessor<Smash<TReturn>> {
  return createMemo(() => {
    const query = querySignal();
    const view = query.materializeSolid();

    onCleanup(() => {
      view.destroy();
    });

    view.hydrate();
    return view.data;
  });
}

function App() {
  const z = new Zero({
    server: 'http://localhost:4848',
    userID: 'anon',
    schema,
    kvStore: 'mem',
  });

  z.query.issue.related('creator').related('labels').preload();

  console.log(z.clientID);

  const users = useQuery(() => z.query.user);

  const labels = useQuery(() => z.query.label.limit(6));

  const [selectedUserID, setSelectedUserID] = createSignal<string | undefined>(
    undefined,
  );

  const issues = useQuery(() => {
    let issueQuery = z.query.issue
      .related('creator')
      .related('labels')
      .limit(100);
    const userID = selectedUserID();

    if (userID) {
      issueQuery = issueQuery.where('creatorID', '=', userID);
    }
    return issueQuery;
  });

  return (
    <>
      <h1>Zero + Solid</h1>
      <div>
        <div>
          Filter to creator:
          <button onClick={() => setSelectedUserID(undefined)}>Clear</button>
          <For each={users()}>
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
                  <For each={labels()}>
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
