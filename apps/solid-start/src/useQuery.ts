import {Accessor, createMemo, onCleanup} from 'solid-js';
import {Query, QueryType, Smash, TableSchema} from '@rocicorp/zero';

export function useQuery<
  TSchema extends TableSchema,
  TReturn extends QueryType,
>(querySignal: () => Query<TSchema, TReturn>): Accessor<Smash<TReturn>> {
  return createMemo(() => {
    const query = querySignal();
    const view = query.materializeSolid();

    onCleanup(() => {
      view.destroy();
    });

    view.hydrate();
    return view.data;
  });
}
