import {nanoid} from 'nanoid';
import {initialize} from './data';
import {renderer as renderer3D} from './3d-renderer';
import {cacheOldPoints, drawWells, render} from './texture-renderer';
import initRenderer from '../../renderer/pkg/renderer';
import {cursorRenderer} from './cursors';
import {
  UVMAP_SIZE,
  FPS_LOW_PASS,
  COLOR_PALATE,
  COLOR_PALATE_END,
  CLIENT_CACHE_INTERVAL,
  POINT_MAX_MS,
} from '../shared/constants';
import {
  ColorPalate,
  Cursor,
  Letter,
  LetterCache,
  LetterOwner,
  LetterRotation,
  LetterScale,
  Position,
  Size,
  Tool,
} from '../shared/types';
import {
  LETTERS,
  LETTER_POSITIONS,
  LETTER_POSITIONS_BASE_SCALE,
} from '../shared/letters';
import {
  contains,
  letterOrigin,
  expandBox,
  letterMap,
  now,
  translateCoords,
  distance,
  sortedLetters,
  initContainerScale,
  must,
  randInt,
} from '../shared/util';
import {addDragHandlers, ControlTools} from './dragging';
import {initTools, toolMap} from './tools';
import {initRoom} from './init-room';
import {getUserLocation} from './location';
import {Botmaster} from './botmaster';

type LetterCanvases = Record<Letter, HTMLCanvasElement>;

type Debug = {
  fps: number;
  points: number;
};

// Draw canvases larger than letters so they don't clip when we rotate them
const CANVAS_PADDING: Record<Letter, number> = {
  [Letter.A]: 0.35,
  [Letter.L]: 0.9,
  [Letter.I]: 0.9,
  [Letter.V]: 0.4,
  [Letter.E]: 0.4,
};

// const installDebugHandlers = (
//   roomID: string,
//   colors: ColorPalate,
//   colorsUpdated: () => void
// ) => {
//   const disableBots = document.getElementById(
//     "disable-bots"
//   ) as HTMLInputElement;
//   disableBots.checked = window.location.search.includes("nobots=1");
//   disableBots?.addEventListener("change", () => {
//     if (disableBots.checked) {
//       localStorage.removeItem("roomID");
//       window.location.href = window.location.href + "?nobots=1";
//     } else {
//       window.location.href = window.location.href.replace(/nobots=1/, "");
//     }
//   });
//   const toggleDebugButton = document.querySelector(".debug-container .toggle");
//   toggleDebugButton?.addEventListener("click", () =>
//     document.querySelector(".debug-container")?.classList.toggle("hidden")
//   );
//   const cToH = (c: number) => {
//     let h = Math.round(c).toString(16);
//     if (h.length == 1) {
//       return `0${h}`;
//     }
//     return h;
//   };
//   const colorToHex = (color: Color) =>
//     `#${cToH(color[0])}${cToH(color[1])}${cToH(color[2])}`;
//   ["a", "b", "c", "d", "e"].forEach((color, idx) => {
//     const changeColor = (start: boolean) => (event: Event) => {
//       const hex = (event.target as HTMLInputElement).value;
//       const hexVals = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)!;
//       colors[idx][start ? 0 : 1] = [
//         parseInt(hexVals[1], 16),
//         parseInt(hexVals[2], 16),
//         parseInt(hexVals[3], 16),
//       ];
//       colorsUpdated();
//     };
//     const startColorWell = document.querySelector(
//       `[name="${color}-color-start"]`
//     ) as HTMLInputElement;
//     const endColorWell = document.querySelector(
//       `[name="${color}-color-end"]`
//     ) as HTMLInputElement;
//     startColorWell.onchange = changeColor(true);
//     endColorWell.onchange = changeColor(false);
//     startColorWell.value = colorToHex(colors[idx][0]);
//     endColorWell.value = colorToHex(colors[idx][1]);
//   });
// };

