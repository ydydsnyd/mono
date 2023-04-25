import {useEffect, useState} from 'react';
import {Cursor} from './Cursor';
import {Rect, Size, positionToCoordinate} from './util';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';

export function CursorField({
  home,
  stage,
  screenSize,
  r,
  // TODO(reflect): Make clientID synchronous
  myClientID,
}: {
  home: Rect;
  stage: Rect;
  screenSize: Size;
  r: Reflect<M>;
  myClientID: string;
}) {
  const [clientIDs, setClientIDs] = useState<Set<string>>(new Set());
  const prefix = 'client/';

  // TODO(reflect): we probably want something like this built in!
  useEffect(() => {
    return r.experimentalWatch(
      diff => {
        setClientIDs(v => {
          const newVal = new Set(v);
          for (const change of diff) {
            if (change.op === 'add') {
              newVal.add(change.key.substring(prefix.length));
            } else if (change.op === 'del') {
              newVal.delete(change.key.substring(prefix.length));
            }
          }
          return newVal;
        });
      },
      {
        prefix,
        initialValuesInFirstDiff: true,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const coord = positionToCoordinate(
        {x: e.pageX, y: e.pageY},
        home,
        screenSize,
      );
      r.clientID.then(cid => {
        r.mutate.updateClient({
          id: cid,
          ...coord,
        });
      });
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  });

  return (
    <div>
      {[...clientIDs].map(cid => (
        <Cursor
          key={cid}
          r={r}
          clientID={cid}
          isSelf={cid == myClientID}
          home={home}
          stage={stage}
          screenSize={screenSize}
        />
      ))}
    </div>
  );
}
