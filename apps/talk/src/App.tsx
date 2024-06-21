import * as SQLite from 'wa-sqlite';
import SQLiteAsyncESMFactory from 'wa-sqlite/dist/wa-sqlite-async.mjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {IDBBatchAtomicVFS} from 'wa-sqlite/src/examples/IDBBatchAtomicVFS.js';
import {useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {createTag} from 'wa-sqlite/src/examples/tag.js';

const wasmModule = await SQLiteAsyncESMFactory();
const sqlite3 = SQLite.Factory(wasmModule);
sqlite3.vfs_register(
  new IDBBatchAtomicVFS('idb-batch-atomic', {durability: 'relaxed'}),
);
const db = await sqlite3.open_v2('test-db');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.sql = createTag(sqlite3, db);

type Issue = {
  id: string;
  title: string;
  body: string;
  created: number;
  modified: number;
};

type IssueLabel = {
  id: string;
  issueId: string;
  labelId: string;
};

type Label = {
  id: string;
  name: string;
};

function makeId(num: number) {
  return num.toString().padStart(6, '0');
}

const madeData = localStorage.getItem('made-data');
if (madeData == null) {
  makeData();
}

async function makeData() {
  const issues = Array.from({length: 10_000}, (_, i) => {
    return {
      id: makeId(i),
      title: `Issue ${i}`,
      body: `Body of issue ${i}`,
      created: Date.now() + i * 100,
      modified: Date.now() + i * 100,
    };
  });
  const labels = Array.from({length: 10}, (_, i) => {
    return {
      id: makeId(i),
      name: `Label ${i}`,
    };
  });
  const issueLabels: IssueLabel[] = [];
  let x = 0;
  for (const issue of issues) {
    const numLabels = Math.floor(Math.random() * 4);
    for (let i = 0; i < numLabels; ++i) {
      issueLabels.push({
        id: makeId(++x),
        issueId: issue.id,
        labelId: makeId(i),
      });
    }
  }

  // start a tx, write to sqlite
  const begin = await prepare(db, 'BEGIN');
  const commit = await prepare(db, 'COMMIT');
  // start a tx, write to store
}

async function prepare(db: number, sql: string) {
  return (await sqlite3.statements(db, sql)[Symbol.asyncIterator]().next())
    .value as number;
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
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
        <button onClick={() => setCount(count => count + 1)}>
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
