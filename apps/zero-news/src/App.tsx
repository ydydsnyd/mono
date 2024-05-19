import {useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import {Zero} from 'zero-client';
import {User} from './user.ts';
import {useQuery} from './hooks/use-zql.ts';

const z = new Zero({
  server: import.meta.env.VITE_ZERO_URL,
  userID: 'anon',
  kvStore: 'idb',
  queries: {
    user: v => v as User,
  },
});

function App() {
  const [count, setCount] = useState(0);

  const users = useQuery(z.query.user.select('*').limit(100));
  console.log({users});

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
