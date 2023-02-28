import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {init} from '@/demo/frontend';
import {DEBUG_TEXTURES} from '@/demo/shared/constants';

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
    initOnce().catch(setInitError);
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
        <Canvases id="buffers" />
        <Canvases id="textures" />
      </div>
      <div id="info">
        <div className="active-user-info">
          <div className="online-dot"></div>
          &nbsp;Active users:&nbsp;
          <span id="active-user-count">1</span>
        </div>
        <button id="copy-room-button">
          <div className="copy">
            <Image
              src="/img/copy-link.svg"
              className="icon"
              alt=""
              width={16}
              height={16}
            />
            &nbsp;Copy demo link
          </div>
          <div className="success">
            <Image
              src="/img/copied.svg"
              className="icon"
              alt=""
              width={16}
              height={16}
            />
            &nbsp;Link copied
          </div>
        </button>
        <button id="new-room-button">Reset Demo</button>
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
