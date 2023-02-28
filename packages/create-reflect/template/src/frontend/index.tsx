import React from 'react';
import ReactDOM from 'react-dom/client';
import {mutators} from '../shared/mutators';
import {Reflect} from '@rocicorp/reflect';
import {useSubscribe} from 'replicache-react';
import {nanoid} from 'nanoid';
const userID = nanoid();
const roomID: string | undefined = import.meta.env.VITE_ROOM_ID;
if (roomID === undefined || roomID === '') {
  throw new Error('VITE_ROOM_ID required');
}

const socketOrigin: string | undefined = import.meta.env.VITE_WORKER_URL;
if (socketOrigin === undefined || socketOrigin === '') {
  throw new Error('VITE_WORKER_URL required');
}

type M = typeof mutators;

const r = new Reflect({
  socketOrigin,
  userID,
  roomID,
  auth: userID,
  mutators,
});

// Workaround for https://github.com/rocicorp/reflect-server/issues/146.
// We don't receive initial data until first mutation after connection.
void r.mutate.init();

const App = ({reflect}: {reflect: Reflect<M>}) => {
  // Subscribe to the count.
  const count = useSubscribe(
    reflect,
    async tx => (await tx.get('count')) ?? '0',
    0,
    [reflect],
  );

  // Define event handlers and connect them to Reflect mutators. Each
  // of these mutators runs immediately (optimistically) locally, then runs
  // again on the server-side automatically.
  const handleIncrement = async () => {
    await r.mutate.increment(1);
  };

  // Render app.
  return (
    <button id="increment" onClick={handleIncrement}>
      {`Button clicked ${count} times`}
    </button>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <App reflect={r} />
  </React.StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(async () => {
    // this makes sure that there is only one instance of the reflect client during hmr reloads
    await r.close();
    root.unmount();
  });
}
