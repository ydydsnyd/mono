import {Zero} from 'zero-client';
import {User} from './user';
import {Item} from './item';

export const zero = new Zero({
  server: import.meta.env.VITE_ZERO_URL,
  userID: 'anon',
  kvStore: 'idb',
  queries: {
    user: v => v as User,
    item: v => v as Item,
  },
});
