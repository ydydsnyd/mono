import classNames from 'classnames';
import type {PieceModel} from './piece-model';
import {PIECE_DEFINITIONS} from './piece-definitions';
import React, {PointerEventHandler} from 'react';

export function Piece({
  piece,
  onPointerDown,
}: {
  piece: PieceModel;
  onPointerDown: PointerEventHandler;
}) {
  const def = PIECE_DEFINITIONS[parseInt(piece.id)];
  return (
    <svg
      version="1.1"
      viewBox={`0 0 ${def.width} ${def.height}`}
      width={def.width}
      height={def.height}
      className={classNames('piece', def.letter, {placed: piece.placed})}
      style={{
        transform: `translate3d(${piece.x}px, ${piece.y}px, 0px) rotate(${piece.rotation}rad)`,
      }}
      onPointerDown={onPointerDown}
    >
      {
        // TODO: We shouldn't really duplicate the id "shape" here but the CSS already had it that way.
      }
      <path id="shape" d={def.paths[0]} strokeWidth="1" />
    </svg>
  );
}
