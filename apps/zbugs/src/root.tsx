import {Route, Switch} from 'wouter';
import ListPage from './pages/list/list-page.js';
import IssuePage from './pages/issue/issue-page.js';
import ErrorPage from './pages/error/error-page.js';
import {Nav} from './components/nav.js';
import {useLogin} from './hooks/use-login.js';
import {ZeroProvider} from 'zero-react/src/use-zero.js';
import {type Schema, schema} from './domain/schema.js';
import {Zero} from 'zero-client';
import {useEffect, useMemo} from 'react';

export default function Root() {
  const login = useLogin();

  const z = useMemo(
    () =>
      new Zero({
        logLevel: 'info',
        server: import.meta.env.VITE_PUBLIC_SERVER,
        userID: login.loginState?.userID ?? 'anon',
        auth: login.loginState?.token,
        schema,
      }),
    [login],
  );

  useEffect(() => {
    // To enable accessing zero in the devtools easily.
    (window as {z?: Zero<Schema>}).z = z;
    return () => {
      z.close();
    };
  }, [z]);

  z.query.user.preload();
  z.query.label.preload();

  z.query.issue
    .related('creator')
    .related('labels')
    .related('comments', c => c.limit(10).related('creator'))
    .orderBy('modified', 'desc')
    .preload();

  return (
    <ZeroProvider zero={z}>
      <div className="app-container flex p-8">
        <div className="primary-nav w-48 shrink-0 grow-0">
          <Nav />
        </div>
        <div className="primary-content">
          <Switch>
            <Route path="/" component={ListPage} />
            <Route path="/issue/:id" component={IssuePage} />
            <Route component={ErrorPage} />
          </Switch>
        </div>
      </div>
    </ZeroProvider>
  );
}
