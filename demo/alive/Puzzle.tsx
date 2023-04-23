import {Piece} from './Piece';
import {useEffect, useState} from 'react';
import {
  coordinateToPosition,
  getScreenSize,
  getAbsoluteRect,
  getStage,
  generateRandomPieces,
} from './util';
import {listPieces} from './piece-model';
import {Reflect} from '@rocicorp/reflect';
import {loggingOptions} from '../frontend/logging-options';
import {type M, mutators} from '../shared/mutators';
import {WORKER_HOST} from '../shared/urls';
import {useSubscribe} from 'replicache-react';

export function Puzzle() {
  const [r, setR] = useState<Reflect<M> | null>(null);
  const [screenSize, setScreenSize] = useState(getScreenSize());
  const stage = getStage(screenSize);
  const home = getAbsoluteRect(document.querySelector('#demo')!);

  useEffect(() => {
    const handleWindowResize = () => {
      setScreenSize(getScreenSize());
    };
    window.addEventListener('resize', handleWindowResize);

    const r = new Reflect<M>({
      socketOrigin: WORKER_HOST,
      userID: 'anon',
      roomID: 'puzzle',
      mutators,
      ...loggingOptions,
    });
    r.mutate.initializePuzzle({
      pieces: generateRandomPieces(home, stage, screenSize),
      force: true,
    });
    setR(r);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
