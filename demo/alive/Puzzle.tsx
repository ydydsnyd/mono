import {Piece} from './Piece';
import {BoundingBox, Size, coordinateToPosition} from './util';
import {listPieces} from './piece-model';
import {useSubscribe} from 'replicache-react';
import type {Reflect} from '@rocicorp/reflect';
import type {M} from '../shared/mutators';

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

  return (
    <>
      {pieces.map((model, i) => {
        const pos = coordinateToPosition(model, home, screenSize);
        return (
          <Piece
            key={i}
            piece={{
              ...model,
              ...pos,
            }}
          />
        );
      })}
    </>
  );
}
