import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {init} from '@/demo/frontend';
import {DEBUG_TEXTURES} from '@/demo/frontend/constants';

let initPromise: Promise<void> | undefined;
const initOnce = () => {
  if (initPromise) {
    return initPromise;
  }
  initPromise = init();
  return initPromise;
};

const PaintFight = () => {
  const [initError, setInitError] = useState<Error | undefined>(undefined);
  // useEffect so this fires after load
  useEffect(() => {
    initOnce().catch(error => {
      setInitError(error);
      console.error(error);
    });
  }, []);

  return (
    <>
      <pre id="debug"></pre>
      {initError ? `${initError?.message}` : null}
      <div id="demo">
        <canvas id="canvas3D"></canvas>
      </div>
      <div className={`canvases ${DEBUG_TEXTURES ? ' debug' : ''}`}>
        {DEBUG_TEXTURES ? <Canvases id="caches" /> : null}
        <Canvases id="textures" />
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
