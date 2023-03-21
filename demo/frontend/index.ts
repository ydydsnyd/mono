import {initialize} from './data';
import {renderer as renderer3D} from './3d-renderer';
import {
  drawSplatter,
  renderFrame,
  doRender,
  setSplatters,
  triggerSplatterRedraw,
} from './texture-renderer';
import initRenderer, {draw_caches, precompute} from '../../vendor/renderer';
import {cursorRenderer} from './cursors';
import {
  UVMAP_SIZE,
  MIN_STEP_MS,
  SHOW_CUSTOM_CURSOR_MIN_Y,
  SHOW_CUSTOM_CURSOR_MAX_Y,
} from '../shared/constants';
import type {Actor, Debug, Letter, Position, Splatter} from '../shared/types';
import {LETTERS} from '../shared/letters';
import {letterMap, now} from '../shared/util';
import {getUserLocation} from './location';
import {initRoom} from './orchestrator';
import {DEBUG_TEXTURES, FPS_LOW_PASS} from './constants';
import {loadClearAnimationFrames} from './textures';

export const init = async () => {
  const initTiming = timing('Demo Load Timing');
  const ready = initTiming('loading demo', 1500);

  type DebugCanvases = [
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
  ];

  // Canvases
  const canvas = document.getElementById('canvas3D') as HTMLCanvasElement;
  let caches: DebugCanvases;
  let serverCacheContexts: Record<Letter, CanvasRenderingContext2D> | undefined;
  if (DEBUG_TEXTURES) {
    caches = LETTERS.map(letter => {
      const tex = document.querySelector(
        `#caches > .${letter}`,
      ) as HTMLCanvasElement;
      tex.width = UVMAP_SIZE;
      tex.height = UVMAP_SIZE;
      return tex.getContext('2d') as CanvasRenderingContext2D;
    }) as DebugCanvases;
    serverCacheContexts = letterMap(letter => {
      const tex = document.querySelector(
        `#server-caches > .${letter}`,
      ) as HTMLCanvasElement;
      tex.width = UVMAP_SIZE;
      tex.height = UVMAP_SIZE;
      return tex.getContext('2d') as CanvasRenderingContext2D;
    });
  }
  const demoContainer = document.getElementById('demo') as HTMLDivElement;

  const debug: Debug = {
    fps: 60,
    cacheUpdated: (letter, cache) => {
      if (serverCacheContexts) {
        const img = new Image();
        img.onload = () => {
          serverCacheContexts![letter].drawImage(img, 0, 0);
        };
        img.src = `data:image/png;base64,${cache}`;
      }
    },
  };

  // Set up 3D renderer
  const init3DDone = initTiming('setting up 3D engine', 1000);
  const {
    render: render3D,
    getTexturePosition,
    resizeCanvas: resize3DCanvas,
    updateTexture,
    // updateDebug,
  } = await renderer3D(canvas);
  init3DDone();

  const roomInitDone = initTiming('finding room', 100);
  const {
    actor,
    clientCount,
    rebucket,
    getDebug: getOrchestratorDebug,
  } = await initRoom();
  roomInitDone();

  // Set up info below demo
  const activeUserCount = document.getElementById(
    'active-user-count',
  ) as HTMLDivElement;

  const initRendererDone = initTiming('initializing renderer module', 100);
  await initRenderer();
  initRendererDone();

  const updateLocation = () => {
    // Get our location and add it when it's ready
    getUserLocation().then(location => {
      updateActorLocation({actorId: actor.id, location});
    });
  };

  const initReflectClientDone = initTiming('initializing reflect client', 20);
  const {
    getState,
    cachesLoaded,
    getSplatters,
    createActorIfMissing,
    updateCursor,
    addSplatter,
    addListener,
    updateActorLocation,
    clearTextures,
  } = await initialize(
    actor,
    online => {
      const dot = document.querySelector('.online-dot');
      if (dot) {
        if (online) {
          dot.classList.remove('offline');
        } else {
          dot.classList.add('offline');
        }
      }
      if (online) {
        updateLocation();
      }
    },
    rebucket,
    debug,
  );
  initReflectClientDone();

  // Draw splatters as we get them
  addListener<Splatter>('splatter', (splatter, deleted, keyParts) => {
    if (!deleted) {
      const letter = keyParts[1] as Letter;
      drawSplatter(now(), letter, splatter);
    }
  });

  // Initialize state
  let {actors, cursors} = await getState();

  // Whenever actors change, update the count
  addListener<Actor>('actor', async () => {
    const count = await clientCount();
    activeUserCount.innerHTML = count + '';
  });

  // Initialize textures
  LETTERS.forEach(letter => updateTexture(letter));

  // Update debug info periodically
  if (window.location.search.includes('debug')) {
    setInterval(async () => {
      const debugEl = document.getElementById('debug');
      if (debugEl) {
        let debugOutput = `actor id: ${actor.id}\n${
          Object.keys(actors).length
        } local actors\n${debug.fps.toFixed(1)} fps\n`;
        const orchestratorInfo = await getOrchestratorDebug();
        debugOutput += `current room: ${orchestratorInfo.currentRoom}\nlocal room:${actor.room}\nroom participants:${orchestratorInfo.currentRoomCount}`;
        debugEl.innerHTML = debugOutput;
      }
      if (caches) {
        draw_caches(...caches);
      }
    }, 200);
  }

  // Set up cursor renderer
  const [localCursor, renderCursors] = cursorRenderer(
    actor.id,
    () => ({actors, cursors}),
    () => demoContainer,
    cursor => {
      // On mobile, don't scroll if we begin by touching a letter. Otherwise,
      // scroll will feel janky.
      const [letter] = getTexturePosition(cursor);
      return !!letter;
    },
    cursor => {
      createActorIfMissing().then(recreated => {
        if (recreated) {
          updateLocation();
        }
      });
      if (
        cursor.y < SHOW_CUSTOM_CURSOR_MIN_Y ||
        cursor.y > SHOW_CUSTOM_CURSOR_MAX_Y
      ) {
        document.body.classList.remove('custom-cursor');
      } else {
        document.body.classList.add('custom-cursor');
      }
      updateCursor({...cursor});
    },
  );

  // When the window is resized, recalculate letter and cursor positions
  const resizeViewport = () => {
    const {width, height} = demoContainer.getBoundingClientRect();
    canvas.height = height * window.devicePixelRatio;
    canvas.width = width * window.devicePixelRatio;
    canvas.style.height = height + 'px';
    canvas.style.width = width + 'px';
    resize3DCanvas();
    renderCursors();
  };
  window.addEventListener('resize', resizeViewport);
  resizeViewport();

  const maybeAddPaint = (at: Position) => {
    const [letter, texturePosition, hitPosition] = getTexturePosition(at);
    if (letter && texturePosition && hitPosition) {
      addSplatter({
        letter,
        actorId: actor.id,
        colorIndex: actor.colorIndex,
        texturePosition,
        hitPosition,
        timestamp: now(),
      });
    }
  };

  // Lazy-load any assets that aren't essential to interactivity.
  // Note that all of these assets are gated behind their loaded-ness when they
  // are accessed, but will likely result in dropped frames if we attempt to use
  // them before we preload them.
  // NOTE: If this takes more than a few ms, move to a worker or otherwise into
  // the bg.
  precompute();
  loadClearAnimationFrames();

  // Add a listener for our cache - when it updates, trigger a full redraw.
  addListener<never>('cache', async (_, deleted, keyParts) => {
    // Deleted caches are handled in the clearing code.
    if (!deleted) {
      const letter = keyParts[1] as Letter;
      // Also make sure that our splatters are re-rendered in the correct order. By
      // resetting the cache of rendered splatters, next frame will re-draw all the
      // splatters in their current order.
      const splatters = await getSplatters(letter);
      setSplatters(letter, splatters);
      triggerSplatterRedraw(letter);
      doRender(letter);
      updateTexture(letter);
    }
  });

  // Wait for round trip confirmation from the server before starting the render
  // loop
  await new Promise<void>(resolve => {
    const serverRoundTripDone = initTiming(
      'waiting for initial server data',
      1000,
    );
    const checkReady = async () => {
      if (!(await cachesLoaded())) {
        setTimeout(checkReady, 25);
        return;
      }
      // After we've started, flip a class on the body
      document.body.classList.add('demo-active');
      serverRoundTripDone();
      ready(true);
      resolve();
    };
    checkReady();
  });

  // Handlers for data resetting
  const resetButton = document.getElementById('reset-button');
  resetButton?.addEventListener('click', async () => {
    await clearTextures(now());
    resetButton.classList.add('cleared');
    setTimeout(() => {
      resetButton.classList.remove('cleared');
    }, 1000);
  });
  let lastClear: number | undefined;
  addListener<number>('cleared', async () => {
    // Set lastClear to now, so that the animation will play all the way through on
    // all clients whenever they happen to receive the clear.
    lastClear = now();
  });

  // Render our cursors and canvases at "animation speed", usually 60fps
  startRenderLoop(
    async () => {
      ({actors, cursors} = await getState());
      // Render our textures, and if they changed, send to the 3D scene.
      renderFrame(now(), lastClear, letter => updateTexture(letter));
      render3D();
      // Splatter if needed
      const {isDown, position} = localCursor();
      if (isDown) {
        maybeAddPaint(position);
      }
    },
    async () => {
      // Our cursors should update every animation frame.
      await renderCursors();
    },
    debug,
  );
};

