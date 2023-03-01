import {ACTOR_UPDATE_INTERVAL, COLOR_PALATE} from '../shared/constants';
import type {Actor, ActorID, Cursor, Position, State} from '../shared/types';
import {colorToString, now} from '../shared/util';

export const cursorRenderer = (
  actorId: string,
  getState: () => {actors: State['actors']; cursors: State['cursors']},
  getDemoContainer: () => HTMLDivElement,
  onUpdateCursor: (localCursor: Cursor) => void,
): [() => {isDown: boolean; position: Position}, () => Promise<void>] => {
  // Set up local state
  const cursorDivs: Map<ActorID, HTMLDivElement> = new Map();
  const getCursorDiv = async (cursor: Cursor) => {
    // Make sure we have a div
    let cursorDiv = cursorDivs.get(cursor.actorId);
    if (!cursorDiv) {
      const {actors} = getState();
      const actor = actors[cursor.actorId];
      if (!actor) {
        console.error(
          'Attempted to create cursor for actor that does not exist.',
        );
        return;
      }
      cursorDiv = createCursor(actor);
      document.body.appendChild(cursorDiv);
      cursorDivs.set(actor.id, cursorDiv);
    }
    return cursorDiv;
  };
  // Add a cursor tracker for this user
  const {cursors} = getState();
  let localCursor: Cursor = cursors[actorId] || {
    x: 0,
    y: 0,
    ts: now(),
    actorId,
    onPage: false,
    isDown: false,
  };
  let lastPosition = {x: 0, y: 0};
  const mouseElement = document.body;
  let cursorNeedsUpdate = false;
  const updateCursorPosition = (position?: Position) => {
    const demoBB = getDemoContainer().getBoundingClientRect();
    if (position) {
      lastPosition = {
        x: position.x,
        y: position.y,
      };
    }
    localCursor.onPage = true;
    localCursor.x = (lastPosition.x - demoBB.x) / demoBB.width;
    localCursor.y = (lastPosition.y - demoBB.y) / demoBB.height;
    localCursor.ts = now();
    cursorNeedsUpdate = true;
  };
  // Cursor for mice
  const updateCursor = (e: MouseEvent) => {
    updateCursorPosition({x: e.clientX, y: e.clientY});
  };
  mouseElement.addEventListener('mousemove', updateCursor);
  // Cursor for touches
  const touchMoved = (e: TouchEvent) => {
    updateCursorPosition({x: e.touches[0].clientX, y: e.touches[0].clientY});
  };
  mouseElement.addEventListener('touchmove', touchMoved);
  // We also need to update the cursor when the window is scrolled
  window.addEventListener('scroll', () => {
    updateCursorPosition();
  });
  const hideCursor = (e: MouseEvent | TouchEvent) => {
    if (e.target !== mouseElement) {
      return;
    }
    localCursor.isDown = false;
    localCursor.onPage = false;
    cursorNeedsUpdate = true;
  };
  mouseElement.addEventListener('mouseout', hideCursor);
  mouseElement.addEventListener('touchend', hideCursor);
  // Track cursor clicks
  const setIsDown = () => {
    localCursor.isDown = true;
    cursorNeedsUpdate = true;
  };
  mouseElement.addEventListener('mousedown', setIsDown);
  mouseElement.addEventListener('touchStart', setIsDown);
  mouseElement.addEventListener('mouseup', () => {
    localCursor.isDown = false;
    cursorNeedsUpdate = true;
  });

  let lastActorUpdate = -1;
  return [
    () => {
      const demoBB = getDemoContainer().getBoundingClientRect();
      return {
        isDown: localCursor.isDown,
        position: {
          x: lastPosition.x - demoBB.x,
          y: lastPosition.y - demoBB.y,
        },
      };
    },
    async () => {
      if (cursorNeedsUpdate) {
        cursorNeedsUpdate = false;
        onUpdateCursor(localCursor);
      }
      const demoBB = getDemoContainer().getBoundingClientRect();
      const {actors, cursors} = getState();
      // Move cursors
      Object.values(cursors).forEach(async cursor => {
        const {x, y} = cursor;
        const cursorDiv = await getCursorDiv(cursor);
        if (cursorDiv) {
          const cursorX = x * demoBB.width + demoBB.x;
          const cursorY = y * demoBB.height + demoBB.y;
          cursorDiv.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
          cursorDiv.style.opacity = cursor.onPage ? '1' : '0';
          const color = colorToString(
            COLOR_PALATE[actors[cursor.actorId].colorIndex],
          );
          if (cursorDiv.dataset['color'] !== color) {
            const pointer = cursorDiv.querySelector(
              '#pointer-fill',
            ) as SVGPathElement;
            const locationDiv = cursorDiv.querySelector(
              '.location',
            ) as HTMLDivElement;
            pointer.style.fill = color;
            locationDiv.style.background = color;
          }
          cursorDiv.dataset['color'] = color;
        }
      });
      // Remove cursor divs that represent actors that are no longer here
      for (const actorId of cursorDivs.keys()) {
        if (!cursors[actorId]) {
          for (const existing of document.getElementsByClassName(actorId)) {
            existing.parentElement?.removeChild(existing);
          }
          cursorDivs.delete(actorId);
        }
      }
      // At a lower frequency, update actor information (it only changes once per
      // actor, when we first get the location).
      if (now() - lastActorUpdate > ACTOR_UPDATE_INTERVAL) {
        lastActorUpdate = now();
        Object.values(actors).forEach(actor => {
          const cursorDiv = cursorDivs.get(actor.id);
          if (cursorDiv && actor.location) {
            cursorDiv.querySelector('.location')!.innerHTML = actor.location;
          }
        });
      }
    },
  ];
};

