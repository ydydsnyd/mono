import {useIsomorphicLayoutEffect} from '@/hooks/use-isomorphic-layout-effect';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';
import {Cursor} from './Cursor';

export function CursorField({
  r,
  clientIDs,
}: {
  r: Reflect<M>;
  clientIDs: string[];
}) {
  useIsomorphicLayoutEffect(() => {
    const handlePointerMove = async (e: PointerEvent) => {
      const coord = {x: e.pageX, y: e.pageY};
      const cid = await r.clientID;
      await r.mutate.updateClient({
        id: cid,
        ...coord,
      });
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  });

  return (
    <div id="cursor-field">
      {[...clientIDs].map(cid => (
        <Cursor key={cid} r={r} clientID={cid} />
      ))}
    </div>
  );
}
