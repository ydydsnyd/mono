import {Piece} from './Piece';
import {useEffect, useState} from 'react';
import {coordinateToPosition, getScreenSize, getAbsoluteRect} from './util';
import {PIECE_DEFINITIONS} from './piece-definitions';
import type {PieceModel} from './piece-model';

/*
const r = new Reflect<M>({
  socketOrigin: WORKER_HOST,
  userID: 'anon',
  roomID: 'puzzle',
  mutators,
  ...loggingOptions,
});
*/

let initialized = false;

export function Puzzle() {
  const [screenSize, setScreenSize] = useState(getScreenSize());
  const stage = getAbsoluteRect(document.querySelector('#demo') as HTMLElement);
  //const pieceLimits = getPieceLimits(stage, screenSize);

  useEffect(() => {
    const handleWindowResize = () => {
      setScreenSize(getScreenSize());
    };
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!initialized) {
      /*
      r.mutate.initializePuzzle({
        pieces: generateRandomPieces(stage, pieceLimits, screenSize),
        force: false,
      });
      */
      initialized = true;
    }
  });

  return (
    <>
      {PIECE_DEFINITIONS.map((def, i) => {
        const model: PieceModel = {
          id: i.toString(),
          x: def.x,
          y: def.y,
          placed: false,
          rotation: 0,
        };
        const pos = coordinateToPosition(model, stage, screenSize);
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
