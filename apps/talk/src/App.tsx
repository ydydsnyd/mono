/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as SQLite from 'wa-sqlite';
import SQLiteESMFactory from 'wa-sqlite/dist/wa-sqlite.mjs';
// @ts-ignore
import {useState} from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
// @ts-ignore
import {createTag} from 'wa-sqlite/src/examples/tag.js';

import {EntityQuery} from 'zql/src/zql/query/entity-query.js';
import {TestContext} from 'zql/src/zql/context/test-context.js';
import * as agg from 'zql/src/zql/query/agg.js';

const wasmModule = await SQLiteESMFactory();
const sqlite3 = SQLite.Factory(wasmModule);
const db = await sqlite3.open_v2(':memory:'); // memory for fairness?

const sql = createTag(sqlite3, db);
// @ts-ignore
window.sql = sql;

async function measure(cb: <T>() => Promise<T>) {
  const start = performance.now();
  const ret = await cb();
  const end = performance.now();
  return [(end - start).toFixed(6) + 'ms', ret];
}
// @ts-ignore
window.measure = measure;

async function runSqliteStmt(stmt: number) {
  const ret = [];
  let rc = SQLite.SQLITE_DONE;
  while ((rc = await sqlite3.step(stmt)) === SQLite.SQLITE_ROW) {
    ret.push(sqlite3.row(stmt));
  }
  sqlite3.reset(stmt);
  if (rc !== SQLite.SQLITE_DONE) {
    throw new Error(`Unexpected rc: ${rc}`);
  }
  return ret;
}

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

const context = new TestContext();
const issueSource = context.getSource<Issue>('issue');
const labelSource = context.getSource<Label>('label');
const issueLabelSource = context.getSource<IssueLabel>('issueLabel');

const issueQuery = new EntityQuery<{issue: Issue}>(context, 'issue');
const labelQuery = new EntityQuery<{label: Label}>(context, 'label');
const issueLabelQuery = new EntityQuery<{issueLabel: IssueLabel}>(
  context,
  'issueLabel',
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const zql = async function (q: any) {
  const stmt = q.prepare();
  const ret = await stmt.exec();
  stmt.destroy();
  return ret;
};
zql.setIssue = (issue: Issue) => {
  context.materialite.tx(() => {
    issueSource.add(issue);
  });
};

// @ts-ignore
window.issueQuery = issueQuery;
// @ts-ignore
window.labelQuery = labelQuery;
// @ts-ignore
window.issueLabelQuery = issueLabelQuery;
// @ts-ignore
window.agg = agg;
// @ts-ignore
window.zql = zql;

function makeId(num: number) {
  return num.toString().padStart(6, '0');
}

// @ts-ignore
window.makeId = makeId;

await makeData();

const writeIssueStmt = await prepare(
  db,
  `INSERT INTO issue (
  id,
  title,
  created,
  modified
) VALUES (?, ?, ?, ?)`,
);

const sqlite = {
  prepare: (sql: string) => prepare(db, sql),
  run: runSqliteStmt,
  sqlite3,
  setIssue: async (issue: Issue) => {
    sqlite3.bind_text(writeIssueStmt, 1, issue.id);
    sqlite3.bind_text(writeIssueStmt, 2, issue.title);
    sqlite3.bind_int64(writeIssueStmt, 3, BigInt(issue.created));
    sqlite3.bind_int64(writeIssueStmt, 4, BigInt(issue.modified));
    await sqlite3.step(writeIssueStmt);
    await sqlite3.reset(writeIssueStmt);
  },
};

// @ts-ignore
window.sqlite = sqlite;

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
  let c = 0;
  for (const issue of issues) {
    const numLabels = ++c % 3;
    for (let i = 0; i < numLabels; ++i) {
      issueLabels.push({
        id: makeId(++x),
        issueId: issue.id,
        labelId: makeId(i),
      });
    }
  }

  makeSqliteData(issues, labels, issueLabels);

  context.materialite.tx(() => {
    for (const issue of issues) {
      issueSource.add(issue);
    }
    for (const label of labels) {
      labelSource.add(label);
    }
    for (const issueLabel of issueLabels) {
      issueLabelSource.add(issueLabel);
    }
  });

  await warmUpZQL();
}

async function makeSqliteData(
  issues: Issue[],
  labels: Label[],
  issueLabels: IssueLabel[],
) {
  await sql`
  CREATE TABLE issue (
    id TEXT PRIMARY KEY,
    title TEXT,
    body TEXT,
    created INT,
    modified INT
  );
  CREATE INDEX issue_modified ON issue(modified);

  CREATE TABLE issueLabel (
    issueId TEXT,
    labelId TEXT,
    PRIMARY KEY (issueId, labelId)
  );

  CREATE TABLE label (
    id TEXT PRIMARY KEY,
    "name" TEXT
  );
  `;

  const begin = await prepare(db, 'BEGIN');
  const commit = await prepare(db, 'COMMIT');
  const insertIssue = await prepare(
    db,
    /*sql*/ `INSERT INTO issue (id, title, body, created, modified) VALUES (?, ?, ?, ?, ?)`,
  );
  const insertIssueLabel = await prepare(
    db,
    /*sql*/ `INSERT INTO issueLabel (issueId, labelId) VALUES (?, ?)`,
  );
  const insertLabel = await prepare(
    db,
    /*sql*/ `INSERT INTO label (id, "name") VALUES (?, ?)`,
  );

  await sqlite3.step(begin);
  for (const issue of issues) {
    sqlite3.bind_text(insertIssue, 1, issue.id);
    sqlite3.bind_text(insertIssue, 2, issue.title);
    sqlite3.bind_text(insertIssue, 3, issue.body);
    sqlite3.bind_int64(insertIssue, 4, BigInt(issue.created));
    sqlite3.bind_int64(insertIssue, 5, BigInt(issue.modified));
    await sqlite3.step(insertIssue);
    await sqlite3.reset(insertIssue);
  }
  for (const label of labels) {
    sqlite3.bind_text(insertLabel, 1, label.id);
    sqlite3.bind_text(insertLabel, 2, label.name);
    await sqlite3.step(insertLabel);
    await sqlite3.reset(insertLabel);
  }
  for (const issueLabel of issueLabels) {
    sqlite3.bind_text(insertIssueLabel, 1, issueLabel.issueId);
    sqlite3.bind_text(insertIssueLabel, 2, issueLabel.labelId);
    await sqlite3.step(insertIssueLabel);
    await sqlite3.reset(insertIssueLabel);
  }
  await sqlite3.step(commit);

  sqlite3.finalize(insertIssue);
  sqlite3.finalize(insertIssueLabel);
  sqlite3.finalize(insertLabel);
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

async function warmUpZQL() {
  const stmt = issueQuery
    .leftJoin(issueLabelQuery, 'issueLabel', 'issue.id', 'issueLabel.issueId')
    .leftJoin(labelQuery, 'label', 'issueLabel.labelId', 'label.id')
    .groupBy('issue.id')
    .orderBy('issue.modified', 'asc')
    .select('*', agg.array('label.name', 'labels'))
    .limit(100)
    .prepare();
  await stmt.exec();
  stmt.destroy();
}
