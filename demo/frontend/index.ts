import {initialize} from './data';
import {cursorRenderer} from './cursors';
import {
  MIN_STEP_MS,
  SHOW_CUSTOM_CURSOR_MIN_Y,
  SHOW_CUSTOM_CURSOR_MAX_Y,
} from '../shared/constants';
import {
  Debug,
  Actor,
  Broadcast,
  ActorID,
  ActivePuzzlePiece,
  PieceOrder,
  RecordingType,
  PieceNumber,
  Position,
} from '../shared/types';
import {distance, getLazyFunction, randFloat} from '../shared/util';
import {getUserLocation} from './location';
import {initRoom} from './orchestrator';
import {FPS_LOW_PASS} from './constants';
import {nanoid} from 'nanoid';
import {OP} from './data-util';
import {
  createPieceElements,
  currentPiece,
  hitTestPieces,
  renderPieces,
  updatePiecesWithCursor,
  updateRotationHandles,
} from './render-pieces';
import {visualizeRecording} from './debug';
import {PUZZLE_PIECES} from '../shared/puzzle-pieces';
import {positionToCoordinate, screenSize} from './coordinates';

export type DemoAPI = {
  toggleRecording: () => void;
  playRecording: (id: string) => Promise<void>;
  deleteRecording: (id: string) => Promise<void>;
  getRecordings: () => Promise<{
    actorID: string;
    currentRecordingId?: string;
    recordings: {
      id: string;
      frames: number;
      type: RecordingType;
    }[];
    activeRecordings: Broadcast[];
  }>;
  onRefresh: (refresh: () => void) => void;
};

