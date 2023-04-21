import {PIECE_MIN_Z_INDEX} from '../shared/constants';
import type {Mutators} from '../shared/mutators';
import type {
  ActivePuzzlePiece,
  ActorID,
  Cursor,
  PieceNumber,
  PieceOrder,
  Position,
} from '../shared/types';
import {
  addRadians,
  center,
  getAngle,
  now,
  rotatePosition,
} from '../shared/util';
import {
  coordinateToPosition,
  positionToCoordinate,
  screenSize,
} from './coordinates';

const pieceElements: SVGSVGElement[] = [];
const rotationHandles: HTMLDivElement[] = [];
const rotatingPieces: Record<
  ActorID,
  {startRotation: number; pieceNum: PieceNumber}
> = {};
let cancelAnimations: (() => void) | null = null;
// Bots need to be able to rotate, but since we won't show handles when they
// hover, we need to allow them to just arbitrarily decide when to start
// rotating. Then when we send cursor movements, they will properly rotate.
export const startRotating = (
  cursor: Cursor,
  pieces: ActivePuzzlePiece[],
  pieceNum: PieceNumber,
  mutators: Mutators,
) => {
  const piece = pieces[pieceNum];
  rotationHandles[pieceNum].classList.add('moving');
  rotatingPieces[cursor.actorID] = {startRotation: piece.rotation, pieceNum};
  mutators.rotatePiece({
    actorID: cursor.actorID,
    pieceNum,
    rotation: piece.rotation,
    handlePosition: {x: cursor.x, y: cursor.y},
  });
};
// Create SVGs and rotation handles for each piece, and add a hover & click
// listener to the rotation handle. Note that we don't add listeners for the
// pieces, as they can be moved by bots and so are hit tested instead.
export const createPieceElements = (
  pieces: ActivePuzzlePiece[],
  container: HTMLDivElement,
  preciseElement: HTMLElement,
  getCursor: () => Cursor,
  mutators: Mutators,
) => {
  for (const [pieceNum, piece] of pieces.entries()) {
    if (document.getElementById(`piece-${pieceNum}`)) {
      continue;
    }
    const pos = coordinateToPosition(piece, preciseElement, screenSize());
    const svgns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgns, 'svg');
    svg.id = `piece-${pieceNum}`;
    svg.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink/',
    );
    svg.setAttribute('version', '1.1');
    svg.setAttribute('viewBox', `0 0 ${piece.width} ${piece.height}`);
    svg.setAttribute('width', `${piece.width}px`);
    svg.setAttribute('height', `${piece.height}px`);
    svg.classList.add('piece', piece.letter);
    svg.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0px) rotate(${piece.rotation}rad)`;
    const fill = document.createElementNS(svgns, 'path');
    fill.id = 'shape';
    fill.setAttribute('d', piece.paths[0]);
    fill.setAttribute('stroke-width', '1');
    const handleHoverHandler = () => {
      const actorID = getCursor().actorID;
      if (!handle.classList.contains('showing') || rotatingPieces[actorID]) {
        return;
      }
      // When we hover a rotation handle, keep it showing
      cancelAnimations?.();
      handle?.classList.add('showing');
      svg.classList.add('active');
      mutators.setPieceActive({actorID, pieceNum, ts: now()});
      handle.addEventListener('mouseout', mouseOutHandler);
    };
    const mouseOutHandler = () => {
      const actorID = getCursor().actorID;
      fill.removeEventListener('mouseout', mouseOutHandler);
      window.removeEventListener('mouseup', mouseOutHandler);
      handle.removeEventListener('mouseout', mouseOutHandler);
      handle.addEventListener('mouseover', handleHoverHandler);
      let h = setTimeout(() => {
        handle.classList.remove('showing');
        svg.classList.remove('active');
        mutators.setPieceInactive({actorID, pieceNum});
        h = setTimeout(() => {
          handle.classList.remove('active');
          cancelAnimations?.();
        }, 100);
      }, 1000);
      cancelAnimations = () => {
        handle.classList.remove('showing');
        handle.classList.remove('active');
        svg.classList.remove('active');
        mutators.setPieceInactive({actorID, pieceNum});
        clearTimeout(h);
        cancelAnimations = null;
      };
    };
    fill.addEventListener('mouseover', () => {
      // TODO: ideally we'd use order to figure this out - it's common when moving a
      // mouse over multiple elements that we'll fire hovers on many in a row,
      // resulting in unexpected behavior. Right now due to transparency this is
      // pretty ambiguous UX anyway, so just accept the first one.
      const cursor = getCursor();
      const actorID = cursor.actorID;
      const piece = pieces[pieceNum];
      if (rotatingPieces[actorID] || movingPieces[actorID] || piece.placed) {
        return;
      }
      cancelAnimations?.();
      svg.classList.add('active');
      mutators.setPieceActive({actorID, pieceNum, ts: now()});
      // When we hover a piece and nobody is rotating it, we want to show the handle,
      // so we have to move it to the right place then flip some classes to make it
      // animate in.
      if (!piece.rotatorID) {
        const {x, y} = coordinateToPosition(
          piece,
          preciseElement,
          screenSize(),
        );
        const pieceCenter = center({...piece, x, y});
        handle.style.left = pieceCenter.x + 'px';
        handle.style.top = pieceCenter.y + 'px';
        handle.classList.add('active');
        handle.classList.add('showing');
      }
      fill.addEventListener('mouseout', mouseOutHandler);
    });
    fill.addEventListener('mousedown', () => {
      svg.classList.add('moving');
      fill.removeEventListener('mouseout', mouseOutHandler);
      window.addEventListener('mouseup', mouseOutHandler);
    });
    svg.appendChild(fill);
    container.appendChild(svg);
    pieceElements[pieceNum] = svg;
    const handle = document.createElement('div');
    handle.classList.add('rotation-handle', `handle-${pieceNum}`);
    container.appendChild(handle);
    rotationHandles[pieceNum] = handle;
    handle.addEventListener('mousedown', () => {
      // When we mousedown a handle, begin rotating. Additional movements are handled below.
      // Note that we also don't need to add a mouseup handler, as when we render a
      // cursor that is not down and that has a current rotation, we will
      // automatically finish the rotation.
      svg.classList.add('rotating');
      startRotating(getCursor(), pieces, pieceNum, mutators);
      handle.removeEventListener('mouseout', mouseOutHandler);
      window.addEventListener('mouseup', mouseOutHandler);
    });
  }
};

// This is run every frame, and just moves pieces where they belong and updates
// their appearance.
// const shadowOffset = 2;
export const renderPieces = (
  pieces: ActivePuzzlePiece[],
  pieceOrder: PieceOrder[],
  preciseElement: HTMLDivElement,
) => {
  for (const [order, pieceNum] of pieceOrder.entries()) {
    const piece = pieces[pieceNum];
    const pos = coordinateToPosition(piece, preciseElement, screenSize());
    const svg = pieceElements[piece.number];
    if (svg) {
      if (piece.placed) {
        svg.classList.add('placed');
        svg.classList.remove('active', 'moving');
        svg.style.zIndex = `${PIECE_MIN_Z_INDEX}`;
      } else {
        svg.classList.remove('placed');
        svg.style.zIndex = `${PIECE_MIN_Z_INDEX + 1 + order}`;
      }
      svg.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0px) rotate(${piece.rotation}rad)`;
      // TODO: adjust shadow based on rotation
      // if (svg.classList.contains('active') && piece.rotation !== 0) {
      //   // Our shadow is offset, so it needs to compensate for the rotation otherwise it
      //   // will look weird. The shadow being offset will also give a subtle sense of
      //   // three-dimensional depth.
      //   // 0 is the original position. So our left offset is 100% at 0 and -100% at π.
      //   console.log(toCurve(piece.rotation / (Math.PI * 2), 0, 1));
      //   const offsetLeft = scaleRange(
      //     -shadowOffset,
      //     shadowOffset,
      //     piece.rotation / (Math.PI * 2),
      //   );
      //   // Our top offset is 100% at π / 2, so just add that to the rotation
      //   const topRelRotation = addRadians(piece.rotation, Math.PI / 2);
      //   const offsetTop = scaleRange(
      //     -shadowOffset,
      //     shadowOffset,
      //     topRelRotation / (Math.PI * 2),
      //   );
      //   svg.style.filter = `drop-shadow(${offsetLeft}px ${offsetTop}px 0px #00000040)`;
      //   // console.log(topRelRotation, offsetTop);
      //   // console.log(piece.rotation, piece.rotation / (Math.PI * 2), offsetLeft);
      // } else {
      //   svg.style.removeProperty('filter');
      // }
    }
  }
};

