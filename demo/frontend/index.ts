import rapier3d from '@dimforge/rapier3d';
import {nanoid} from 'nanoid';
import {initialize} from './data';
import {renderer as renderer3D} from './3d-renderer';
import {cacheOldPoints, render} from './texture-renderer';
import initRenderer from '../../renderer/pkg/renderer';
import {cursorRenderer} from './cursors';
import {
  UVMAP_SIZE,
  FPS_LOW_PASS,
  COLOR_PALATE,
  COLOR_PALATE_END,
  CLIENT_CACHE_INTERVAL,
  STEP_RENDER_DELAY,
} from '../shared/constants';
import type {
  ColorPalate,
  Cursor,
  Letter,
  LetterCache,
  Size,
} from '../shared/types';
import {LETTERS} from '../shared/letters';
import {letterMap} from '../shared/util';
import {initRoom} from './init-room';
import {getUserLocation} from './location';
import {getPhysics} from '../shared/physics';

type LetterCanvases = Record<Letter, HTMLCanvasElement>;

type Debug = {
  fps: number;
  points: number;
};

const getScaleFactor = (): Size => {
  return {
    width: window.innerWidth,
    height: document.body.scrollHeight,
  };
};

export const init = async () => {
  // Generate an actor ID, which is just used for "auth" (which we don't really have)
  const actorId = localStorage.getItem('paint-fight-actor-id') || nanoid();
  localStorage.setItem('paint-fight-actor-id', actorId);

  const debug: Debug = {fps: 60, points: 0};
  const renderPointsIndex = letterMap(_ => 0);
  let physicsStep = -1;

  // Canvases
  const canvas = document.getElementById('canvas3D') as HTMLCanvasElement;
  const textures: LetterCanvases = letterMap(letter => {
    const tex = document.querySelector(
      `#textures > .${letter}`,
    ) as HTMLCanvasElement;
    tex.width = UVMAP_SIZE;
    tex.height = UVMAP_SIZE;
    return tex;
  });

  await initRenderer();

  const roomID = await initRoom();

  const {getState, addListener, updateCursor, addPoint, updateActorLocation} =
    await initialize(roomID, actorId);

  // Get our location and add it when it's ready
  getUserLocation().then(location => {
    updateActorLocation({actorId, location});
  });

  // Initialize state
  let {actors, cursors, rawCaches, points, sequences, physics, impulses} =
    await getState();

  // Set up 3D renderer
  const {
    render: render3D,
    getTexturePosition,
    resizeCanvas: resize3DCanvas,
    set3DPosition,
    updateTexture,
    updateDebug,
  } = await renderer3D(canvas, textures);

  // Set up info below demo
  const activeUserCount = document.getElementById(
    'active-user-count',
  ) as HTMLDivElement;
  const roomHref = `${window.location.href}#${roomID}`;
  const copyRoomButton = document.getElementById('copy-room-button');
  copyRoomButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(roomHref);
      copyRoomButton.classList.add('copied');
    } catch (e) {
      alert('Copying link failed.');
    }
    setTimeout(() => {
      copyRoomButton.classList.remove('copied');
    }, 1000);
  });
  const newRoomButton = document.getElementById('new-room-button');
  newRoomButton?.addEventListener('click', () => {
    localStorage.removeItem('roomID');
    window.location.reload();
  });

  // When we get a new cache, reset the local one.
  addListener<LetterCache>('cache', ({letter}) => {
    renderPointsIndex[letter] = 0;
  });

  // Initialize textures
  LETTERS.forEach(letter => updateTexture(letter));

  const colors: ColorPalate = [
    [COLOR_PALATE[0], COLOR_PALATE_END[0]],
    [COLOR_PALATE[1], COLOR_PALATE_END[1]],
    [COLOR_PALATE[2], COLOR_PALATE_END[2]],
    [COLOR_PALATE[3], COLOR_PALATE_END[3]],
    [COLOR_PALATE[4], COLOR_PALATE_END[4]],
  ];

  // Update debug info periodically
  if (window.location.search.includes('debug')) {
    setInterval(async () => {
      const debugEl = document.getElementById('debug');
      const pointCount = Object.keys(points).reduce(
        (acc, k) => points[k as Letter].length + acc,
        0,
      );
      if (debugEl) {
        debugEl.innerHTML = `${
          Object.keys(actors).length
        } actors\n${pointCount} points\n${debug.fps.toFixed(
          1,
        )} fps\n${LETTERS.map(letter => {
          return `${letter.toUpperCase()} [seq ${
            sequences[letter]
          }]\n  rendered points: ${
            points[letter].length - (renderPointsIndex[letter] + 1)
          }\n  local cache count:\n    ${
            renderPointsIndex[letter]
          }\n  cache size:\n    ${
            new Blob([rawCaches[letter] || '']).size / 1024
          }k\n  splatters: ${points[letter].reduce(
            (acc, p) => acc + p.p.length,
            0,
          )}`;
        }).join('\n')}`;
      }
    }, 200);
  }

  // Set up cursor renderer
  const renderCursors = cursorRenderer(
    actorId,
    () => ({actors, cursors}),
    getScaleFactor,
    (cursor: Cursor) => {
      updateCursor(cursor);
    },
  );

  // When the window is resized, recalculate letter and cursor positions
  const resizeViewport = () => {
    const scaleFactor = getScaleFactor();
    canvas.height = scaleFactor.height * window.devicePixelRatio;
    canvas.width = scaleFactor.width * window.devicePixelRatio;
    canvas.style.height = scaleFactor.height + 'px';
    canvas.style.width = scaleFactor.width + 'px';
    resize3DCanvas();
    renderCursors();
  };
  window.addEventListener('resize', resizeViewport);
  resizeViewport();

  // Set up physics rendering
  const updateStep = (step: number) => {
    const [positions3d, world] = getPhysics(rapier3d, physics, impulses, step);
    LETTERS.forEach(letter => {
      const position3d = positions3d[letter];
      if (position3d) {
        set3DPosition(letter, position3d);
      }
    });
    updateDebug(world.debugRender());
  };

  const renderPhysics = () => {
    const originStep = physics?.step || 0;
    const targetStep = Math.max(originStep - STEP_RENDER_DELAY, 0);
    // if we're behind origin minus delay, skip steps to accelerate us there.
    if (physicsStep < targetStep) {
      physicsStep += targetStep - physicsStep;
    } else if (physicsStep > originStep) {
      physicsStep += 0.5;
    } else {
      physicsStep += 1;
    }
    updateStep(Math.floor(physicsStep));
  };

  // Render our cursors and canvases at "animation speed", usually 60fps
  startRenderLoop(async () => {
    await renderCursors();
    // Each frame, render our textures
    render(textures, points, renderPointsIndex, colors);
    // Update textures and render the 3D scene
    LETTERS.forEach(letter => updateTexture(letter));
    render3D();
    renderPhysics();
  }, debug);

  // Periodically cache on the client
  setInterval(() => {
    LETTERS.forEach(letter => {
      renderPointsIndex[letter] = cacheOldPoints(
        letter,
        textures[letter],
        points[letter],
        renderPointsIndex[letter],
        colors,
      );
    });
  }, CLIENT_CACHE_INTERVAL);
};

const startRenderLoop = (render: () => void, debug: Debug) => {
  // Render loop - run render on every frame
  let frameTime = 0;
  let lastLoop = performance.now();
  let thisLoop = performance.now();
  const _redraw = async () => {
    await render();
    // Track a low-pass filtered fps
    thisLoop = performance.now();
    let thisFrameTime = thisLoop - lastLoop;
    frameTime += (thisFrameTime - frameTime) / FPS_LOW_PASS;
    lastLoop = thisLoop;
    debug.fps = 1000 / frameTime;
    requestAnimationFrame(_redraw);
  };
  _redraw();
};
