import {Piece} from './Piece';
import {
  Position,
  Rect,
  addRadians,
  center,
  coordinateToPosition,
  getAngle,
} from './util';
import {useSubscribe} from 'replicache-react';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';
import {useRef} from 'react';
import {
  PIECE_DEFINITIONS,
  PieceDefinition,
  SVG_ORIGINAL_SIZE,
} from './piece-definitions';
import {ClientModel, getClient} from './client-model';
import {getPieceInfos, PieceInfo} from './piece-info';
import {
  handleDrag as sharedHandleDrag,
  checkSnap as sharedCheckSnap,
  selectIfAvailable as sharedSelectIfAvailable,
} from './puzzle-biz';
import type {PieceModel} from './piece-model';
import {Bots} from './bots';
import {useEventTimeout} from '@/hooks/use-timeout';
import useIsomorphicLayoutEffect from '@/hooks/use-isomorphic-layout-effect';

export function Puzzle({
  r,
  home,
  stage,
}: {
  r: Reflect<M>;
  home: Rect;
  stage: Rect;
}) {
  const {pieces, myClient} = useSubscribe<{
    pieces: Record<string, PieceInfo>;
    myClient: ClientModel | null;
  }>(
    r,
    async tx => {
      return {
        pieces: await getPieceInfos(tx),
        myClient: (await getClient(tx, tx.clientID)) ?? null,
      };
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

  const handlePieceHover = async (model: PieceInfo) => {
    if (selectIfAvailable(model)) {
      cancelBlur();
    }
  };

  const handlePieceBlur = () => {
    scheduleBlur();
  };

  const [setBlurTimeout, clearBlurTimeout] = useEventTimeout();

  const scheduleBlur = () => {
    setBlurTimeout(() => {
      r.mutate.updateClient({id: myClient!.id, selectedPieceID: ''});
    }, 1000);
  };

  const cancelBlur = () => {
    clearBlurTimeout();
  };

  const selectIfAvailable = (model: PieceInfo) => {
    if (!myClient) {
      return;
    }
    return sharedSelectIfAvailable(myClient.id, model, r);
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
  useIsomorphicLayoutEffect(() => {
    const handlePointerDown = () => {
      // clear selection when clicking outside of a piece
      // the pointerdown handler inside piece cancels bubbling
      cancelBlur();
      r.mutate.updateClient({id: myClient!.id, selectedPieceID: ''});
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [r, myClient]);

  const botsRef = useRef<Bots>();
  useIsomorphicLayoutEffect(() => {
    const bots = new Bots(r, home, stage);
    bots.setPieces(pieces);
    botsRef.current = bots;
    return () => bots.cleanup();
    // home, screenSize and stage changing our handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r]);
  useIsomorphicLayoutEffect(() => {
    botsRef.current?.handleResize(home, stage);
  }, [home, stage]);
  useIsomorphicLayoutEffect(() => {
    botsRef.current?.setPieces(pieces);
  }, [pieces]);

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
    if (!myClient) {
      return;
    }

    const piece = pieces[dragInfo.pieceID];
    if (!piece) {
      throw new Error(`Piece ${dragInfo.pieceID} not found`);
    }

    if (
      sharedHandleDrag(myClient.id, e, piece, dragInfo.offset, r, home, stage)
    ) {
      ref.current?.releasePointerCapture(e.pointerId);
      cancelBlur();
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

    const pos = coordinateToPosition(piece, home, stage);
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
    piece: PieceModel,
    def: PieceDefinition,
    currPos: Position,
  ) => {
    return sharedCheckSnap(piece, def, currPos, r, home, stage);
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

  const sizeScale = home.width / SVG_ORIGINAL_SIZE.width;

  return (
    <div
      id="pieces"
      ref={ref}
      style={{
        top: 0,
        left: stage.x,
        width: stage.width,
        height: stage.y + stage.height,
      }}
      onPointerMove={e => handlePointerMove(e)}
      onLostPointerCapture={e => handleLostPointerCapture(e)}
    >
      {Object.values(pieces).map(model => {
        const pos = coordinateToPosition(model, home, stage);
        return (
          <Piece
            key={model.id}
            piece={{
              ...model,
              ...pos,
            }}
            sizeScale={sizeScale}
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
