import classNames from 'classnames';
import {PIECE_DEFINITIONS} from './piece-definitions';
import React, {PointerEventHandler, useEffect, useState} from 'react';
import type {PieceInfo} from './piece-info';

export function Piece({
  piece,
  onPointerDown,
}: {
  piece: PieceInfo;
  onPointerDown: PointerEventHandler;
}) {
  const def = PIECE_DEFINITIONS[parseInt(piece.id)];
  type HoverState = 'hover' | 'wait' | 'none';
  const [hover, setHover] = useState<HoverState>('none');

  const active = hover == 'hover' || hover == 'wait' || piece.selector;

  useEffect(() => {
    if (hover !== 'wait') {
      return undefined;
    }
    const timerID = window.setTimeout(() => setHover('none'), 1000);
    return () => {
      window.clearTimeout(timerID);
    };
  }, [hover]);

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
        onPointerOver={() => setHover('hover')}
        onPointerOut={() => setHover('wait')}
      >
        {
          // TODO: We shouldn't really duplicate the id "shape" here but the CSS already had it that way.
        }
        <path id="shape" d={def.paths[0]} strokeWidth="1" />
      </svg>
      <div
        className={classNames('rotation-handle', {
          active,
        })}
        style={{
          transform: `translate3d(${piece.x + def.width / 2}px, ${
            piece.y + def.height / 2
          }px, 0px) rotate(0rad)`,
        }}
      >
        <div></div>
      </div>
    </>
  );
}
