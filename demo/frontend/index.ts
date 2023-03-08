import {initialize} from './data';
import {renderer as renderer3D} from './3d-renderer';
import {
  drawSplatter,
  loadClearAnimationFrames,
  renderFrame,
  renderInitialFrame,
} from './texture-renderer';
import initRenderer, {draw_caches, precompute} from '../../vendor/renderer';
import {cursorRenderer} from './cursors';
import {
  UVMAP_SIZE,
  COLOR_PALATE,
  COLOR_PALATE_END,
  SPLATTER_MS,
  MIN_STEP_MS,
} from '../shared/constants';
import type {
  Actor,
  ColorPalate,
  Letter,
  Position,
  Splatter,
} from '../shared/types';
import {LETTERS} from '../shared/letters';
import {letterMap, now} from '../shared/util';
import {getUserLocation} from './location';
import {initRoom} from './orchestrator';
import {DEBUG_TEXTURES, FPS_LOW_PASS} from './constants';

type LetterCanvases = Record<Letter, HTMLCanvasElement>;

type Debug = {
  fps: number;
};

export const init = async () => {
  const initTiming = timing('Demo Load Timing');
  const ready = initTiming('loading demo', 1500);

  const debug: Debug = {fps: 60};
  type DebugCanvases = [
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
  ];

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
  let caches: DebugCanvases;
  if (DEBUG_TEXTURES) {
    caches = LETTERS.map(letter => {
      const tex = document.querySelector(
        `#caches > .${letter}`,
      ) as HTMLCanvasElement;
      tex.width = UVMAP_SIZE;
      tex.height = UVMAP_SIZE;
      return tex.getContext('2d') as CanvasRenderingContext2D;
    }) as DebugCanvases;
  }
  const demoContainer = document.getElementById('demo') as HTMLDivElement;

  // Set up 3D renderer
  const init3DDone = initTiming('setting up 3D engine', 1000);
  const {
    render: render3D,
    getTexturePosition,
    resizeCanvas: resize3DCanvas,
    updateTexture,
    // updateDebug,
  } = await renderer3D(canvas, textures);
  init3DDone();

  const roomInitDone = initTiming('finding room', 100);
  const {actor, getDebug: getOrchestratorDebug} = await initRoom();
  roomInitDone();

  // Set up info below demo
  const activeUserCount = document.getElementById(
    'active-user-count',
  ) as HTMLDivElement;

  const initRendererDone = initTiming('initializing renderer module', 100);
  await initRenderer();
  initRendererDone();

  const colors: ColorPalate = [
    [COLOR_PALATE[0], COLOR_PALATE_END[0]],
    [COLOR_PALATE[1], COLOR_PALATE_END[1]],
    [COLOR_PALATE[2], COLOR_PALATE_END[2]],
    [COLOR_PALATE[3], COLOR_PALATE_END[3]],
    [COLOR_PALATE[4], COLOR_PALATE_END[4]],
  ];

  const initReflectClientDone = initTiming('initializing reflect client', 20);
  const {
    getState,
    updateCursor,
    addSplatter,
    addListener,
    updateActorLocation,
    clearTextures,
    initialSplatters,
  } = await initialize(actor);
  initReflectClientDone();

  // Get our location and add it when it's ready
  getUserLocation().then(location => {
    updateActorLocation({actorId: actor.id, location});
  });

  // Whenever actors change, update the count
  addListener<Actor>('actor', () => {
    activeUserCount.innerHTML = Object.keys(actors).length + '';
  });

  // Draw splatters as we get them
  addListener<Splatter>('splatter', (splatter, deleted, keyParts) => {
    if (!deleted) {
      const letter = keyParts[1] as Letter;
      drawSplatter(now(), letter, splatter);
    }
  });
  // Draw an initial frame to make sure we have caches and that we have splatters
  // that happened between the last cache and when we started listening for new
  // splatters.
  renderInitialFrame(textures, initialSplatters, colors);

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
  addListener<never>('cleared', async () => {
    // Set lastClear to now, so that the animation will play all the way through on
    // all clients whenever they happen to receive the clear. TODO: does this
    // interleave properly with additions when latent/offline?
    lastClear = now();
  });

  // Initialize state
  let {actors, physicsStep, cursors} = await getState();
  let localStep = physicsStep;

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
    updateCursor,
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

  // Step management
  const updateStep = () => {
    if (localStep < physicsStep) {
      // If we're behind, run at 1.5x speed until we do
      localStep += 2;
    } else {
      localStep += 1;
    }
  };

  // Set up physics rendering
  // let lastRenderedPhysicsStep = physicsStep;
  // const renderPhysics = () => {
  //   updateCurrentStep(localStep);
  //   const targetStep = Math.round(localStep);
  //   if (targetStep === lastRenderedPhysicsStep) {
  //     // Skip no-ops
  //     return;
  //   }
  //   // positions3d
  //   const positions3d = get3DPositions(targetStep, impulses);
  //   lastRenderedPhysicsStep = targetStep;
  //   if (positions3d) {
  //     LETTERS.forEach(letter => {
  //       const position3d = positions3d[letter];
  //       if (position3d) {
  //         set3DPosition(letter, position3d);
  //       }
  //     });
  //   }
  //   if (DEBUG_PHYSICS) {
  //     // TODO: fix this
  //     // let world = World.restoreSnapshot(debugState);
  //     // updateDebug(world.debugRender());
  //   }
  // };

  // We want to add a paint splatter if we're over a letter, and if _either_ we're
  // "rapid firing" on a single letter, or if we're encountering a new letter.
  // This gets us a best of both worlds, in that we won't fire too much on a
  // single letter (which looks bad), but we also will always fire as soon as
  // we're over a letter, even if that would cause our firing rate to be faster
  // than SPLATTER_MS
  let lastSplatter = 0;
  let lastLetter: Letter | undefined;
  const maybeAddPaint = (at: Position) => {
    const [letter, texturePosition, hitPosition] = getTexturePosition(at);
    if (letter && texturePosition && hitPosition) {
      const newLetter = letter !== lastLetter;
      const rapidFireOk = !newLetter && now() - lastSplatter >= SPLATTER_MS;
      if (newLetter || rapidFireOk) {
        lastLetter = letter;
        lastSplatter = now();
        addSplatter({
          letter,
          actorId: actor.id,
          colorIndex: actor.colorIndex,
          texturePosition,
          hitPosition,
          timestamp: now(),
          step: Math.round(localStep),
        });
      }
    }
  };

  // Render our cursors and canvases at "animation speed", usually 60fps
  startRenderLoop(
    async () => {
      ({actors, physicsStep, cursors} = await getState());
      // Increment our step
      updateStep();
      // Render our textures, and if they changed, send to the 3D scene.
      renderFrame(now(), textures, colors, lastClear, letter =>
        updateTexture(letter),
      );
      // renderPhysics();
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

  // After we've started, flip a class on the body
  document.body.classList.add('demo-active');
  ready(true);

  // Lazy-load any assets that aren't essential to interactivity.
  // Note that all of these assets are gated behind their loaded-ness when they
  // are accessed, but will likely result in dropped frames if we attempt to use
  // them before we preload them.
  const assetLoadTiming = timing('Preload Assets');
  const doneLoadingAssets = assetLoadTiming('loading assets', 1000);
  const precomputeSplattersDone = assetLoadTiming(
    'precomputing splatters',
    500,
  );
  await precompute();
  precomputeSplattersDone();
  const preloadClearFrames = assetLoadTiming(
    'loading clear animation frames',
    500,
  );
  await loadClearAnimationFrames();
  preloadClearFrames();
  doneLoadingAssets(true);
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