// Given an absolute screen position, this will tell us if that position is over
// a puzzle piece.
export const hitTestPieces = (
  point: Position,
  pieces: ActivePuzzlePiece[],
  pieceOrder: PieceOrder[],
  preciseElement: HTMLElement,
) => {
  for (const pieceNum of pieceOrder) {
    const piece = pieces[pieceNum];
    const svg = pieceElements[pieceNum];
    const piecePosition = coordinateToPosition(
      piece,
      preciseElement,
      screenSize(),
    );
    // Invert the rotation on the cursor so it'll hit test against the un-rotated
    // piece's position
    // Move to coordinates inside the piece's bounding box
    const hitPoint = rotatePosition(
      {
        x: point.x - piecePosition.x,
        y: point.y - piecePosition.y,
      },
      {
        x: piece.width / 2,
        y: piece.height / 2,
      },
      piece.rotation,
    );
    // Hit test the actual svg shape
    const svgPoint = svg.createSVGPoint();
    svgPoint.x = hitPoint.x;
    svgPoint.y = hitPoint.y;
    const shape = svg.getElementById('shape') as SVGRectElement;
    if (shape.isPointInFill(svgPoint)) {
      return piece.number;
    }
  }
  return -1;
};

const movingPieces: Record<ActorID, {offset: Position; pieceNum: PieceNumber}> =
  {};

