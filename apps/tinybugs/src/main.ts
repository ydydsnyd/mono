import {Zero} from '@rocicorp/zero';
import {schema} from './schema.js';
import {mark} from './perf-log.js';

mark('new zero');
const z = new Zero({
  logLevel: 'info',
  server:
    import.meta.env.VITE_PUBLIC_SERVER ??
    'https://zero-service-accel.reflect-server.net/',
  // 'http://a8148ad0a4659f6f6.awsglobalaccelerator.com/',
  // 'https://zero-service.reflect-server.net/',
  userID: 'anon',
  schema,
});
mark('zero created');

// get the number of issues to load from the query string
const qs = new URLSearchParams(window.location.search);
const limit = parseInt(qs.get('limit') ?? '10000', 10);
const includeComments = qs.get('comments') === 'true';

let q = z.query.issue.limit(limit);
if (includeComments) {
  q = q.related('comments', q => q.limit(10));
}
const issues = q.materialize();

issues.hydrate();
issues.addListener(data => {
  mark('issue data loaded');
  (document.getElementById('txt') as HTMLTextAreaElement).value =
    JSON.stringify(data);
});
