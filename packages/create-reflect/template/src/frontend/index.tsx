import React from 'react';
import ReactDOM from 'react-dom/client';
import {mutators} from '../shared/mutators';
import {Reflect} from '@rocicorp/reflect';
import {nanoid} from 'nanoid';
const userID = nanoid();
const roomID: string | undefined = import.meta.env.VITE_ROOM_ID;
if (roomID === undefined || roomID === '') {
  throw new Error('VITE_ROOM_ID required');
}
const socketOrigin = import.meta.env.VITE_WORKER_URL;

const r = new Reflect({
  socketOrigin,
  userID,
  roomID,
  auth: userID,
  mutators,
});


r.subscribe(async tx => (await tx.get('count')) ?? 0, {
  onData: count => {
    const button = document.querySelector('#increment');
    if (button) {
      button.textContent = `Button clicked ${count} times`;
    }
  },
});

const handleIncrement = async () => {
  await r.mutate.increment(1);
};
// Workaround for https://github.com/rocicorp/reflect-server/issues/146.
// We don't receive initial data until first mutation after connection.
void r.mutate.init();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <button id="increment" onClick={handleIncrement}>
      Button clicked 0 times
    </button>
  </React.StrictMode>,
);
