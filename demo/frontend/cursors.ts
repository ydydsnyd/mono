import {
  ACTOR_UPDATE_INTERVAL,
  COLOR_PALATE,
  LOCATION_PLACEHOLDER,
  MIN_TOUCH_TIME_FOR_INDICATOR,
  TOUCH_CIRCLE_PADDING,
} from '../shared/constants';
import {Actor, ActorID, Cursor, Position, TouchState} from '../shared/types';
import {colorToString, now} from '../shared/util';
import {
  coordinateToPosition,
  positionToCoordinate,
  screenSize,
} from './coordinates';

export const cursorRenderer = (
  actorID: string,
  getActors: () => Record<ActorID, Actor>,
  getCursors: () => Record<ActorID, Cursor>,
  getDemoContainer: () => HTMLDivElement,
  isOverObject: (cursor: Position) => boolean,
  onUpdateCursor: (localCursor: Cursor) => void,
  debug?: boolean,
): [() => Promise<void>, (cursorPosition: Position) => Position] => {
  // Set up local state
  const cursorDivs: Map<ActorID, HTMLDivElement> = new Map();
  const getCursorDiv = async (cursor: Cursor, createIfMissing: boolean) => {
    // Make sure we have a div
    let cursorDiv = cursorDivs.get(cursor.actorID);
    if (!cursorDiv && createIfMissing) {
      const actors = getActors();
      const actor = actors[cursor.actorID];
      if (!actor) {
        console.error(
          'Attempted to create cursor for actor that does not exist.',
        );
        return;
      }
      if (actor.room) {
        cursorDiv = createCursor(actor, actor.id === actorID);
        document.body.appendChild(cursorDiv);
        cursorDivs.set(actor.id, cursorDiv);
      }
    }
    return cursorDiv;
  };
  let lastActorUpdate = -1;
  let touchStart = -1;
  const showingTouchCursor = (cursor: Cursor) => {
    return (
      cursor.actorID === localCursor.actorID &&
      localCursor.isDown &&
      localCursor.touchState === TouchState.Touching
    );
  };
  const redrawCursors = async () => {
    if (cursorNeedsUpdate) {
      cursorNeedsUpdate = false;
      onUpdateCursor(localCursor);
    }
    const actors = getActors();
    const cursors = getCursors();
    // Move cursors
    Object.values(cursors).forEach(async cursor => {
      if (!actors[cursor.actorID]) {
        return;
      }
      const cursorDiv = await getCursorDiv(cursor, cursor.onPage);
      if (cursorDiv) {
        const isLocal = cursor.actorID === localCursor.actorID;
        const showFinger = now() - touchStart > MIN_TOUCH_TIME_FOR_INDICATOR;
        // Show a special, different cursor locally
        cursorDiv.classList.remove('mobile');
        if (isLocal && localCursor.touchState === TouchState.Touching) {
          cursorDiv.classList.remove('desktop');
          cursorDiv.classList.add('mobile');
        } else {
          cursorDiv.classList.add('desktop');
        }
        const {x, y} = coordinateToPosition(
          cursor,
          getDemoContainer(),
          screenSize(),
        );
        cursorDiv.classList.remove('active', 'on-page');
        if (cursor.onPage) {
          if (isLocal) {
            cursorDiv.classList.add('on-page');
          }
          if (cursor.touchState !== TouchState.Touching || showFinger) {
            cursorDiv.classList.add('active');
          }
        }
        cursorDiv.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        const color = colorToString(
          COLOR_PALATE[actors[cursor.actorID].colorIndex],
        );
        const fingerDiv = cursorDiv.querySelector('.finger') as HTMLDivElement;
        const locationDiv = cursorDiv.querySelector(
          '.location',
        ) as HTMLDivElement;
        if (showingTouchCursor(cursor) && showFinger) {
          const lastTouch = lastTouchEvent?.touches[0];
          const size =
            Math.max(lastTouch?.radiusX || 0, lastTouch?.radiusY || 0, 10) +
            TOUCH_CIRCLE_PADDING;
          fingerDiv.style.width = size + 'px';
          fingerDiv.style.height = size + 'px';
          fingerDiv.style.marginLeft = -(size / 2) + 'px';
          fingerDiv.style.marginTop = -(size / 2) + 'px';
          locationDiv.style.top = -size + 30 + 'px';
        } else {
          fingerDiv.style.removeProperty('width');
          fingerDiv.style.removeProperty('height');
          fingerDiv.style.removeProperty('margin-left');
          fingerDiv.style.removeProperty('margin-top');
          locationDiv.style.removeProperty('top');
        }
        if (cursorDiv.dataset['color'] !== color) {
          const pointer = cursorDiv.querySelector(
            '#pointer-fill',
          ) as SVGPathElement;
          const fingerDiv = cursorDiv.querySelector(
            '.finger',
          ) as HTMLDivElement;
          const locationArrow = cursorDiv.querySelector(
            '#location-arrow',
          ) as SVGPathElement;
          pointer.style.fill = color;
          locationDiv.style.background = color;
          fingerDiv.style.borderColor = color;
          locationArrow.style.fill = color;
        }
        cursorDiv.dataset['color'] = color;
      }
    });
    // Remove cursor divs that represent actors that are no longer here
    for (const actorID of cursorDivs.keys()) {
      if (!cursors[actorID]) {
        for (const existing of document.getElementsByClassName(actorID)) {
          existing.parentElement?.removeChild(existing);
        }
        cursorDivs.delete(actorID);
      }
    }
    // At a lower frequency, update actor information (it only changes once per
    // actor, when we first get the location).
    if (now() - lastActorUpdate > ACTOR_UPDATE_INTERVAL) {
      lastActorUpdate = now();
      Object.values(actors).forEach(actor => {
        const cursorDiv = cursorDivs.get(actor.id);
        if (cursorDiv && actor.location) {
          cursorDiv.querySelector('.location-name')!.innerHTML = actor.location;
        }
        if (cursorDiv && debug) {
          const botIndicator = cursorDiv.querySelector('.bot-indicator');
          if (actor.isBot && !botIndicator) {
            const botSpan = document.createElement('span');
            botSpan.classList.add('bot-indicator');
            botSpan.innerHTML = '[bot]';
            cursorDiv.querySelector('.location-name')!.appendChild(botSpan);
          } else if (!actor.isBot && botIndicator) {
            botIndicator.parentElement?.removeChild(botIndicator);
          }
        }
      });
    }
  };
  // Add a cursor tracker for this user
  const cursors = getCursors();
  let localCursor: Cursor = cursors[actorID] || {
    x: 0,
    y: 0,
    ts: now(),
    actorID,
    onPage: false,
    isDown: false,
    touchState: TouchState.Unknown,
    activePiece: -1,
  };
  let lastPosition = {x: 0, y: 0};
  // Tracking touches is tricky. Browsers fire a touchstart, touchend, mousedown,
  // mouseup for every touch. If you move your finger, things will work as expected.
  // But for brief touches, this will cause us to unset the Touching bit before
  // firing mouse events, which causes us to incorrectly identify a click.
  // // Given the rarity of switching back and forth between mouse and finger, solve
  // for this by always ignoring the next mouse event when a touch is identified.
  let skipNextClick = false;
  const mouseElement = document.body;
  const isInIntro = getHasParent(document.getElementById('intro')!);
  let cursorNeedsUpdate = false;
  const updateCursorPosition = (position: Position) => {
    lastPosition = {
      x: position.x,
      y: position.y,
    };
    localCursor.onPage =
      localCursor.touchState === TouchState.Touching
        ? showingTouchCursor(localCursor) && !touchScrolling
        : true;
    const coordinate = positionToCoordinate(
      lastPosition,
      getDemoContainer(),
      screenSize(),
    );
    localCursor.x = coordinate.x;
    localCursor.y = coordinate.y;
    localCursor.ts = now();
    cursorNeedsUpdate = true;
  };

  // Update the cursor when the window is scrolled
  let touchScrolling = false;
  let lastKnownScrollPosition = window.scrollY;
  window.addEventListener('scroll', () => {
    if (localCursor.touchState === TouchState.Touching) {
      touchScrolling = true;
      return;
    }
    const scrollDelta = lastKnownScrollPosition - window.scrollY;
    updateCursorPosition({x: lastPosition.x, y: lastPosition.y - scrollDelta});
    lastKnownScrollPosition = window.scrollY;
    // Since this fires more than once per frame, we need to redraw cursors too so
    // that we don't jitter
    redrawCursors();
  });

  // Hide cursor when blurring
  window.addEventListener('blur', () => {
    localCursor.onPage = false;
    localCursor.ts = now();
    localCursor.isDown = false;
    localCursor.touchState = TouchState.Unknown;
    cursorNeedsUpdate = true;
  });

  // Touch Events
  let lastTouchEvent: TouchEvent | undefined;
  let touchedObject = false;
  mouseElement.addEventListener(
    'touchstart',
    (e: TouchEvent) => {
      lastTouchEvent = e;
      touchStart = now();
      // If we're consuming the event, prevent scrolling.
      if (
        isOverObject({
          x: lastPosition.x,
          y: lastPosition.y,
        })
      ) {
        e.preventDefault();
        touchedObject = true;
        touchScrolling = false;
      }
      localCursor.isDown = true;
      localCursor.touchState = TouchState.Touching;
      updateCursorPosition({x: e.touches[0].pageX, y: e.touches[0].pageY});
      cursorNeedsUpdate = true;
    },
    {passive: false},
  );
  mouseElement.addEventListener(
    'touchend',
    () => {
      touchScrolling = false;
      touchedObject = false;
      // Only end if we started with a touch
      if (localCursor.touchState === TouchState.Touching) {
        // Prevent the mousedown-mouseup events that happens when tapping
        skipNextClick = true;
        localCursor.isDown = false;
        localCursor.onPage = false;
        cursorNeedsUpdate = true;
      }
    },
    {passive: false},
  );
  mouseElement.addEventListener(
    'touchmove',
    (e: TouchEvent) => {
      lastTouchEvent = e;
      updateCursorPosition({
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
      });
      if (
        isOverObject({
          x: lastPosition.x,
          y: lastPosition.y,
        })
      ) {
        touchedObject = true;
        touchScrolling = false;
      }
      if (e.cancelable) {
        if (localCursor.isDown && touchedObject) {
          e.preventDefault();
        }
      }
    },
    {passive: false},
  );

  // Mouse Events
  mouseElement.addEventListener('mousedown', (e: MouseEvent) => {
    if (skipNextClick) {
      return;
    }
    updateCursorPosition({x: e.pageX, y: e.pageY});
    localCursor.touchState = TouchState.Clicking;
    if (e.button !== 0) {
      // Ignore right-clicks
      return;
    }
    if (e.target && isHTMLElement(e.target) && isInIntro(e.target)) {
      e.preventDefault();
    }
    localCursor.isDown = true;
    cursorNeedsUpdate = true;
  });
  mouseElement.addEventListener('mousemove', (e: MouseEvent) => {
    updateCursorPosition({x: e.pageX, y: e.pageY});
  });
  mouseElement.addEventListener('mouseup', () => {
    if (skipNextClick) {
      skipNextClick = false;
      return;
    }
    localCursor.isDown = false;
    cursorNeedsUpdate = true;
  });
  mouseElement.addEventListener('mouseout', (e: MouseEvent) => {
    if (e.target !== mouseElement) {
      return;
    }
    // Only end if we started with a click
    if (localCursor.touchState === TouchState.Clicking) {
      localCursor.isDown = false;
      cursorNeedsUpdate = true;
    }
  });

  // Hide I-bar when dragging across canvas in safari
  window.addEventListener('selectstart', e => {
    if (e.target && isInIntro(e.target as HTMLElement)) {
      e.preventDefault();
    }
  });

  return [
    redrawCursors,
    (cursorPos: Position): Position => {
      return coordinateToPosition(cursorPos, getDemoContainer(), screenSize());
    },
  ];
};

