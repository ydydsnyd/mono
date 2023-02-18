import {nanoid} from 'nanoid';
import {initialize} from './data';
import {renderer as renderer3D} from './3d-renderer';
import {render} from './texture-renderer';
import initRenderer from '../../renderer/pkg/renderer';
import {cursorRenderer} from './cursors';
import {
  UVMAP_SIZE,
  FPS_LOW_PASS,
  COLOR_PALATE,
  COLOR_PALATE_END,
  STEP_RENDER_DELAY,
  DEBUG_PHYSICS,
} from '../shared/constants';
import type {Actor, ColorPalate, Letter, Position, Size} from '../shared/types';
import {LETTERS} from '../shared/letters';
import {letterMap, now} from '../shared/util';
import {initRoom} from './init-room';
import {getUserLocation} from './location';
import {get3DPositions} from '../shared/renderer';

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

  const {
    getState,
    updateCursor,
    addSplatter,
    addListener,
    updateActorLocation,
  } = await initialize(roomID, actorId);

  // Get our location and add it when it's ready
  getUserLocation().then(location => {
    updateActorLocation({actorId, location});
  });

  // Initialize state
  let {actors, cursors, rawCaches, splatters, sequences, physics, impulses} =
    await getState();
  let physicsStep = physics?.step || -1;

  // Set up 3D renderer
  const {
    render: render3D,
    getTexturePosition,
    resizeCanvas: resize3DCanvas,
    set3DPosition,
    updateTexture,
    // updateDebug,
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
  // Whenever actors change, update the count
  addListener<Actor>('actor', () => {
    activeUserCount.innerHTML = Object.keys(actors).length + '';
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
      const splatterCount = Object.keys(splatters).reduce(
        (acc, k) => splatters[k as Letter].length + acc,
        0,
      );
      const impulseCount = Object.keys(impulses).reduce(
        (acc, k) => impulses[k as Letter].length + acc,
        0,
      );
      if (debugEl) {
        debugEl.innerHTML = `server physics step ${
          physics?.step || '(unset)'
        }\nrendered physics step ${physicsStep.toFixed(1)}\n${
          Object.keys(actors).length
        } actors\n${splatterCount} splatters\n${impulseCount} impulses\n${debug.fps.toFixed(
          1,
        )} fps\n${LETTERS.map(letter => {
          return `${letter.toUpperCase()} [seq ${
            sequences[letter]
          }]\n   splatters: ${splatters[letter].length}\n   impulses: ${
            impulses[letter].length
          }\n  cache size:\n    ${
            new Blob([rawCaches[letter] || '']).size / 1024
          }k\n`;
        }).join('\n')}`;
      }
    }, 200);
  }

  const addPaint = (at: Position) => {
    const [letter, texturePosition, hitPosition] = getTexturePosition(at);
    if (letter && texturePosition && hitPosition) {
      addSplatter({
        ts: now(),
        letter,
        actorId,
        colorIndex: actors[actorId].colorIndex,
        texturePosition,
        hitPosition,
        sequence: sequences[letter],
        step: Math.round(physicsStep),
      });
    }
  };

  // Set up cursor renderer
  const renderCursors = cursorRenderer(
    actorId,
    () => ({actors, cursors}),
    getScaleFactor,
    addPaint,
    updateCursor,
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
  const renderPhysics = () => {
    const originStep = physics?.step || 0;
    const targetStep = Math.max(originStep - STEP_RENDER_DELAY, 0);
    // Ideally, we should always be rendering STEP_RENDER_DELAY steps behind the
    // origin. This is so that if we add impulses in our "past", we won't see them
    // jerkily reconcile.
    // If we render too quickly or too slowly, adjust our steps so that it will
    // converge on the target step.
    if (physicsStep < targetStep) {
      // If we're behind, catch up half the distance
      physicsStep += targetStep - physicsStep;
    } else if (physicsStep > originStep) {
      // If we're ahead, render at .5 speed
      physicsStep += 0.5;
    } else {
      physicsStep += 1;
    }
    // positions3d
    const positions3d = get3DPositions(
      Math.floor(physicsStep) - originStep,
      impulses,
    );
    LETTERS.forEach(letter => {
      const position3d = positions3d[letter];
      if (position3d) {
        set3DPosition(letter, position3d);
      }
    });
    if (DEBUG_PHYSICS) {
      // TODO: fix this
      // let world = World.restoreSnapshot(debugState);
      // updateDebug(world.debugRender());
    }
  };

  // Render our cursors and canvases at "animation speed", usually 60fps
  startRenderLoop(async () => {
    ({actors, cursors, rawCaches, splatters, sequences, physics, impulses} =
      await getState());
    await renderCursors();
    // Each frame, render our textures
    render(textures, splatters, colors);
    // Update textures and render the 3D scene
    LETTERS.forEach(letter => updateTexture(letter));
    renderPhysics();
    render3D();
  }, debug);

  // After we've started, flip a class on the body
  document.body.classList.add('demo-active');
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
