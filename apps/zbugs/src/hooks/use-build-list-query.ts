import {useQuery, useZero} from '@rocicorp/zero/react';
import {type Schema} from '../domain/schema.js';

export function useBuildListQuery(
  params: URLSearchParams,
  direction: 'asc' | 'desc' = 'desc',
) {
  const status = params.get('status')?.toLowerCase();
  const creator = params.get('creator');
  const assignee = params.get('assignee');
  const labels = params.getAll('label');

  const z = useZero<Schema>();
  // TODO: this can go away once we have filter-by-subquery, you should be able
  // to filter by label.name directly.
  const creatorID = useQuery(
    z.query.user.where('login', creator ?? '').one(),
    creator !== null,
  )?.id;
  const assigneeID = useQuery(
    z.query.user.where('login', assignee ?? '').one(),
    assignee !== null,
  )?.id;
  const labelIDs = useQuery(z.query.label.where('name', 'IN', labels));

  let q = z.query.issue
    .related('labels')
    .orderBy('modified', direction)
    .orderBy('id', direction);

  if (status === 'open') {
    q = q.where('open', true);
  } else if (status === 'closed') {
    q = q.where('open', false);
  }

  if (creatorID) {
    q = q.where('creatorID', creatorID);
  }

  if (assigneeID) {
    q = q.where('assigneeID', assigneeID);
  }

  for (const labelID of labelIDs) {
    q = q.where('labelIDs', 'LIKE', `%${labelID.id}%`);
  }

  return q;
}
