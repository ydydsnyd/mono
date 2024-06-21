```ts
measure(
  () =>
    sql`SELECT issue.*, json_group_array(label.name) FROM issue LEFT JOIN issueLabel ON issueLabel.issueId = issue.id LEFT JOIN label ON issueLabel.labelId = label.id GROUP BY issue.id ORDER BY issue.modified ASC LIMIT 100`,
);
```

```ts
const stmt = issueQuery
  .leftJoin(issueLabelQuery, 'issueLabel', 'issue.id', 'issueLabel.issueId')
  .leftJoin(labelQuery, 'label', 'issueLabel.labelId', 'label.id')
  .groupBy('issue.id')
  .select('*', agg.array());

measure(() => stmt.exec());
```

- insert stuff
- delete stuff
- modify stuff