export const currentPiece = (actorID: ActorID) => {
  return movingPieces[actorID].pieceNum;
};
// Whenever a cursor changes, call this method to make sure that pieces respond correctly.
export const updatePiecesWithCursor = async (
  cursor: Cursor,
  position: Position,
  pieces: ActivePuzzlePiece[],
  pieceOrder: PieceOrder[],
  preciseElement: HTMLDivElement,
  mutators: Mutators,
  yLimits: {min: number; max: number},
  onStartDrag?: () => void,
  onEndDrag?: () => void,
) => {
  // Check if we're rotating before allowing piece movement.
  const currentlyRotating = rotatingPieces[cursor.actorID];
  if (currentlyRotating) {
    if (cursor.isDown) {
      const piece = pieces[currentlyRotating.pieceNum];
      const {x, y} = coordinateToPosition(piece, preciseElement, screenSize());
      const pieceCenter = center({...piece, x, y});
      // Angle between piece and handle
      const angle = addRadians(
        getAngle(pieceCenter, position),
        // In our data, 0 is at the top, not at the side, so rotate the angle by 90 degrees
        -Math.PI / 2,
      );
      mutators.rotatePiece({
        actorID: cursor.actorID,
        pieceNum: currentlyRotating.pieceNum,
        rotation: addRadians(currentlyRotating.startRotation, angle),
        handlePosition: {x: cursor.x, y: cursor.y},
      });
    } else {
      const handle = rotationHandles[currentlyRotating.pieceNum];
      handle?.classList.remove('showing');
      handle?.classList.remove('moving');
      const el = pieceElements[currentlyRotating.pieceNum];
      el.classList.remove('active');
      mutators.setPieceInactive({
        actorID: cursor.actorID,
        pieceNum: currentlyRotating.pieceNum,
      });
      el.classList.remove('rotating');
      mutators.finishRotating({pieceNum: currentlyRotating.pieceNum});
      delete rotatingPieces[cursor.actorID];
    }
    // Don't do anything else if we're rotating
    return;
  }

  const existingMovement = movingPieces[cursor.actorID];
  if (cursor.isDown) {
    // If the cursor is down, check if this cursor is already moving a piece
    if (existingMovement) {
      await mutators.movePiece({
        actorID: cursor.actorID,
        pieceNum: existingMovement.pieceNum,
        position: positionToCoordinate(
          {
            x: position.x - existingMovement.offset.x,
            y: Math.min(
              Math.max(position.y - existingMovement.offset.y, yLimits.min),
              yLimits.max,
            ),
          },
          preciseElement,
          screenSize(),
        ),
      });
      const piece = pieces[existingMovement.pieceNum];
      // If nobody is rotating this piece, also move its handle with the piece.
      if (!piece.rotatorID) {
        const {x, y} = coordinateToPosition(
          piece,
          preciseElement,
          screenSize(),
        );
        const pieceCenter = center({...piece, x, y});
        const rotationHandle = rotationHandles[existingMovement.pieceNum];
        rotationHandle.style.left = pieceCenter.x + 'px';
        rotationHandle.style.top = pieceCenter.y + 'px';
      }
    } else {
      // Otherwise, check if we're over a piece.
      const hitIndex = hitTestPieces(
        position,
        pieces,
        pieceOrder,
        preciseElement,
      );
      if (hitIndex !== -1) {
        // If we are, this cursor should start dragging it.
        const piecePos = coordinateToPosition(
          pieces[hitIndex],
          preciseElement,
          screenSize(),
        );
        movingPieces[cursor.actorID] = {
          pieceNum: hitIndex,
          offset: {x: position.x - piecePos.x, y: position.y - piecePos.y},
        };
        onStartDrag?.();
      }
    }
  } else {
    // If the cursor is not down and we have an existing movement, finish moving the piece.
    if (existingMovement) {
      pieceElements[existingMovement.pieceNum].classList.remove('moving');
      await mutators.finishMoving({pieceNum: existingMovement.pieceNum});
      delete movingPieces[cursor.actorID];
      onEndDrag?.();
    }
  }
};

export const updateRotationHandles = (
  pieces: ActivePuzzlePiece[],
  pieceOrder: PieceOrder[],
  preciseElement: HTMLDivElement,
) => {
  for (const [order, pieceNum] of pieceOrder.entries()) {
    const piece = pieces[pieceNum];
    const rotationHandle = rotationHandles[pieceNum];
    // 2 to be one higher than the piece, and one higher than the placed pieces.
    rotationHandle.style.zIndex = `${PIECE_MIN_Z_INDEX + 2 + order}`;

    if (piece.rotatorID) {
      // If other people are rotating a piece, show it so that it's not confusing when
      // we move it and it rotates or vise versa. Their cursors should be on top of
      // the handle already, making it clear what's happening.
      if (rotationHandle) {
        const newPos = coordinateToPosition(
          piece.handlePosition,
          preciseElement,
          screenSize(),
        );
        rotationHandle.classList.remove('active');
        rotationHandle.style.left = newPos.x + 'px';
        // 40 because when you grab it, it has a -40px margin-top for the animation
        rotationHandle.style.top = newPos.y + 40 + 'px';
      }
    }
  }
};
