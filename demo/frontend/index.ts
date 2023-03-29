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
import type {
  Actor,
  AnyActor,
  Debug,
  Letter,
  OrchestratorActor,
  Position,
  RoomRecording,
  Splatter,
} from '../shared/types';
import {LETTERS} from '../shared/letters';
import {letterMap, now} from '../shared/util';
import {getRandomLocation, getUserLocation} from './location';
import {initRoom} from './orchestrator';
import {DEBUG_TEXTURES, FPS_LOW_PASS} from './constants';
import {loadClearAnimationFrames} from './textures';
import {nanoid} from 'nanoid';

export type DemoAPI = {
  toggleRecording: () => void;
  playRecording: (id: string) => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  getRecordings: () => Promise<{
    actorId: string;
    currentRecordingId?: string;
    recordings: {
      id: string;
      frames: number;
    }[];
    activeRecordings: RoomRecording[];
  }>;
  onRefresh: (refresh: () => void) => void;
};

export const init = async (): Promise<DemoAPI> => {
  const initTiming = timing('Demo Load Timing');
  const ready = initTiming('loading demo', 1500);

  type DebugCanvases = [
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
    CanvasRenderingContext2D,
  ];

  const getGuaranteeActor = (): [
    (actor: AnyActor) => Promise<void>,
    (createFn: (actor: AnyActor) => Promise<void>) => Promise<void>,
  ] => {
    let actorsToCreate: AnyActor[] = [];
    let createFn: ((actor: AnyActor) => Promise<void>) | undefined;
    return [
      async (actor: AnyActor) => {
        if (createFn) {
          await createFn(actor);
        } else {
          actorsToCreate.push(actor);
        }
      },
      async (fn: (actor: AnyActor) => Promise<void>) => {
        createFn = fn;
        if (actorsToCreate) {
          for await (const actor of actorsToCreate) {
            await createFn(actor);
          }
        }
      },
    ];
  };

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
  } = await renderer3D(canvas);
  init3DDone();

  const roomInitDone = initTiming('finding room', 100);
  const playingRecordings: Record<string, RoomRecording> = {};
  const recordingFrame: Record<string, number> = {};
  const [guaranteeActor, setGuaranteeActor] = getGuaranteeActor();
  const {
    actor,
    getOrchestratorActorIds,
    clientCount,
    rebucket,
    recordCursor,
    playRecording,
    deleteRecording,
    finishRecording,
    getRecordingFrame,
    getDebug: getOrchestratorDebug,
  } = await initRoom(
    (recording: RoomRecording) => {
      console.log('Start playing recording', recording.recordingId);
      recordingFrame[recording.recordingId] = 1;
      playingRecordings[recording.recordingId] = recording;
    },
    async (botActor: OrchestratorActor) => {
      console.log('bot actor', botActor);
      const location = getRandomLocation();
      await guaranteeActor({...botActor, location});
    },
  );
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
    removeBot,
    guaranteeActor: guaranteeActorMutation,
  } = await initialize(
    actor,
    await getOrchestratorActorIds(),
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
  await setGuaranteeActor(guaranteeActorMutation);
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
  const showDebug = window.location.search.includes('debug');
  if (showDebug) {
    setInterval(async () => {
      const debugContentEl = document.querySelector('#debug .content');
      if (debugContentEl) {
        let debugOutput = `actor id: ${actor.id}\n${
          Object.keys(actors).length
        } local actors\n${debug.fps.toFixed(1)} fps\n`;
        const orchestratorInfo = await getOrchestratorDebug();
        debugOutput += `current room: ${orchestratorInfo.currentRoom}\nlocal room:${actor.room}\nroom participants:${orchestratorInfo.currentRoomCount}`;
        debugContentEl.innerHTML = debugOutput;
      }
      if (caches) {
        draw_caches(...caches);
      }
    }, 200);
    document.addEventListener('keypress', (e: KeyboardEvent) => {
      if (e.key === '®') {
        if (currentRecordingId) {
          stopRecording();
        } else {
          startRecording();
        }
      }
    });
  }

  // Set up cursor renderer
  let currentRecordingId: string | undefined;
  const startRecording = () => {
    currentRecordingId = nanoid();
  };
  const stopRecording = () => {
    currentRecordingId = undefined;
  };
  const [localCursor, renderCursors, getCursorPosition] = cursorRenderer(
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
      if (currentRecordingId) {
        recordCursor(currentRecordingId, {...cursor});
      }
      updateCursor({...cursor});
    },
    showDebug,
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

  const maybeAddPaint = (
    at: Position,
    isMobile: boolean,
    actorId?: string,
    colorIndex?: number,
  ) => {
    const [letter, texturePositions, hitPosition] = getTexturePosition(at);
    if (letter && texturePositions && hitPosition) {
      for (const texturePosition of texturePositions) {
        addSplatter({
          letter,
          actorId: actorId || actor.id,
          colorIndex: colorIndex || actor.colorIndex,
          texturePosition,
          large: isMobile,
          hitPosition,
          timestamp: now(),
        });
      }
    }
  };

  // Lazy-load any assets that aren't essential to interactivity.
  // Note that all of these assets are gated behind their loaded-ness when they
  // are accessed, but will likely result in dropped frames if we attempt to use
  // them before we preload them.
  // NOTE: If this takes more than a few ms, move to a worker or otherwise into
  // the bg.
  precompute();
  // Kick off some preloading that can happen async
  loadClearAnimationFrames().catch(err => {
    console.error('Failed preloading clear animations');
    console.error(err);
  });

  const redrawTexture = async (letter: Letter) => {
    // Make sure that our splatters are re-rendered in the correct order. By
    // resetting the cache of rendered splatters, next frame will re-draw all the
    // splatters in their current order.
    const splatters = await getSplatters(letter);
    setSplatters(letter, splatters);
    triggerSplatterRedraw(letter);
    doRender(letter);
    updateTexture(letter);
  };

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
  // After we have caches, draw them + the splatters
  for await (const letter of LETTERS) {
    await redrawTexture(letter);
  }

  // Add a listener for our cache - when it updates, trigger a full redraw.
  addListener<never>('cache', async (_, deleted, keyParts) => {
    // Deleted caches are handled in the clearing code.
    if (!deleted) {
      const letter = keyParts[1] as Letter;
      redrawTexture(letter);
    }
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
      const {isDown, position, isMobile} = localCursor();
      if (isDown) {
        maybeAddPaint(position, isMobile);
      }
      // If we're playing a recording, do that
      for (const recordingId in playingRecordings) {
        const recording = playingRecordings[recordingId];
        const frame = recordingFrame[recordingId];
        const cursor = await getRecordingFrame(
          recordingId,
          recording.botId,
          frame,
        );
        if (cursor) {
          await updateCursor(cursor);
          const cursorPagePosition = getCursorPosition(cursor);
          await maybeAddPaint(
            cursorPagePosition,
            false,
            recording.botId,
            recording.colorIdx,
          );
          recordingFrame[recordingId] += 1;
        } else {
          delete playingRecordings[recordingId];
          delete recordingFrame[recordingId];
          await finishRecording(recordingId, recording.roomId, recording.botId);
          await removeBot(recording.botId);
        }
      }
    },
    async () => {
      // Our cursors should update every animation frame.
      await renderCursors();
    },
    debug,
  );

  return {
    toggleRecording: () => {
      if (currentRecordingId) {
        stopRecording();
      } else {
        startRecording();
      }
    },
    playRecording: async (recordingId: string) => {
      await playRecording(recordingId, actor.room);
    },
    deleteRecording,
    getRecordings: async () => {
      const debug = await getOrchestratorDebug();
      return {
        actorId: actor.id,
        currentRecordingId,
        recordings: debug.recordings,
        activeRecordings: debug.activeRecordings,
      };
    },
    onRefresh: (refresh: () => void) => {
      setInterval(refresh, 250);
    },
  };
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
