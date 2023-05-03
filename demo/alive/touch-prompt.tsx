import classNames from 'classnames';
import {useRef} from 'react';
import type {Rect, Size} from './util';
import type {GameMode} from '@/pages';
import useIsomorphicLayoutEffect from '@/hooks/use-isomorphic-layout-effect';

export function TouchPrompt({
  winSize,
  stage,
  gameMode,
  setGameMode,
}: {
  winSize: Size;
  stage: Rect;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isPortrait = winSize.width < winSize.height;
  const enableScreen = isPortrait;
  const message = isPortrait ? 'Rotate to play' : 'Tap to play';

  useIsomorphicLayoutEffect(() => {
    const handleTouch = (e: MouseEvent) => {
      if (isPortrait) {
        if (gameMode === 'off') {
          if (ref.current?.contains(e.target as Node)) {
            setGameMode('requested');
          }
        } else {
          setGameMode('off');
        }
      } else {
        if (ref.current?.contains(e.target as Node)) {
          setGameMode('active');
        }
      }
    };
    window.addEventListener('click', handleTouch);
    return () => {
      window.removeEventListener('click', handleTouch);
    };
  }, [isPortrait, gameMode, setGameMode]);

  return (
    <div
      ref={ref}
      className={classNames('prompt', {
        active: gameMode === 'requested' || !isPortrait,
        enableScreen,
      })}
      style={{
        top: stage.top(),
        left: 0,
        width: '100%',
        height: stage.height,
      }}
    >
      <div className="message">
        {isPortrait && (
          <div className="icon">
            <img src="/icon-rotate-phone.svg" />
          </div>
        )}
        <div className="wordz">{message}</div>
      </div>
    </div>
  );
}
