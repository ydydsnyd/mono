import {Piece} from './Piece';
import {
  Position,
  Rect,
  Size,
  coordinateToPosition,
  positionToCoordinate,
} from './util';
import {PieceModel, listPieces} from './piece-model';
import {useSubscribe} from 'replicache-react';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';
import {useEffect, useRef} from 'react';
import {PIECE_DEFINITIONS} from './piece-definitions';

export function Puzzle({
  r,
  home,
  stage,
  screenSize,
}: {
  r: Reflect<M>;
  home: Rect;
  stage: Rect;
  screenSize: Size;
}) {
  const pieces = useSubscribe(r, listPieces, []);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(
    new Map<number, {pieceID: string; offset: Position}>(),
  );

  useEffect(() => {
    window.addEventListener('mousemove', e => {
      if (e.buttons === 0) {
        return;
      }
      /*
      const elm = document.createElement('div');
      elm.style.position = 'absolute';
      elm.style.left = e.pageX - 2 + 'px';
      elm.style.top = e.pageY - 2 + 'px';
      elm.style.width = '4px';
      elm.style.height = '4px';
      elm.style.backgroundColor = 'red';
      elm.style.pointerEvents = 'none';
      elm.style.zIndex = '1';
      elm.style.opacity = '0.3';
      document.body.appendChild(elm);
      */
    });
  }, []);

  const handlePiecePointerDown = (
    model: PieceModel,
    event: React.PointerEvent,
    piecePos: Position,
  ) => {
    ref.current!.setPointerCapture(event.pointerId);
    dragging.current.set(event.pointerId, {
      pieceID: model.id,
      offset: {
        x: event.pageX - piecePos.x,
        y: event.pageY - piecePos.y,
      },
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dragInfo = dragging.current.get(e.pointerId);
    if (!dragInfo) {
      return;
    }

    /*
    const elm = document.createElement('div');
    elm.style.position = 'absolute';
    elm.style.left = e.pageX - 1 + 'px';
    elm.style.top = e.pageY - 1 + 'px';
    elm.style.width = '2px';
    elm.style.height = '2px';
    elm.style.backgroundColor = 'green';
    elm.style.zIndex = '2';
    elm.style.opacity = '0.2';
    elm.style.pointerEvents = 'none';
    document.body.appendChild(elm);
    */

    const piece = pieces.find(p => p.id === dragInfo.pieceID);
    if (!piece) {
      throw new Error(`Piece ${dragInfo.pieceID} not found`);
    }

    const def = PIECE_DEFINITIONS[parseInt(piece.id)];

    const pos = {
      x: e.pageX - dragInfo.offset.x,
      y: e.pageY - dragInfo.offset.y,
    };

    if (pos.x < stage.x) {
      pos.x = stage.x;
    }
    if (pos.y < stage.y) {
      pos.y = stage.y;
    }
    if (pos.x + def.width > stage.right()) {
      pos.x = stage.right() - def.width;
    }
    if (pos.y + def.height > stage.bottom()) {
      pos.y = stage.bottom() - def.height;
    }

    const coordinate = positionToCoordinate(pos, home, screenSize);
    r.mutate.movePiece({id: piece.id, coordinate});
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
            onPointerDown={e => handlePiecePointerDown(model, e, pos)}
          />
        );
      })}
    </div>
  );
}
