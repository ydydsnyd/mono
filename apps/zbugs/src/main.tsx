import {createRoot} from 'react-dom/client';
import {must} from 'shared/src/must.js';
import {Zero} from 'zero-client';
import {ZeroProvider} from './hooks/use-zero.jsx';
import './index.css';
import {Schema, schema} from './schema.js';

const z = new Zero({
  logLevel: 'info',
  server: import.meta.env.VITE_PUBLIC_SERVER,
  userID: 'anon',
  schemas: schema,
});

const v = z.query.issue.limit(10).materialize();
v.addListener(data => {
  console.log('data', data);
});
v.hydrate();

// Exposed so we can mess around in the terminal and add/remove issues
(window as {z?: Zero<Schema>}).z = z;

function Home({zero}: {zero: Zero<Schema>}) {
  return (
    <div>
      <ZeroProvider zero={zero}>
        <div>hi</div>
      </ZeroProvider>
    </div>
  );
}

const root = must(document.getElementById('root'));
createRoot(root).render(<Home zero={z} />);
