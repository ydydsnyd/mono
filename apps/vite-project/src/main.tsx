import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Zero} from 'zero-client';
import {ZeroProvider} from 'zero-react/src/use-zero.js';
import App from './App.tsx';
import './index.css';
import {schema} from './schema.ts';

const z = new Zero({
  logLevel: 'info',
  server: import.meta.env.VITE_PUBLIC_SERVER,
  userID: 'anon',
  schemas: schema,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ZeroProvider zero={z}>
      <App />
    </ZeroProvider>
  </StrictMode>,
);
