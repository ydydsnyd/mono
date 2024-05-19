import {useRef} from 'react';
import {User} from '../user';
import {zero} from '../zero';
import {useQuery} from './use-zql';

export function useUser(): User | null {
  const userNames = [
    'pg',
    'linus_torvalds',
    'stevewoz',
    'norvig',
    'BrendanEich',
    'alankay1',
  ];
  const idx = useRef(Math.floor(Math.random() * userNames.length));
  const users = useQuery(
    zero.query.user.select('id', 'name').where('name', 'IN', userNames),
  );
  if (users.length === 0) {
    return null;
  }
  return users[idx.current];
}
