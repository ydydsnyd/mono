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
import {useEffect, useRef, useState} from 'react';
import {PIECE_DEFINITIONS} from './piece-definitions';
import {ClientModel, listClients} from './client-model';
import type {PieceInfo} from './piece-info';

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
  const {pieces, myClient} = useSubscribe<{
    pieces: Record<string, PieceInfo>;
    myClient: ClientModel | null;
  }>(
    r,
    async tx => {
      const lp = await listPieces(tx);
      const mp: Record<string, PieceInfo> = {};
      for (const piece of lp) {
        mp[piece.id] = {
          ...piece,
          selector: null,
        };
      }
      const lc = await listClients(tx);
      const mc: Record<string, ClientModel> = {};
      for (const client of lc) {
        mc[client.id] = client;
        if (client.selectedPieceID) {
          mp[client.selectedPieceID].selector = client.id;
        }
      }
      return {pieces: mp, myClient: mc[await r.clientID]};
    },
    {pieces: {}, myClient: null},
  );

  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(
    new Map<number, {pieceID: string; offset: Position}>(),
  );

  // The desired selection logic we're going for here is surprisingly subtle.
  //
  // A piece can be 'active', which means that it is being interacted with.
  // In 'active' state, there is a drop shadow and the rotation handle is visible.
  //
  // A piece can also be 'selected', which is a synchronized state. When a piece
  // is selected, all clients display that piece as active. (the idea is that the
  // user will understand they cannot interact with the piece because another user
  // has it selected).
  //
  // - When a user taps a piece, it makes it selected.
  // - On devices that support hover, any selection by that client is cleared, and
  //   the hovered piece becomes 'active', but not 'selected'.
  //
  // The reason this is necessary is that we do not have a separate visual hover
  // state. Both selected and hover are represented the same way. So it would be
  // confusing to leave a selection in place but hover something different.
  //
  // Finally when a piece becomes active because of the action of the local client,
  // the rotation handle is animated into view. But this does not happen when a
  // piece becomes active due to the actions of remote clients.

  const [hoveringPieceID, setHoveringPieceID] = useState<string | null>(null);
  const [blurringPieceID, setBlurringPieceID] = useState<string | null>(null);
  const handlePieceHover = (pieceID: string) => {
    setHoveringPieceID(pieceID);
    setBlurringPieceID(null);
    if (pieceID !== myClient!.selectedPieceID) {
      r.mutate.updateClient({id: myClient!.id, selectedPieceID: ''});
    }
  };
  const handlePieceBlur = (pieceID: string) => {
    setBlurringPieceID(pieceID);
  };
  useEffect(() => {
    if (blurringPieceID) {
      const timerID = window.setTimeout(() => {
        setHoveringPieceID(null);
        setBlurringPieceID(null);
      }, 1000);
      return () => {
        window.clearTimeout(timerID);
      };
    }
    return undefined;
  }, [blurringPieceID]);

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

  const handlePiecePointerDown = async (
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
    r.mutate.updateClient({id: await r.clientID, selectedPieceID: model.id});
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

    const piece = pieces[dragInfo.pieceID];
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
    r.mutate.updatePiece({id: piece.id, ...coordinate});
  };

  const handleLostPointerCapture = (e: React.PointerEvent) => {
    dragging.current.delete(e.pointerId);
  };

  if (!myClient) {
    return null;
  }

  return (
    <div
      ref={ref}
      onPointerMove={e => handlePointerMove(e)}
      onLostPointerCapture={e => handleLostPointerCapture(e)}
    >
      {Object.values(pieces).map(model => {
        const active =
          hoveringPieceID === model.id ||
          blurringPieceID === model.id ||
          model.selector !== null;
        const pos = coordinateToPosition(model, home, screenSize);
        return (
          <Piece
            key={model.id}
            piece={{
              ...model,
              ...pos,
            }}
            active={active}
            animateHandle={hoveringPieceID !== null || blurringPieceID !== null}
            onPointerDown={e => handlePiecePointerDown(model, e, pos)}
            onPointerOver={() => handlePieceHover(model.id)}
            onPointerOut={() => handlePieceBlur(model.id)}
          />
        );
      })}
    </div>
  );
}
