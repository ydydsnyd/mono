import classNames from 'classnames';
import {useEffect, useRef, useState} from 'react';
import type {Rect, Size} from './util';

export function TouchPrompt({
  winSize,
  stage,
  onPlay,
}: {
  winSize: Size;
  stage: Rect;
  onPlay: () => void;
}) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const isPortrait = winSize.width < winSize.height;
  const enableScreen = isPortrait;
  const message = isPortrait ? 'Rotate to play' : 'Tap to play';

  useEffect(() => {
    const handleTouch = (e: MouseEvent) => {
      if (isPortrait) {
        if (!active) {
          if (ref.current?.contains(e.target as Node)) {
            setActive(true);
          }
        } else {
          setActive(false);
        }
      } else {
        if (ref.current?.contains(e.target as Node)) {
          onPlay();
        }
      }
    };
    window.addEventListener('click', handleTouch);
    return () => {
      window.removeEventListener('click', handleTouch);
    };
  }, [isPortrait, active, onPlay]);

  return (
    <div
      ref={ref}
      className={classNames('prompt', {
        active: active || !isPortrait,
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
