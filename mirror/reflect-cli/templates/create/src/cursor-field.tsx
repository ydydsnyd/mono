// This file implements the UI for the flying cursors.
//
// The CursorField component subscribes to only the list of client IDs, so that
// it only re-renders when a cursor is added or removed. Each individual cursor
// subscribes to its own data directly from Reflect.
//
// Despite the fact that Reflect mutators and subscriptions are marked `async`,
// they almost always complete in the same microtask (so same frame). The async
// is only there to support slower initial load from local storage.

import {Reflect} from '@rocicorp/reflect/client';
import {usePresence} from '@rocicorp/reflect/react';
import {useEffect} from 'react';
import styles from './cursor-field.module.css';
import {M} from './mutators.js';
import {useClientState} from './subscriptions.js';

export default function CursorField({r}: {r: Reflect<M>}) {
  useEffect(() => {
    const handler = ({pageX, pageY}: {pageX: number; pageY: number}) => {
      void r.mutate.setCursor({
        x: pageX,
        y: pageY,
      });
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const clientStateIDs = usePresence(r);

  return (
    <>
      {clientStateIDs.map(clientID => (
        <Cursor r={r} clientID={clientID} key={clientID} />
      ))}
    </>
  );
}

function Cursor({r, clientID}: {r: Reflect<M>; clientID: string}) {
  const cs = useClientState(r, clientID);
  if (!cs) return null;

  const {cursor, userInfo} = cs;
  if (!cursor) return null;

  return (
    <div key={clientID} className={styles.collaborator}>
      <div
        className={styles.cursor}
        style={{
          left: cursor.x,
          top: cursor.y,
          overflow: 'auto',
        }}
      >
        <div className={styles.pointer} style={{color: userInfo.color}}>
          ➤
        </div>
        <div
          className={styles.userinfo}
          style={{
            backgroundColor: userInfo.color,
            color: 'white',
          }}
        >
          {userInfo.avatar}&nbsp;{userInfo.name}
        </div>
      </div>
    </div>
  );
}
