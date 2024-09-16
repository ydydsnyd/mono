import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import {FPSMeter} from '@schickling/fps-meter';
import {useQueryAutoDeps} from 'zero-react/src/use-query.js';
import {Schema} from './schema';
import {useZero} from 'zero-react/src/use-zero';

function App() {
  const z = useZero<Schema>();
  const count =
    useQueryAutoDeps(z.query.counter.where('id', '1'))[0]?.count ?? 0;

  return (
    <>
      <FPSMeter height={40} />
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
        <button
          onClick={() => z.mutate.counter.set({id: '1', count: count + 1})}
        >
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