export const init = async (): Promise<DemoAPI> => {
  const initTiming = timing('Demo Load Timing');
  const ready = initTiming('loading demo', 1500);

  const debug: Debug = {
    fps: 60,
  };
  const demoContainer = document.getElementById('demo') as HTMLDivElement;
  const pieceContainer = document.getElementById('pieces') as HTMLDivElement;

  // Set up info below demo
  const activeUserCount = document.getElementById(
    'active-user-count',
  ) as HTMLDivElement;

  const playingRecordings: Record<string, Broadcast> = {};
  const recordingFrame: Record<string, number> = {};
  const [setPresentActors, setSetPresentActors] = getLazyFunction<ActorID[]>();
  const [getPlacedPieces, setGetPlacedPieces] = getLazyFunction<
    undefined,
    PieceNumber[]
  >();
  let actors: Record<ActorID, Actor> = {};
  let actor: Actor;
  const initOrchestrator = async () => {
    const roomInitDone = initTiming('find-room', 300);
    try {
      return await initRoom(
        (broadcast, frames) => {
          console.log('Start playing recording', broadcast.broadcastId);
          recordingFrame[broadcast.broadcastId] = 1;
          playingRecordings[broadcast.broadcastId] = broadcast;
          visualizeRecording(broadcast, frames);
        },
        async (newActors: Actor[]) => {
          activeUserCount.innerHTML = newActors.length + '';
          newActors.forEach(a => (actors[a.id] = a));
          setPresentActors(newActors.map(a => a.id));
        },
        localActor => (actor = localActor),
        async online => {
          if (!online) {
            // Don't play back recordings when offline, since we shouldn't see other users
            for (const broadcastId in playingRecordings) {
              const broadcast = playingRecordings[broadcastId];
              delete playingRecordings[broadcastId];
              delete recordingFrame[broadcastId];
              await finishBroadcast(
                broadcastId,
                broadcast.recordingId,
                broadcast.roomId,
                broadcast.botId,
              );
            }
          }
        },
        async () => await getPlacedPieces(undefined),
      );
    } finally {
      roomInitDone();
    }
  };

  const initOrchestratorDone = initTiming('initializing orchestrator', 500);
  const {
    actor: initActor,
    recordCursor,
    finishRecording,
    playRecording,
    deleteRecording,
    finishBroadcast,
    getRecordingFrame,
    updateActorLocation,
    getDebug: getOrchestratorDebug,
  } = await initOrchestrator();
  actor = initActor;
  initOrchestratorDone();

  const updateLocation = () => {
    // Get our location and add it when it's ready
    getUserLocation().then(location => {
      updateActorLocation(location);
    });
  };

  const pieceYLimits = {min: 0, max: 0};
  const updatePieceYLimits = () => {
    pieceYLimits.min = document
      .querySelector('nav')!
      .getBoundingClientRect().height;
    const intro = document.querySelector('#intro')!.getBoundingClientRect();
    pieceYLimits.max = intro.top + intro.height;
  };
  updatePieceYLimits();

  const initReflectClientDone = initTiming('initializing reflect client', 20);
  const {
    state,
    mutators,
    addListener,
    getPieceOrder,
    getPlacedPieces: getPlacedPiecesFn,
  } = await initialize(actor, generateRandomPieces(), async online => {
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
  });
  setGetPlacedPieces(async () => getPlacedPiecesFn());
  setSetPresentActors(mutators.setPresentActors);
  initReflectClientDone();

  let pieceOrder: PieceOrder[] = [];
  addListener<ActivePuzzlePiece>('piece', (_, op) => {
    if (op === OP.ADD) {
      // when we add pieces, make sure we have them locally
      createPieceElements(
        state.pieces,
        pieceContainer,
        demoContainer,
        () => state.cursors[actor.id],
        mutators,
      );
    }
  });
  addListener<PieceOrder>('piece-order', async () => {
    // Maintain an ordered list of pieces. This is necessary because our orders are
    // very large, so they're inappropriate for use as z-index directly. Also note
    // that they're ordered front-to-back, so things like hit testing can happen
    // without re-ordering.
    pieceOrder = await getPieceOrder();
  });
  createPieceElements(
    state.pieces,
    pieceContainer,
    demoContainer,
    () => state.cursors[actor.id],
    mutators,
  );

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

  const resetButton = document.getElementById('reset-button');
  resetButton?.addEventListener('click', async () => {
    await mutators.initializePuzzle({
      force: true,
      pieces: generateRandomPieces(),
    });
    resetButton.classList.add('cleared');
    setTimeout(() => {
      resetButton.classList.remove('cleared');
    }, 1000);
  });

  // Set up cursor renderer
  let currentRecordingId: string | undefined;
  let lastRecordingId: string | undefined;
  let currentRecordingType = RecordingType.BROWSE;
  const startRecording = () => {
    currentRecordingType = RecordingType.BROWSE;
    currentRecordingId = nanoid();
  };
  const startPlaceRecording = () => {
    if (currentRecordingId) {
      lastRecordingId = currentRecordingId;
      finishRecording(currentRecordingId);
    }
    currentRecordingId = nanoid();
    currentRecordingType = RecordingType.PLACE;
  };
  const stopRecording = () => {
    if (currentRecordingId) {
      lastRecordingId = currentRecordingId;
      finishRecording(currentRecordingId);
    }
    currentRecordingId = undefined;
  };

  function generateRandomPieces() {
    const ss = screenSize();
    const selectedPositions: Position[] = [];

    // This uses Mitchell's best candidate algorithm to generate the initial
    // positions for the puzzle: https://gist.github.com/mbostock/1893974.
    // The idea, roughly, is to loop through each piece and choose a random
    // position that's farthese from other pieces.

    const edgeBuffer = 10;
    const approxPieceSize = 50;

    const getCandidates = () => {
      return new Array(10).fill(0).map(() => {
        const pos = {
          x: randFloat(edgeBuffer, ss.width - approxPieceSize - edgeBuffer),
          y: randFloat(pieceYLimits.min, pieceYLimits.max),
        };
        let minDist = Infinity;
        for (const selectedPos of selectedPositions) {
          const d = distance(selectedPos, pos);
          if (d < minDist) {
            minDist = d;
          }
        }
        return {
          pos,
          minDist,
        };
      });
    };

    for (let i = 0; i < PUZZLE_PIECES.length; i++) {
      const candidates = getCandidates();
      const farthest = candidates.reduce((best, cand) => {
        if (cand.minDist > best.minDist) {
          return cand;
        }
        return best;
      }, candidates[0]);
      selectedPositions.push(farthest.pos);
    }

    const ret: ActivePuzzlePiece[] = [];
    for (const pos of selectedPositions) {
      const coord = positionToCoordinate(pos, demoContainer, ss);
      const newPiece: ActivePuzzlePiece = {
        ...PUZZLE_PIECES[ret.length],
        ...coord,
        number: ret.length,
        rotation: randFloat(0, Math.PI * 2),
        placed: false,
        handlePosition: {x: -1, y: -1},
        moverID: '',
        rotatorID: '',
      };
      ret.push(newPiece);
    }

    return ret;
  }

  const [renderCursors, getCursorPosition] = cursorRenderer(
    actor.id,
    () => actors,
    () => state.cursors,
    () => demoContainer,
    cursor => {
      // On mobile, don't scroll if we begin by touching an interactive object.
      // Otherwise, scroll will feel janky.
      return (
        hitTestPieces(cursor, state.pieces, pieceOrder, demoContainer) !== -1
      );
    },
    async cursor => {
      if (
        cursor.y < SHOW_CUSTOM_CURSOR_MIN_Y ||
        cursor.y > SHOW_CUSTOM_CURSOR_MAX_Y
      ) {
        document.body.classList.remove('custom-cursor');
      } else {
        document.body.classList.add('custom-cursor');
      }
      if (currentRecordingId) {
        recordCursor(
          currentRecordingId,
          cursor,
          currentRecordingType,
          lastRecordingId,
        );
      }
      mutators.updateCursor({...cursor});
      await updatePiecesWithCursor(
        cursor,
        getCursorPosition(cursor),
        state.pieces,
        pieceOrder,
        demoContainer,
        mutators,
        pieceYLimits,
        () => {
          if (currentRecordingId) {
            startPlaceRecording();
          }
        },
        () => {
          if (
            currentRecordingId &&
            currentRecordingType === RecordingType.PLACE
          ) {
            finishRecording(currentRecordingId);
          }
        },
      );
    },
    showDebug,
  );

  // When the window is resized, recalculate cursor positions
  const resizeViewport = () => {
    renderCursors();
    updatePieceYLimits();
  };
  window.addEventListener('resize', resizeViewport);
  resizeViewport();

  let renderedFirstFrameDone: ReturnType<typeof initTiming> | null = initTiming(
    'renderFirstFrame',
    5,
  );

  // Wait for round trip confirmation from the server before starting the render
  // loop
  await new Promise<void>(resolve => {
    const serverRoundTripDone = initTiming('receive-initial-server-data', 1000);
    const checkReady = async () => {
      // if (!(await cachesLoaded())) {
      //   setTimeout(checkReady, 25);
      //   return;
      // }
      serverRoundTripDone();
      resolve();
    };
    checkReady();
  });

  // After we've started, flip a class on the body
  document.body.classList.add('demo-active');

  // Render our cursors and canvases at "animation speed", usually 60fps
  startRenderLoop(
    async () => {
      if (renderedFirstFrameDone) {
        renderedFirstFrameDone();
        ready(true);
        renderedFirstFrameDone = null;
      }

      // Render pieces
      await renderPieces(state.pieces, pieceOrder, demoContainer);

      // If we're playing a recording, do that
      for (const broadcastId in playingRecordings) {
        const broadcast = playingRecordings[broadcastId];
        const frame = recordingFrame[broadcastId];
        const cursor = await getRecordingFrame(
          broadcast.recordingId,
          broadcast.botId,
          frame,
        );
        if (cursor) {
          await mutators.updateCursor({...cursor});
          await updatePiecesWithCursor(
            cursor,
            getCursorPosition(cursor),
            state.pieces,
            pieceOrder,
            demoContainer,
            mutators,
            pieceYLimits,
          );
          recordingFrame[broadcastId] += 1;
        } else {
          delete playingRecordings[broadcastId];
          delete recordingFrame[broadcastId];
          let piecePosition: Position | undefined;
          if (broadcast.pieceNum !== undefined) {
            const piece = state.pieces[broadcast.pieceNum];
            piecePosition = {
              x: piece.x,
              y: piece.y,
            };
          }
          await finishBroadcast(
            broadcastId,
            broadcast.recordingId,
            broadcast.roomId,
            broadcast.botId,
            broadcast.pieceNum,
            piecePosition,
          );
        }
      }

      // Render handles
      await updateRotationHandles(state.pieces, pieceOrder, demoContainer);
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
      await playRecording(
        recordingId,
        actor.room,
        state.pieces.reduce((positions, piece) => {
          positions[piece.number] = {
            x: piece.x,
            y: piece.y,
          };
          return positions;
        }, {} as Record<PieceNumber, Position>),
        currentPiece(actor.id),
      );
    },
    deleteRecording,
    getRecordings: async () => {
      const debug = await getOrchestratorDebug();
      return {
        actorID: actor.id,
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
      performance.mark(`${name}-${message} start`);
      return console.log(`%cStart ${message}`, 'color: #9bb3af');
    }
    performance.mark(`${name}-${message} end`);
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
