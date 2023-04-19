import {SVG_ORIGINAL_SIZE} from '../shared/constants';
import type {Position, Size} from '../shared/types';

const isPositioned = (el: Element): el is HTMLElement =>
  (el as HTMLElement).offsetTop !== undefined;

const absPosition = (element: HTMLElement) => {
  let x = element.offsetLeft;
  let y = element.offsetTop;
  while (element.offsetParent) {
    if (!isPositioned(element.offsetParent)) {
      break;
    }
    element = element.offsetParent;
    x += element.offsetLeft;
    y += element.offsetTop;
  }
  return {x, y};
};

export const screenSize = () => {
  return {
    width: document.body.scrollWidth,
    height: document.body.scrollHeight,
  };
};

export const positionRelative = (position: Position, element: HTMLElement) => {
  const origin = absPosition(element);
  return {
    x: position.x - origin.x,
    y: position.y - origin.y,
  };
};

const preciseAreaSize = (screenSize: Size) => {
  // TODO: responsive breakpoints
  if (screenSize.width > 0) {
    return SVG_ORIGINAL_SIZE;
  }
  return SVG_ORIGINAL_SIZE;
};

// Our coordinate system has 2 requirements:
// 1. Inside of a demo area, pixel values need to scale exactly to the demo area
// - e.g. if one users' mouse is over a letter, it needs to be over the same
// part of the letter, even when displayed smaller.
// 2. Nobody's cursors should be able to go outside of the visible screen area.
// These contradict each other in practice - so we use 2 overlaying systems.
// - Coordinates are represented as numbers from -1 to 2
// - Coordinates between 0 and 1 are divided by the size of the "precise area",
// and offset by the top/left of it - so cursors inside this area will
// represent the same scaled position on all screens.
// - Coordinates outside of that area (-1-0 and 1-2) are used as a percentage of
// the remaining area, so they will never go outside the screen area. So on
// larger screens, cursors will move slower than on bigger ones, and pieces will
// get closer or further away from the demo when you resize your screen.
export const positionToCoordinate = (
  position: Position,
  preciseAreaElement: HTMLElement,
  screenSize: Size,
) => {
  const precisePos = absPosition(preciseAreaElement);
  const preciseSize = preciseAreaSize(screenSize);
  const areaRight = precisePos.x + preciseSize.width;
  const areaBottom = precisePos.y + preciseSize.height;
  let x = (position.x - precisePos.x) / preciseSize.width;
  if (x < 0) {
    // calculate fraction of left margin used, then translate into domain [-1..0].
    x = position.x / precisePos.x - 1;
  } else if (x > 1) {
    // calculate fraction of right margin used, then translate into domain [1..2].
    const remainingScreen = screenSize.width - areaRight;
    x = (position.x - areaRight) / remainingScreen + 1;
  }
  // same but for y coordinates.
  let y = (position.y - precisePos.y) / preciseSize.height;
  if (y < 0) {
    y = position.y / precisePos.y - 1;
  } else if (y > 1) {
    const remainingScreen = screenSize.height - areaBottom;
    y = (position.y - areaBottom) / remainingScreen + 1;
  }
  return {x, y};
};
export const coordinateToPosition = (
  coord: Position,
  preciseAreaElement: HTMLElement,
  screenSize: Size,
) => {
  const precisePos = absPosition(preciseAreaElement);
  const preciseSize = preciseAreaSize(screenSize);
  const areaRight = precisePos.x + preciseSize.width;
  let x = -1;
  if (coord.x < 0) {
    // translate coord back into domain [0..1] then multiply by left margin.
    x = (coord.x + 1) * precisePos.x;
  } else if (coord.x > 1) {
    // same for right margin.
    x = areaRight + (coord.x - 1) * (screenSize.width - areaRight);
  } else {
    x = precisePos.x + coord.x * preciseSize.width;
  }
  const areaBottom = precisePos.y + preciseSize.height;
  let y = -1;
  if (coord.y < 0) {
    y = (coord.y + 1) * precisePos.y;
  } else if (coord.y > 1) {
    y = areaBottom + (coord.y - 1) * (screenSize.height - areaBottom);
  } else {
    y = precisePos.y + coord.y * preciseSize.height;
  }
  return {x, y};
};
