import {useEffect} from 'react';
import {Cursor} from './Cursor';
import {Rect, Size, positionToCoordinate} from './util';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';

export function CursorField({
  home,
  stage,
  docSize,
  r,
  clientIDs,
  // TODO(reflect): Make clientID synchronous
  myClientID,
}: {
  home: Rect;
  stage: Rect;
  docSize: Size;
  r: Reflect<M>;
  clientIDs: string[];
  myClientID: string;
}) {
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const coord = positionToCoordinate({x: e.pageX, y: e.pageY}, home, stage);
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
    <div
      id="cursor-field"
      style={{
        height: docSize.height,
      }}
    >
      {[...clientIDs].map(cid => (
        <Cursor
          key={cid}
          r={r}
          clientID={cid}
          isSelf={cid == myClientID}
          home={home}
          stage={stage}
        />
      ))}
    </div>
  );
}
