import {useReducer} from 'react';

import {M, getServerLogs} from '@/demo/shared/mutators';
import type {ReadTransaction, Reflect} from '@rocicorp/reflect';
import {useSubscribe} from 'replicache-react';

export function useCount(
  reflect: Reflect<M>,
  key: string,
  clog: (key: string, val: number) => void,
) {
  return useSubscribe(
    reflect,
    async (tx: ReadTransaction) => {
      const count = (await tx.get(key)) as number | undefined;
      if (!count) {
        return 0;
      }
      clog(key, count);
      return count;
    },
    null,
  );
}

export function useServerLogs(reflect: Reflect<M>) {
  return useSubscribe(reflect, async tx => await getServerLogs(tx), []);
}

export type ConsoleAction = {type: 'APPEND'; payload: string} | {type: 'CLEAR'};

export function useClientConsoleReducer(initialState: string[] = []) {
  return useReducer((state: string[], action: ConsoleAction) => {
    switch (action.type) {
      case 'APPEND': {
        // We only display 5 lines of console output.
        const newState = state.slice(-4);
        newState.push(action.payload);
        return newState;
      }
      case 'CLEAR':
        return [];
      default:
        return state;
    }
  }, initialState);
}