let _container: HTMLDivElement;
const getContainer = () => {
  if (!_container) {
    const c = document.getElementById('canvases') as HTMLDivElement | undefined;
    if (!c) {
      throw new Error("Can't calculate positions before load");
    }
    _container = c;
  }
  return _container;
};
const getContainerScale = () => {
  const bb = getContainer().getBoundingClientRect();
  const bs = LETTER_POSITIONS_BASE_SCALE;
  return bb.width / bs.width;
};
const getScaleFactor = (): Size => {
  return {
    width: window.innerWidth,
    height: document.body.clientHeight,
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

  // Canvases
  // NOTE: container scale isn't currently allowed to change after initial render.
  const containerScale = getContainerScale();
  const {getOffset} = initContainerScale(containerScale);
  const textures: LetterCanvases = letterMap(
    letter =>
      document.querySelector(`#textures > .${letter}`) as HTMLCanvasElement,
  );
  // const caches: LetterCanvases = letterMap((letter) => {
  //   let cache = document.querySelector(
  //     `#caches > .${letter}`
  //   ) as HTMLCanvasElement;
  //   cache.width = UVMAP_SIZE;
  //   cache.height = UVMAP_SIZE;
  //   return cache;
  // });
  const resizeCanvas = (
    canvas: HTMLCanvasElement,
    size: Size,
    scale: number,
  ) => {
    const borderWidth = 2;
    const width = borderWidth + size.width * scale;
    const height = borderWidth + size.height * scale;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = width;
    canvas.height = height;
  };
  const containers: Record<Letter, HTMLDivElement> = letterMap(letter => {
    return document.getElementById(letter) as HTMLDivElement;
  });
  const canvases: LetterCanvases = letterMap(letter => {
    const bb = expandBox(LETTER_POSITIONS[letter], CANVAS_PADDING[letter]);
    const canvas = containers[letter].querySelector(
      'canvas',
    ) as HTMLCanvasElement;
    resizeCanvas(canvas, bb, containerScale);
    const tex = textures[letter];
    tex.width = UVMAP_SIZE;
    tex.height = UVMAP_SIZE;
    return canvas;
  });
  // Set up a render canvas to be used by the 3D rendering enging.
  const renderCanvas = document.getElementById(
    'render-canvas',
  ) as HTMLCanvasElement;
  renderCanvas.width = Math.max(
    ...LETTERS.map(letter => canvases[letter].width),
  );
  renderCanvas.height = Math.max(
    ...LETTERS.map(letter => canvases[letter].height),
  );
  // Draw the "wells" behind the letters
  const wells = letterMap(letter => {
    const bb = LETTER_POSITIONS[letter];
    const canvas = document.querySelector(
      `#wells .${letter}`,
    ) as HTMLCanvasElement;
    resizeCanvas(canvas, bb, containerScale);
    const pos = letterOrigin(letter, containerScale);
    canvas.style.top = pos.y + 'px';
    canvas.style.left = pos.x + 'px';
    return canvas;
  });
  drawWells(wells, containerScale);

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
    reflectClient,
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
  } = await getState();

  // Tools
  initTools(
    toolMap(
      tool => document.getElementById(`${tool}-tool`) as HTMLButtonElement,
    ),
    () => tools[actorId],
    tool => switchToTool({actorId, tool}),
  );

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
  const container = document.getElementById('canvases') as HTMLDivElement;
  const getDragInfo = addDragHandlers(
    container,
    containers,
    () => scales,
    letter => rotations[letter],
    letter => {
      if (getDragInfo()) {
        takeOwner({letter, actorId});
      } else {
        freeOwner({letter, actorId});
      }
    },
  );

  // performActions should be periodically called - it will take the current
  // state, the current mouse position and drag info, and perform any mutations
  // necessary to update the state.
  let lastLetter: Letter | undefined = undefined;
  let needsResize = letterMap(_ => true);
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
    } = await getState());
    activeUserCount.innerHTML = Object.keys(actors).length + '';
    for (const [_, cursor] of Object.entries(cursors)) {
      const actor = must(actors[cursor.actorId]);
      if (actor.id !== actorId && !(bm.isMe && actor.isBot)) {
        continue;
      }
      const position = {
        x: cursor.x * scaleFactor.width,
        y: cursor.y * scaleFactor.height,
      };
      const pointer = !actor.isBot ? getPointer() : undefined;
      let tool = tools[actor.id];
      const drag = getDragInfo();
      if (actor.id == actorId && drag?.control && inlineControls) {
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
          for (const letter of sortedLetters(scales)) {
            const bb = canvases[letter].getBoundingClientRect();
            if (contains(bb, position)) {
              if (needsResize[letter]) {
                needsResize[letter] = false;
                resize3DCanvas(letter);
              }
              isPainting = true;
              // When we enter a new letter, update our current group. Since these groups are
              // used to organize the points, this will make sure that the last person to
              // enter the letter is always on top.
              if (letter !== lastLetter) {
                currentGroup = now();
              }
              lastLetter = letter;
              const textureHit = getTexturePosition(
                letter,
                translateCoords(position, bb),
              );
              if (textureHit) {
                addPoint({
                  letter,
                  actorId: actor.id,
                  position: textureHit,
                  scale: 1,
                  // scale: scales[letter],
                  ts: now(),
                  colorIndex,
                  sequence: sequences[letter],
                  group: currentGroup,
                });
                break;
              }
            }
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
        if (drag) {
          document.body.classList.add('active');
          const div = containers[drag.letter];
          switch (tool) {
            case Tool.MOVE:
              const offset = getOffset(
                drag.letter,
                scales[drag.letter],
                CANVAS_PADDING[drag.letter],
              );
              const letterX = position.x - drag.offset.x - offset.x;
              const letterY = position.y - drag.offset.y - offset.y;
              const origin = letterOrigin(drag.letter, containerScale);
              div.classList.add('moving', 'active');
              updateLetterPosition({
                letter: drag.letter,
                position: {
                  x: (letterX - origin.x) / scaleFactor.width,
                  y: (letterY - origin.y) / scaleFactor.height,
                },
              });
              break;
            case Tool.SCALE:
              let pxdiff = distance(drag.position, position);
              if (drag.position.x > position.x) {
                pxdiff = -pxdiff;
              }
              const scale = (pxdiff / window.innerWidth) * 10;
              div.classList.add('scaling', 'active');
              updateLetterScale({
                letter: drag.letter,
                scale: drag.scale + scale,
              });
              break;
            case Tool.ROTATE:
              const pctdiff = drag.position.x / window.innerWidth - cursor.x;
              const degrees = pctdiff * 360;
              div.classList.add('rotating', 'active');
              const spin = div.querySelector('.spin') as HTMLDivElement;
              if (spin) {
                spin.style.transform = `rotate3d(1, 0, 0, 80deg) rotate(${degrees}deg)`;
              }
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
        LETTERS.forEach(letter => {
          containers[letter].classList.remove(
            'active',
            'rotating',
            'scaling',
            'moving',
          );
        });
      }
    }
  };

  // Debug handlers
  const colors: ColorPalate = [
    [COLOR_PALATE[0], COLOR_PALATE_END[0]],
    [COLOR_PALATE[1], COLOR_PALATE_END[1]],
    [COLOR_PALATE[2], COLOR_PALATE_END[2]],
    [COLOR_PALATE[3], COLOR_PALATE_END[3]],
    [COLOR_PALATE[4], COLOR_PALATE_END[4]],
  ];
  // installDebugHandlers(roomID, colors, () => {
  //   setColors({ colors });
  // });

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
      // // update our debug caches too
      // LETTERS.forEach((letter) => {
      //   const imgData = rawCaches[letter];
      //   if (imgData) {
      //     const image = new Image();
      //     image.onload = () => {
      //       let canvas = caches[letter];
      //       const context = canvas.getContext("2d") as CanvasRenderingContext2D;
      //       context.drawImage(
      //         image,
      //         0,
      //         0,
      //         UVMAP_SIZE,
      //         UVMAP_SIZE,
      //         0,
      //         0,
      //         canvas.width,
      //         canvas.height
      //       );
      //     };
      //     image.src = `data:image/png;charset=utf-8;base64,${imgData}`;
      //   }
      // });
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
          classes.add('hover-device');
        } else {
          classes.remove('hover-device');
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

  // Set up 3D renderer
  const {
    startRendering,
    getTexturePosition,
    resize3DCanvas,
    set3DRotation,
    update3DTexture,
    setGlowing,
  } = await renderer3D(renderCanvas, canvases, textures);

  const bm = new Botmaster(
    reflectClient,
    {
      getRandomPositionOnLetter(letter) {
        const bb = canvases[letter].getBoundingClientRect();
        let pos: Position;
        while (true) {
          pos = {x: randInt(0, bb.width), y: randInt(0, bb.height)};
          if (getTexturePosition(letter, pos)) {
            break;
          }
        }
        pos.x += bb.x;
        pos.y += bb.y;
        console.log('position for', letter, pos);
        return downscale(pos);
      },
      getBotArea() {
        const container = getContainer();
        const bb = container.getBoundingClientRect();
        const bb2 = {
          top: bb.top - 100,
          left: bb.left - 100,
          right: bb.right + 100,
          bottom: bb.bottom + 100,
        };
        return {
          tl: downscale({x: bb2.left, y: bb2.top}),
          br: downscale({x: bb2.right, y: bb2.bottom}),
        };
      },
    },
    !window.location.search.includes('bots=1'),
  );

  // Rotation is smoother if we draw it when it changes rather than every frame.
  addListener<LetterRotation>('rotation', ({letter, rotation}) => {
    set3DRotation(letter, rotation);
  });
  // When letters change sizes, we have to resize the canvas for hit tests to
  // work. However, this is too slow to do reactively (it will cause flickering),
  // so just set a flag and do it if we need to.
  addListener<LetterScale>('scale', ({letter}) => {
    needsResize[letter] = true;
  });
  // When we get a new cache, reset the local one.
  addListener<LetterCache>('cache', ({letter}) => {
    renderPointsIndex[letter] = 0;
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

  // Initialize textures
  LETTERS.forEach(letter => update3DTexture(letter));

  // Letter position & scales rendering
  const drawLetterPositions = (
    positions: Record<Letter, Position>,
    scales: Record<Letter, number>,
    scaleFactor: Size,
  ) => {
    // The topmost letter should be 1 below our tools div
    const topZIndex =
      parseInt(document.getElementById('tools')?.style.zIndex || '20', 10) - 1;
    const indexOrder = sortedLetters(scales);
    LETTERS.forEach(letter => {
      let {x, y} = positions[letter];
      const container = containers[letter] as HTMLDivElement;
      const origin = letterOrigin(letter, containerScale);
      const offset = getOffset(letter, scales[letter], CANVAS_PADDING[letter]);
      let newX = x * scaleFactor.width + origin.x + offset.x;
      let newY = y * scaleFactor.height + origin.y + offset.y;
      container.style.left = newX + 'px';
      container.style.top = newY + 'px';
      const canvas = canvases[letter];
      canvas.style.width = offset.scaledWidth + 'px';
      canvas.style.height = offset.scaledHeight + 'px';
      canvas.style.zIndex = topZIndex - indexOrder.indexOf(letter) + '';
    });
  };

  // When the window is resized, recalculate letter and cursor positions
  window.addEventListener('resize', async () => {
    const {positions, scales} = await getState();
    const scaleFactor = getScaleFactor();
    drawLetterPositions(positions, scales, scaleFactor);
    renderCursors();
  });

  // Render our cursors and canvases at "animation speed", usually 60fps
  startRenderLoop(async () => {
    const scaleFactor = getScaleFactor();
    await renderCursors();
    // Each frame, render our textures
    render(textures, points, renderPointsIndex, colors);
    // Update any 3D scene assets
    LETTERS.forEach(letter => update3DTexture(letter));
    LETTERS.forEach(letter => set3DRotation(letter, rotations[letter]));
    // And update letter positions
    drawLetterPositions(positions, scales, scaleFactor);
    // Then perform actions
    performActions();
  }, debug);
  // Also render our 3D scenes
  startRendering();

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