const createCursor = (actor: Actor, isLocal: boolean) => {
  const color = colorToString(COLOR_PALATE[actor.colorIndex]);
  const cursorDiv = document.createElement('div');
  cursorDiv.classList.add('cursor');
  if (isLocal) {
    cursorDiv.classList.add('local');
  }
  cursorDiv.classList.add(actor.id);
  cursorDiv.dataset['color'] = color;
  // Draw the pointer cursor
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

  // Add the location box
  const locationDiv = document.createElement('div');
  locationDiv.classList.add('location');
  locationDiv.style.backgroundColor = color;
  const locationNameDiv = document.createElement('div');
  locationNameDiv.classList.add('location-name');
  locationDiv.appendChild(locationNameDiv);
  locationNameDiv.innerHTML = actor.location || LOCATION_PLACEHOLDER;
  cursorDiv.appendChild(locationDiv);

  // Add the (mobile) bottom arrow on the box
  const arrowDiv = document.createElement('div');
  arrowDiv.classList.add('arrow');
  locationDiv.appendChild(arrowDiv);
  const asvg = document.createElementNS(svgns, 'svg');
  asvg.setAttributeNS(
    'http://www.w3.org/2000/xmlns/',
    'xmlns:xlink',
    'http://www.w3.org/1999/xlink/',
  );
  asvg.setAttribute('version', '1.1');
  asvg.setAttribute('viewBox', '0 0 40.59 8.51');
  asvg.setAttribute('x', '0px');
  asvg.setAttribute('y', '0px');
  asvg.setAttribute('height', '100%');
  const afill = document.createElementNS(svgns, 'path');
  afill.setAttribute('id', 'location-arrow');
  afill.setAttribute('fill', color);
  afill.setAttribute(
    'd',
    'm40.59,0c-2.75,0-5.43.87-7.65,2.49l-4.86,3.53c-4.46,3.25-10.49,3.32-15.03.19l-5.66-3.91C5.21.8,2.64,0,0,0h40.59Z',
  );
  asvg.appendChild(afill);
  arrowDiv.appendChild(asvg);

  // Add the mobile finger indicator
  const fingerDiv = document.createElement('div');
  fingerDiv.classList.add('finger');
  fingerDiv.style.borderColor = color;
  cursorDiv.appendChild(fingerDiv);

  return cursorDiv;
};

const isHTMLElement = (t: EventTarget | null): t is HTMLElement =>
  !!(t as HTMLElement).localName;

const getHasParent = (element: HTMLElement) => {
  return (item: HTMLElement | ParentNode) => {
    if (item === element) {
      return true;
    }
    while (item.parentNode) {
      if (item.parentNode === element) {
        return true;
      }
      item = item.parentNode;
    }
    return false;
  };
};
