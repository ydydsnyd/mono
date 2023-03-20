import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {init} from '@/demo/frontend';
import {DEBUG_TEXTURES} from '@/demo/frontend/constants';
import Preload from './Preload';

let initPromise: Promise<void> | undefined;
const initOnce = () => {
  if (initPromise) {
    return initPromise;
  }
  initPromise = init();
  return initPromise;
};

const animationDuration = 500;

const PaintFight = () => {
  const [initError, setInitError] = useState<Error | undefined>(undefined);
  const [initialized, setInitialized] = useState<boolean>(false);
  // useEffect so this fires after load
  useEffect(() => {
    let durationElapsed = false;
    let wasInitialized = false;
    initOnce()
      .catch(error => {
        setInitError(error);
        console.error(error);
      })
      .then(() => {
        if (durationElapsed) {
          setInitialized(true);
        } else {
          wasInitialized = true;
        }
      });
    setTimeout(() => {
      if (wasInitialized) {
        setInitialized(true);
      } else {
        durationElapsed = true;
      }
    }, animationDuration);
  }, []);

  return (
    <>
      <pre id="debug"></pre>
      {initError ? `${initError?.message}` : null}
      <div id="demo">
        <Preload
          animationDuration={animationDuration}
          className={initialized ? '' : ''}
        />
        <canvas id="canvas3D" className={initialized ? 'loaded' : ''}></canvas>
      </div>
      <div className={`canvases ${DEBUG_TEXTURES ? ' debug' : ''}`}>
        {DEBUG_TEXTURES ? <Canvases id="caches" /> : null}
        {DEBUG_TEXTURES ? <Canvases id="server-caches" /> : null}
      </div>
      <div id="info">
        <div className="active-user-info">
          <div className="online-dot offline"></div>
          &nbsp;Active users:&nbsp;
          <span id="active-user-count">1</span>
        </div>
        <button id="reset-button">
          <div className="copy">
            <Image
              src="/img/clear.svg"
              className="icon"
              alt=""
              width={16}
              height={16}
            />
            &nbsp;Clear Paint
          </div>
          <div className="success">
            <Image
              src="/img/success.svg"
              className="icon"
              alt=""
              width={16}
              height={16}
            />
            &nbsp;Cleared
          </div>
        </button>
      </div>
    </>
  );
};

export default PaintFight;

const Canvases = ({id}: {id: string}) => (
  <div id={id}>
    <canvas className="a"></canvas>
    <canvas className="l"></canvas>
    <canvas className="i"></canvas>
    <canvas className="v"></canvas>
    <canvas className="e"></canvas>
  </div>
);
