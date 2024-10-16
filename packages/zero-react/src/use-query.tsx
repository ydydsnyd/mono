import {useLayoutEffect, useState} from 'react';
import {deepClone} from '../../shared/src/deep-clone.js';
import type {
  Query,
  QueryImpl,
  QueryType,
  Smash,
  TableSchema,
  TypedView,
} from '../../zero-client/src/mod.js';

export function useQuery<
  TSchema extends TableSchema,
  TReturn extends QueryType,
>(q: Query<TSchema, TReturn>, enable: boolean = true): Smash<TReturn> {
  return useQueryWithStatus(q, enable).snapshot;
}

export function useQueryWithStatus<
  TSchema extends TableSchema,
  TReturn extends QueryType,
>(
  q: Query<TSchema, TReturn>,
  enable: boolean = true,
): {
  snapshot: Smash<TReturn>;
  status: 'partial' | 'complete';
} {
  // TODO: Consider exposing singular on Query? The motivation is that we do not
  // want to export QueryImpl.
  const queryImpl = q as QueryImpl<TSchema, TReturn>;

  const [snapshot, setSnapshot] = useState<Smash<TReturn>>(
    (queryImpl.singular ? undefined : []) as unknown as Smash<TReturn>,
  );
  const [, setView] = useState<TypedView<Smash<TReturn>> | undefined>(
    undefined,
  );
  const [status, setStatus] = useState<'partial' | 'complete'>('partial');

  useLayoutEffect(() => {
    if (enable) {
      const [view, status] = q.materializeWithStatus();
      setView(view);
      let disposed = false;
      status
        .then(() => {
          if (!disposed) {
            setStatus('complete');
          }
        })
        .catch(err => {
          console.error(err);
        });
      const unsubscribe = view.addListener(snap => {
        // snapshot can contain `undefined`
        setSnapshot(
          (snap === undefined ? snap : deepClone(snap)) as Smash<TReturn>,
        );
      });
      view.hydrate();
      return () => {
        disposed = true;
        unsubscribe();
        view.destroy();
      };
    }
    setSnapshot(
      (queryImpl.singular ? undefined : []) as unknown as Smash<TReturn>,
    );
    setView(undefined);
    return () => {
      //
    };
  }, [
    JSON.stringify(
      enable ? (q as unknown as QueryImpl<never, never>).ast : null,
    ),
  ]);

  return {
    status,
    snapshot,
  };
}
