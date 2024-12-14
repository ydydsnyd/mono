import {escapeLike} from '@rocicorp/zero';
import {useQuery} from '@rocicorp/zero/react';
import {useEffect, useMemo, useState} from 'react';
import {useSearch} from 'wouter';
import {useZero} from '../../hooks/use-zero.js';

export function ListPage() {
  const z = useZero();
  const search = useSearch();
  const qs = useMemo(() => new URLSearchParams(search), [search]);

  const status = qs.get('status')?.toLowerCase() ?? 'open';
  const creator = qs.get('creator') ?? undefined;

  const textFilterQuery = qs.get('q');
  const [textFilter, setTextFilter] = useState(textFilterQuery);
  useEffect(() => {
    setTextFilter(textFilterQuery);
  }, [textFilterQuery]);

  const sortDirection =
    qs.get('sortDir')?.toLowerCase() === 'asc' ? 'asc' : 'desc';

  const open =
    status === 'open' ? true : status === 'closed' ? false : undefined;

  let q = z.query.issue
    .orderBy('modified', sortDirection)
    .related('labels')
    .related('assignee', c => c.one())
    .related('viewState', q => q.where('userID', z.userID).one());

  if (open !== undefined) {
    q = q.where('open', open);
  }

  if (creator) {
    q = q.whereExists('creator', q => q.where('login', creator));
  }

  if (textFilter) {
    q = q.where(({or, cmp}) =>
      or(
        cmp('title', 'ILIKE', `%${escapeLike(textFilter)}%`),
        cmp('description', 'ILIKE', `%${escapeLike(textFilter)}%`),
      ),
    );
  }

  const [issues] = useQuery(q);

  return (
    <div>
      {issues.map(issue => {
        return (
          <div key={issue.id}>
            <span className="title">{issue.title}</span>
            <span className="assignee">
              {issue.assignee?.login ?? 'unassigned'}
            </span>
            <div className="labels">
              {issue.labels.map(label => (
                <span key={label.id} className="label">
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
