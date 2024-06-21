```ts
stmt = issueQuery
  .leftJoin(issueLabelQuery, 'issueLabel', 'issue.id', 'issueLabel.issueId')
  .leftJoin(labelQuery, 'label', 'issueLabel.labelId', 'label.id')
  .groupBy('issue.id')
  .orderBy('issue.modified', 'asc')
  .select('*', agg.array('label.name', 'labels'))
  .limit(100)
  .prepare();

measure(() => stmt.exec());

read = await sqlite.prepare(
  `SELECT issue.*, json_group_array(label.name) FROM issue LEFT JOIN issueLabel ON issueLabel.issueId = issue.id LEFT JOIN label ON issueLabel.labelId = label.id GROUP BY issue.id ORDER BY issue.modified ASC LIMIT 100`,
);

await measure(() => sqlite.run(read));

read2 = await sqlite.prepare(
  `SELECT issue.*, (
    SELECT json_group_array(label.name)
      FROM issueLabel JOIN label ON issueLabel.labelId = label.id
      WHERE issueLabel.issueId = issue.id
  ) FROM issue ORDER BY issue.modified ASC LIMIT 100`,
);

await measure(() => sqlite.run(read2));

async function sqliteWriteThenRead() {
  const results = [];
  for (let i = 0; i < 1_000; ++i) {
    sqlite.setIssue({
      id: makeId(i + 10_000),
      title: `Issue ${i + 10_000}`,
      created: i,
      modified: i,
    });
    results.push(await sqlite.run(read2));
  }
  return results;
}

await measure(sqliteWriteThenRead);

async function zqlWriteThenRead() {
  const results = [];
  for (let i = 0; i < 1_000; ++i) {
    zql.setIssue({
      id: makeId(i + 10_000),
      title: `Issue ${i + 10_000}`,
      created: i,
      modified: i,
    });
    results.push(await stmt.exec());
  }
  return results;
}

await measure(zqlWriteThenRead);
```

- insert stuff
- delete stuff
- modify stuff
