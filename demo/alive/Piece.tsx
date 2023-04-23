import classNames from 'classnames';
import {PIECE_DEFINITIONS} from './piece-definitions';
import React, {PointerEventHandler} from 'react';
import type {PieceInfo} from './piece-info';

export type HoverState = 'hover' | 'wait' | 'none';

export function Piece({
  piece,
  active,
  animateHandle,
  onPointerDown,
  onPointerOver,
  onPointerOut,
}: {
  piece: PieceInfo;
  active: boolean;
  animateHandle: boolean;
  onPointerDown: PointerEventHandler;
  onPointerOver: PointerEventHandler;
  onPointerOut: PointerEventHandler;
}) {
  const def = PIECE_DEFINITIONS[parseInt(piece.id)];

  return (
    <>
      <svg
        version="1.1"
        viewBox={`0 0 ${def.width} ${def.height}`}
        width={def.width}
        height={def.height}
        className={classNames('piece', def.letter, {
          placed: piece.placed,
          active,
        })}
        style={{
          transform: `translate3d(${piece.x}px, ${piece.y}px, 0px) rotate(${piece.rotation}rad)`,
        }}
        onPointerDown={onPointerDown}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {
          // TODO: We shouldn't really duplicate the id "shape" here but the CSS already had it that way.
        }
        <path id="shape" d={def.paths[0]} strokeWidth="1" />
      </svg>
      <div
        className={classNames('rotation-handle', {
          active,
          animate: animateHandle,
        })}
        style={{
          transform: `translate3d(${piece.x + def.width / 2}px, ${
            piece.y + def.height / 2
          }px, 0px) rotate(${0}rad)`,
          transformOrigin:
            '${piece.x + def.width / 2}px ${piece.y + def.height / 2}px',
        }}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <div></div>
      </div>
    </>
  );
}
