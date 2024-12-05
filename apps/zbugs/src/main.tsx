import './zero-setup.js';
<<<<<<< HEAD

import {StrictMode} from 'react';
=======
>>>>>>> 6f5c474fa (row/rows)
import {createRoot} from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import {must} from 'shared/src/must.js';
import {LoginProvider} from './hooks/use-login.js';
import './index.css';
import Root from './root.js';

createRoot(must(document.getElementById('root'))).render(
  <LoginProvider>
    <Root />
  </LoginProvider>,
);