const startRenderLoop = (
  render: () => Promise<void>,
  renderUngated: () => Promise<void>,
  debug: Debug,
) => {
  // Render loop - run render on every frame
  let frameTime = 0;
  let lastLoop = performance.now();
  let thisLoop = performance.now();
  const _redraw = async () => {
    // Call the renderUngated method on all animation frames (sometimes up to 120fps
    // in some browsers/gpus)
    await renderUngated();
    // Call the render method at ~60fps
    if (performance.now() - lastLoop >= MIN_STEP_MS) {
      await render();
      thisLoop = performance.now();
    }
    // Track a low-pass filtered fps
    let thisFrameTime = thisLoop - lastLoop;
    frameTime += (thisFrameTime - frameTime) / FPS_LOW_PASS;
    lastLoop = thisLoop;
    debug.fps = 1000 / frameTime;
    requestAnimationFrame(_redraw);
  };
  _redraw();
};

export const timing = (name: string) => {
  const emit = (message: string, duration: number, color?: string) => {
    if (duration === -1) {
      return console.log(`%cStart ${message}`, 'color: #9bb3af');
    }
    console.log(
      `%cFinished ${message} in %c${duration.toFixed(0)}ms`,
      'color: #9bb3af',
      `color: ${color}`,
    );
  };
  let inGroup = false;
  return (message: string, good: number) => {
    const taskStart = performance.now();
    if (!inGroup) {
      console.group(name);
      inGroup = true;
    }
    emit(message, -1);
    return (done?: true) => {
      const time = performance.now() - taskStart;
      const color =
        time <= good ? '#00d0aa' : time < good * 2 ? '#f0e498' : '#ff6d91';
      emit(message, time, color);
      if (done) {
        console.groupEnd();
        inGroup = false;
      }
    };
  };
};