const createCursor = (actor: Actor) => {
  const color = colorToString(COLOR_PALATE[actor.colorIndex]);
  const cursorDiv = document.createElement('div');
  cursorDiv.classList.add('cursor');
  cursorDiv.classList.add(actor.id);
  cursorDiv.dataset['color'] = color;
  const svgns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgns, 'svg');
  svg.setAttributeNS(
    'http://www.w3.org/2000/xmlns/',
    'xmlns:xlink',
    'http://www.w3.org/1999/xlink/',
  );
  svg.setAttribute('version', '1.1');
  svg.setAttribute('viewBox', '0 0 20 22');
  svg.setAttribute('x', '0px');
  svg.setAttribute('y', '0px');
  svg.setAttribute('width', '20px');
  svg.setAttribute('height', '22px');

  const fill = document.createElementNS(svgns, 'path');
  fill.id = 'pointer-fill';
  fill.setAttribute('fill', color);
  fill.setAttribute(
    'd',
    `M2.6,0.7C2.6,0.3,3,0,3.4,0.2l14.3,8.2C18,8.6,18,9.2,17.6,9.3l-6.9,2.1c-0.1,0-0.2,0.1-0.3,0.2L6.9,17
    c-0.2,0.4-0.8,0.3-0.9-0.2L2.6,0.7z`,
  );
  const outline = document.createElementNS(svgns, 'path');
  outline.setAttribute(
    'd',
    'M6.5,16.7l-3.3-16l14.2,8.2L10.5,11c-0.2,0.1-0.4,0.2-0.5,0.4L6.5,16.7z',
  );
  outline.setAttribute('fill', 'none');
  outline.setAttribute('stroke', '#fff');

  svg.appendChild(fill);
  svg.appendChild(outline);
  const pointerIcon = document.createElement('div');
  pointerIcon.classList.add('pointer');
  pointerIcon.appendChild(svg);
  cursorDiv.appendChild(pointerIcon);

  const locationDiv = document.createElement('div');
  locationDiv.classList.add('location');
  locationDiv.style.backgroundColor = color;
  if (actor.location) {
    locationDiv.innerHTML = actor.location;
  }
  cursorDiv.appendChild(locationDiv);
  return cursorDiv;
};
