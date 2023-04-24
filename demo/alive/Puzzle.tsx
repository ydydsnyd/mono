import {Piece} from './Piece';
import {
  Position,
  Rect,
  Size,
  addRadians,
  center,
  coordinateToPosition,
  distance,
  getAngle,
  positionToCoordinate,
} from './util';
import {listPieces} from './piece-model';
import {useSubscribe} from 'replicache-react';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';
import {useEffect, useRef, useState} from 'react';
import {PIECE_DEFINITIONS, PieceDefinition} from './piece-definitions';
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
  const rotating = useRef(
    new Map<number, {pieceID: string; radOffset: number}>(),
  );

  type HoverState = {
    pieceID: string | null;
    phase: 'hover' | 'wait' | 'none';
  };

  const [hoverState, setHoverState] = useState<HoverState>({
    pieceID: null,
    phase: 'none',
  });

  const handlePieceHover = async (model: PieceInfo) => {
    if (!myClient) {
      return;
    }

    if (model.placed) {
      console.log('cannot hover already placed pieces');
      return;
    }

    // Pieces selected by others can't be hovered.
    if (model.selector !== null && model.selector !== myClient.id) {
      console.log(
        `Client ${myClient.id} cannot hover piece ${model.id}, selected by ${model.selector}}`,
      );
      return;
    }

    setHoverState({
      pieceID: model.id,
      phase: 'hover',
    });

    if (model.id !== myClient.selectedPieceID) {
      r.mutate.updateClient({id: myClient.id, selectedPieceID: ''});
      r.mutate.updatePiece({id: model.id, handleRotation: -Math.PI / 2});
    }
  };
  const handlePieceBlur = () => {
    setHoverState({
      ...hoverState,
      phase: 'wait',
    });
  };
  useEffect(() => {
    if (!myClient) {
      return;
    }
    if (hoverState.phase === 'wait') {
      const timerID = window.setTimeout(() => {
        setHoverState({
          pieceID: null,
          phase: 'none',
        });
        r.mutate.updateClient({id: myClient.id, selectedPieceID: ''});
      }, 1000);
      return () => {
        window.clearTimeout(timerID);
      };
    }
    return undefined;
  }, [r, myClient, hoverState]);

  const selectIfAvailable = (model: PieceInfo) => {
    if (!myClient) {
      return;
    }

    if (model.placed) {
      console.log('cannot select already placed pieces');
      return;
    }

    // Pieces selected by others can't be selected.
    if (model.selector !== null && model.selector !== myClient.id) {
      console.info(
        `Client ${myClient.id} cannot select piece ${model.id}, already selected by ${model.selector}}`,
      );
      return false;
    }

    r.mutate.updateClient({id: myClient.id, selectedPieceID: model.id});
    return true;
  };

  const handlePiecePointerDown = async (
    model: PieceInfo,
    event: React.PointerEvent,
    piecePos: Position,
  ) => {
    if (!selectIfAvailable(model)) {
      return;
    }

    ref.current!.setPointerCapture(event.pointerId);
    dragging.current.set(event.pointerId, {
      pieceID: model.id,
      offset: {
        x: event.pageX - piecePos.x,
        y: event.pageY - piecePos.y,
      },
    });
  };
  useEffect(() => {
    const handlePointerDown = () => {
      // clear selection when clicking outside of a piece
      // the pointerdown handler inside piece cancels bubbling
      setHoverState({
        pieceID: null,
        phase: 'none',
      });
      r.mutate.updateClient({id: myClient!.id, selectedPieceID: ''});
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [r, myClient]);

  /*
  useEffect(() => {
    window.addEventListener('mousemove', e => {
      if (e.buttons === 0) {
        return;
      }
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
    });
  }, []);
  */

  const handlePointerMove = (e: React.PointerEvent) => {
    const dragInfo = dragging.current.get(e.pointerId);
    if (dragInfo) {
      handleDrag(e, dragInfo);
    }

    const rotateInfo = rotating.current.get(e.pointerId);
    if (rotateInfo) {
      handleRotate(e, rotateInfo);
    }
  };

  const handleDrag = async (
    e: React.PointerEvent,
    dragInfo: {pieceID: string; offset: Position},
  ) => {
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

    if (checkSnap(piece, def, pos)) {
      ref.current?.releasePointerCapture(e.pointerId);
      setHoverState({
        pieceID: null,
        phase: 'none',
      });
      r.mutate.updateClient({id: await r.clientID, selectedPieceID: ''});
    }
  };

  const handleRotate = (
    e: React.PointerEvent,
    rotateInfo: {pieceID: string; radOffset: number},
  ) => {
    const piece = pieces[rotateInfo.pieceID];
    if (!piece) {
      throw new Error(`Piece ${rotateInfo.pieceID} not found`);
    }

    const pos = coordinateToPosition(piece, home, screenSize);
    const def = PIECE_DEFINITIONS[parseInt(piece.id)];
    const c = center({
      ...pos,
      width: def.width,
      height: def.height,
    });
    const pointerRads = getAngle(c, {
      x: e.pageX,
      y: e.pageY,
    });

    const newRads = addRadians(pointerRads, -rotateInfo.radOffset);
    const prevRads = piece.handleRotation;
    const newRot = addRadians(piece.rotation, newRads - prevRads);
    r.mutate.updatePiece({
      id: piece.id,
      handleRotation: newRads,
      rotation: newRot,
    });

    if (
      checkSnap(
        {
          ...piece,
          rotation: newRot,
        },
        def,
        pos,
      )
    ) {
      ref.current?.releasePointerCapture(e.pointerId);
    }
  };

  const checkSnap = (
    piece: PieceInfo,
    def: PieceDefinition,
    currPos: Position,
  ) => {
    const homePos = coordinateToPosition(def, home, screenSize);
    const dist = distance(currPos, homePos);
    const distThresh = 10;
    const rotThresh = Math.PI / 6;
    if (
      dist <= distThresh &&
      (piece.rotation <= rotThresh || Math.PI * 2 - piece.rotation <= rotThresh)
    ) {
      r.mutate.updatePiece({
        id: piece.id,
        x: def.x,
        y: def.y,
        rotation: 0,
        placed: true,
      });
      return true;
    }
    return false;
  };

  const handleLostPointerCapture = (e: React.PointerEvent) => {
    dragging.current.delete(e.pointerId);
    rotating.current.delete(e.pointerId);
  };

  const handleRotateStart = (
    model: PieceInfo,
    e: React.PointerEvent,
    pos: Position,
  ) => {
    if (!selectIfAvailable(model)) {
      return;
    }

    ref.current?.setPointerCapture(e.pointerId);

    const def = PIECE_DEFINITIONS[parseInt(model.id)];
    const c = center({
      ...pos,
      width: def.width,
      height: def.height,
    });
    const pointerRads = getAngle(c, {
      x: e.pageX,
      y: e.pageY,
    });
    const offset = pointerRads - model.handleRotation;
    rotating.current.set(e.pointerId, {
      pieceID: model.id,
      radOffset: offset,
    });
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
        const pos = coordinateToPosition(model, home, screenSize);
        return (
          <Piece
            key={model.id}
            piece={{
              ...model,
              ...pos,
            }}
            hovered={hoverState.pieceID === model.id}
            selectorID={model.selector}
            myClient={myClient}
            onPointerDown={e => handlePiecePointerDown(model, e, pos)}
            onPointerOver={() => handlePieceHover(model)}
            onPointerOut={() => handlePieceBlur()}
            onRotationStart={e => handleRotateStart(model, e, pos)}
          />
        );
      })}
    </div>
  );
}
