import {useQuery} from '@rocicorp/zero/react';
import {memo, useEffect, useMemo, useState} from 'react';
import {type UserRow} from '../../schema.js';
import avatarIcon from '../assets/icons/avatar-default.svg';
import {useZero} from '../hooks/use-zero.js';
import {Combobox} from './combobox.js';

type Props = {
  onSelect?: ((user: UserRow | undefined) => void) | undefined;
  selected?: {login?: string | undefined} | undefined;
  disabled?: boolean | undefined;
  unselectedLabel?: string | undefined;
  placeholder?: string | undefined;
};

export const UserPicker = memo(
  ({onSelect, selected, disabled, unselectedLabel, placeholder}: Props) => {
    const z = useZero();

    const [unsortedUsers] = useQuery(z.query.user);
    // TODO: Support case-insensitive sorting in ZQL.
    const users = useMemo(
      () => unsortedUsers.toSorted((a, b) => a.login.localeCompare(b.login)),
      [unsortedUsers],
    );

    // Preload the avatar icons so they show up instantly when opening the
    // dropdown.
    const [avatars, setAvatars] = useState<Record<string, string>>({});
    useEffect(() => {
      let canceled = false;
      async function preload() {
        const avatars = await Promise.all(users.map(c => preloadAvatar(c)));
        if (canceled) {
          return;
        }
        setAvatars(Object.fromEntries(avatars));
      }
      void preload();
      return () => {
        canceled = true;
      };
    }, [users]);

    const handleSelect = (user: UserRow | undefined) => {
      onSelect?.(user);
    };

    const selectedUser =
      selected && users.find(u => u.login === selected.login);

    const unselectedItem = {
      text: unselectedLabel ?? 'Select',
      icon: avatarIcon,
      value: undefined,
    };
    const defaultItem = {
      text: placeholder ?? 'Select a user...',
      icon: avatarIcon,
      value: undefined,
    };

    return (
      <Combobox
        disabled={disabled}
        onChange={c => handleSelect(c)}
        items={[
          unselectedItem,
          ...users.map(u => ({
            text: u.login,
            value: u,
            icon: avatars[u.id],
          })),
        ]}
        defaultItem={defaultItem}
        selectedValue={selectedUser ?? undefined}
        className="user-picker"
      />
    );
  },
);

function preloadAvatar(user: UserRow): Promise<[string, string]> {
  return new Promise<[string, string]>((res, rej) => {
    fetch(user.avatar)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          res([user.id, reader.result as string]);
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        rej('Error fetching the image: ' + err);
      });
  });
}
