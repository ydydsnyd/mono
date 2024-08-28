import {bench} from 'vitest';
import {TableSource} from './table-source.js';
import Database from 'better-sqlite3';
import {Take} from 'zql/src/zql/ivm2/take.js';
import {MemoryStorage} from 'zql/src/zql/ivm2/memory-storage.js';

const db = new Database(
  '/Users/aa/work/mono/packages/zqlite/src/v2/rocinante.bugs',
  {readonly: true},
);
const source = new TableSource(
  db,
  'issue',
  {
    id: 'string',
    title: 'string',
    priority: 'number',
    status: 'number',
    modified: 'number',
    created: 'number',
    creatorID: 'string',
    kanbanOrder: 'string',
    description: 'string',
  },
  ['id'],
);
const input = source.connect([['id', 'asc']]);
const storage = new MemoryStorage();
const take = new Take(input, storage, 10_000, undefined);

bench('normal', () => {
  console.profile('bonk');
  for (const row of take.fetch({})) {
    void row;
  }
  console.profileEnd('bonk');
});
