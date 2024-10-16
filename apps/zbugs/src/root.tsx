import {Zero} from '@rocicorp/zero';
import {ZeroProvider} from '@rocicorp/zero/react';
import {useEffect, useState} from 'react';
import {
  BrowserRouter,
  createBrowserRouter,
  Route,
  Routes,
  ScrollRestoration,
} from 'react-router-dom';
import {Nav} from './components/nav.js';
import {type Schema} from './domain/schema.js';
import ErrorPage from './pages/error/error-page.js';
import IssuePage from './pages/issue/issue-page.js';
import ListPage from './pages/list/list-page.js';
import {zeroRef} from './zero-setup.js';

const router = createBrowserRouter([
  {
    path: '/',
    Component: ListPage,
  },
  {
    path: '/issue/:id',
    Component: IssuePage,
  },
  {
    Component: ErrorPage,
  },
]);

export default function Root() {
  const [z, setZ] = useState<Zero<Schema> | undefined>();
  useEffect(() => zeroRef.onChange(z => setZ(z)), []);

  if (!z) {
    return null;
  }

  return (
    <ZeroProvider zero={z}>
      <BrowserRouter>
        <ScrollRestoration />
        <div className="app-container flex p-8">
          <div className="primary-nav w-48 shrink-0 grow-0">
            <Nav />
          </div>
          <div className="primary-content">
            <Routes>
              <Route path="/" Component={ListPage} />
              <Route path="/issue/:id" Component={IssuePage} />
              <Route Component={ErrorPage} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ZeroProvider>
  );
}
