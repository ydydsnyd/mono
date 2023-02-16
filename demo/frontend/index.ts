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
  POINT_MAX_MS,
  SCALE_SPEED,
  STEP_RENDER_DELAY,
} from '../shared/constants';
import {
  ColorPalate,
  Cursor,
  Letter,
  LetterCache,
  LetterOwner,
  LetterPosition,
  LetterRotation,
  LetterScale,
  Position,
  Size,
  Tool,
} from '../shared/types';
import {LETTERS} from '../shared/letters';
import {letterMap, now, distance, must, scalePosition} from '../shared/util';
import {addDragHandlers, Control, ControlTools} from './dragging';
import {initTools, toolMap} from './tools';
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

// TODO: DRY uses of getScaleFactor with downscale() and corresponding upscale().
const downscale = (p: Position) => {
  const sf = getScaleFactor();
  return {x: p.x / sf.width, y: p.y / sf.height};
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

  const {
    getState,
    addListener,
    updateCursor,
    addPoint,
    updateActorLocation,
    updateLetterScale,
    updateLetterPosition,
    updateLetterRotation,
    switchToTool,
    takeOwner,
    freeOwner,
    // reflectClient,
  } = await initialize(roomID, actorId);

  // Get our location and add it when it's ready
  getUserLocation().then(location => {
    updateActorLocation({actorId, location});
  });

  // Initialize state
  let {
    actors,
    cursors,
    rawCaches,
    points,
    positions,
    scales,
    rotations,
    sequences,
    tools,
    physics,
    impulses,
  } = await getState();

  // Tools
  initTools(
    toolMap(
      tool => document.getElementById(`${tool}-tool`) as HTMLButtonElement,
    ),
    () => tools[actorId],
    tool => switchToTool({actorId, tool}),
  );

  // Set up 3D renderer
  const {
    render: render3D,
    getTexturePosition,
    resizeCanvas: resize3DCanvas,
    setRotation,
    setPosition,
    setQuaternion,
    setScale,
    updateTexture,
    setGlowing,
    updateDebug,
  } = await renderer3D(canvas, textures);
  // Initialize positions
  LETTERS.forEach(letter => {
    setRotation(letter, rotations[letter]);
    setScale(letter, scales[letter]);
    setPosition(letter, positions[letter]);
  });

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

  // Add handlers for dragging
  const getDragInfo = addDragHandlers(
    document.body,
    () => scales,
    () => rotations,
    () => positions,
    (position: Position) => {
      const [letter] = getTexturePosition(position);
      return letter;
    },
    (letter: Letter) => {
      if (getDragInfo()) {
        takeOwner({letter, actorId});
      } else {
        freeOwner({letter, actorId});
      }
    },
  );

  // Because reflect changes data at 60fps, we can just tell our renderer to
  // change values when our data changes and things will be smooth
  addListener<LetterRotation>('rotation', ({letter, rotation}) => {
    setRotation(letter, rotation);
  });
  addListener<LetterScale>('scale', ({letter, scale}) => {
    setScale(letter, scale);
  });
  addListener<LetterPosition>('position', ({letter, position}) => {
    setPosition(letter, position);
  });
  // When owner changes, update glow
  addListener<LetterOwner>('owner', (owner, deleted) => {
    if (!deleted) {
      const actor = must(actors[owner.actorId]);
      const colorIndex = actor.colorIndex;
      setGlowing(owner.letter, true, colors[colorIndex][0]);
    } else {
      setGlowing(owner.letter, false);
    }
  });
  // When we get a new cache, reset the local one.
  addListener<LetterCache>('cache', ({letter}) => {
    renderPointsIndex[letter] = 0;
  });

  // Initialize textures
  LETTERS.forEach(letter => updateTexture(letter));

  // performActions should be periodically called - it will take the current
  // state, the current mouse position and drag info, and perform any mutations
  // necessary to update the state.
  let lastLetter: Letter | undefined = undefined;
  let currentGroup = -1;
  let inlineControls = false;
  let lastPoint = 0;
  const performActions = async () => {
    const scaleFactor = getScaleFactor();
    ({
      actors,
      rawCaches,
      cursors,
      points,
      positions,
      scales,
      rotations,
      sequences,
      tools,
      physics,
      impulses,
    } = await getState());
    activeUserCount.innerHTML = Object.keys(actors).length + '';
    for (const [_, cursor] of Object.entries(cursors)) {
      const actor = must(actors[cursor.actorId]);
      if (actor.id !== actorId) {
        continue;
      }
      const position = scalePosition(cursor, scaleFactor);
      const pointer = !actor.isBot ? getPointer() : undefined;
      let tool = tools[actor.id];
      const drag = getDragInfo();
      if (
        actor.id == actorId &&
        drag &&
        drag.control !== Control.None &&
        inlineControls
      ) {
        tool = ControlTools[drag.control];
      }
      if (tool === Tool.PAINT) {
        if (pointer) {
          pointer.style.opacity = '1';
        }
        document.body.classList.remove('moving');
        document.body.classList.add('painting');
        if (performance.now() > lastPoint + POINT_MAX_MS) {
          lastPoint = performance.now();
          // If we're painting, add a point for our current cursor
          const colorIndex = actors[actor.id]!.colorIndex;
          let isPainting = false;
          // These have to iterate in order of z-index
          const [letter, texturePosition, hitPosition] =
            getTexturePosition(position);
          if (letter && texturePosition && hitPosition) {
            isPainting = true;
            // When we enter a new letter, update our current group. Since these groups are
            // used to organize the points, this will make sure that the last person to
            // enter the letter is always on top.
            if (letter !== lastLetter) {
              currentGroup = now();
            }
            lastLetter = letter;
            addPoint({
              letter,
              actorId: actor.id,
              texturePosition,
              scale: 1,
              // scale: scales[letter],
              ts: now(),
              colorIndex,
              sequence: sequences[letter],
              group: currentGroup,
              hitPosition,
              step: physicsStep,
            });
          }
          if (!isPainting) {
            lastLetter = undefined;
          }
        }
      } else {
        if (pointer) {
          pointer.style.opacity = '0';
        }
        document.body.classList.add('moving');
        document.body.classList.remove('painting');
        // Otherwise, if we're dragging, move, scale, or rotate the letter
        if (drag && drag.letter) {
          document.body.classList.add('active');
          switch (tool) {
            case Tool.MOVE:
              // When we start dragging, we store the original position as drag.position.
              // The final result should be the start position plus the relative movement.
              const start = scalePosition(drag.position, scaleFactor);
              const relative = {
                x: position.x - drag.start.x,
                y: position.y - drag.start.y,
              };
              updateLetterPosition({
                letter: drag.letter,
                position: downscale({
                  x: start.x + relative.x,
                  y: start.y + relative.y,
                }),
              });
              break;
            case Tool.SCALE:
              let pxdiff = distance(drag.start, position);
              if (drag.start.x > position.x) {
                pxdiff = -pxdiff;
              }
              const scale = (pxdiff / scaleFactor.width) * SCALE_SPEED;
              updateLetterScale({
                letter: drag.letter,
                scale: drag.scale + scale,
              });
              break;
            case Tool.ROTATE:
              const pctdiff = (position.x - drag.start.x) / scaleFactor.width;
              const degrees = pctdiff * 360;
              // const spin = div.querySelector('.spin') as HTMLDivElement;
              // if (spin) {
              //   spin.style.transform = `rotate3d(1, 0, 0, 80deg) rotate(${degrees}deg)`;
              // }
              updateLetterRotation({
                letter: drag.letter,
                rotation: (drag.rotation + degrees) % 360,
              });
              break;
          }
        }
      }
      if (!drag) {
        document.body.classList.remove('active');
      }
    }
  };

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
    (canHover: boolean) => {
      inlineControls = canHover;
      const classes = document.querySelector('body')?.classList;
      if (classes) {
        if (canHover) {
          // classes.add('hover-device');
        } else {
          // classes.remove('hover-device');
        }
      }
    },
    (cursor: Cursor) => {
      updateCursor(cursor);
    },
  );
  let pointer: HTMLDivElement | undefined;
  const getPointer = () => {
    if (!pointer) {
      pointer = document.querySelector(`[data-actor="${actorId}"] .pointer`) as
        | HTMLDivElement
        | undefined;
    }
    return pointer;
  };

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
        setQuaternion(letter, position3d.rotation);
        setPosition(letter, position3d.position);
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
    // Then perform actions
    performActions();
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
