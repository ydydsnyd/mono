import {useReducer} from 'react';

import {useSubscribe} from 'replicache-react';
import type {ReadTransaction, Reflect} from '@rocicorp/reflect';
import {M, getServerLogs} from '@/demo/shared/mutators';

export function useCount(
  reflect: Reflect<M>,
  key: string,
  clog: (key: string, val: string, tx: ReadTransaction) => void,
) {
  return useSubscribe(
    reflect,
    async (tx: ReadTransaction) => {
      const count = (await tx.get(key)) as string;
      if (count) {
        clog(key, count, tx);
      }
    },
    null,
  );
}

export function useServerLogs(reflect: Reflect<M>) {
  return useSubscribe(reflect, async tx => await getServerLogs(tx), []);
}

export function useClientConsoleReducer(initialState: string[] = []) {
  return useReducer(
    (state: string[], action: string) => [...state, action],
    initialState,
  );
}
