import {Piece} from './Piece';
import {
  BoundingBox,
  Size,
  coordinateToPosition,
  positionToCoordinate,
} from './util';
import {PieceModel, listPieces} from './piece-model';
import {useSubscribe} from 'replicache-react';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';
import {useRef} from 'react';

export function Puzzle({
  r,
  home,
  screenSize,
}: {
  r: Reflect<M>;
  home: BoundingBox;
  screenSize: Size;
}) {
  const pieces = useSubscribe(r, listPieces, []);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(new Map<number, string>());

  /*
  useEffect(() => {
    window.addEventListener('mousemove', e => {
      if (e.buttons === 0) {
        return;
      }
      const elm = document.createElement('div');
      elm.style.position = 'absolute';
      elm.style.left = e.pageX - 8 + 'px';
      elm.style.top = e.pageY - 8 + 'px';
      elm.style.width = '16px';
      elm.style.height = '16px';
      elm.style.backgroundColor = 'red';
      elm.style.pointerEvents = 'none';
      elm.style.zIndex = '1';
      document.body.appendChild(elm);
    });
  }, []);
  */

  const handlePiecePointerDown = (
    model: PieceModel,
    event: React.PointerEvent,
  ) => {
    ref.current!.setPointerCapture(event.pointerId);
    dragging.current.set(event.pointerId, model.id);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const pieceID = dragging.current.get(e.pointerId);
    if (!pieceID) {
      return;
    }

    /*
    const elm = document.createElement('div');
    elm.style.position = 'absolute';
    elm.style.left = e.pageX - 5 + 'px';
    elm.style.top = e.pageY - 5 + 'px';
    elm.style.width = '10px';
    elm.style.height = '10px';
    elm.style.backgroundColor = 'green';
    elm.style.zIndex = '2';
    document.body.appendChild(elm);
    */

    const piece = pieces.find(p => p.id === pieceID);
    if (!piece) {
      throw new Error(`Piece ${pieceID} not found`);
    }

    const pos = coordinateToPosition(piece, home, screenSize);
    pos.x += e.movementX;
    pos.y += e.movementY;

    const coordinate = positionToCoordinate(pos, home, screenSize);
    r.mutate.movePiece({id: pieceID, coordinate});
  };

  const handleLostPointerCapture = (e: React.PointerEvent) => {
    dragging.current.delete(e.pointerId);
  };

  return (
    <div
      ref={ref}
      onPointerMove={e => handlePointerMove(e)}
      onLostPointerCapture={e => handleLostPointerCapture(e)}
    >
      {pieces.map(model => {
        const pos = coordinateToPosition(model, home, screenSize);
        return (
          <Piece
            key={model.id}
            piece={{
              ...model,
              ...pos,
            }}
            onPointerDown={e => handlePiecePointerDown(model, e)}
          />
        );
      })}
    </div>
  );
}
