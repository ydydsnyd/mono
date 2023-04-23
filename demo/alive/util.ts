import {PIECE_DEFINITIONS} from './piece-definitions';
import type {PieceModel} from './piece-model';

export type Position = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export type BoundingBox = Position & Size;

export const now = () => new Date().getTime();

export const rotatePosition = (
  position: Position,
  around: Position,
  radians: number,
) => {
  const {x, y} = position;
  const {x: cx, y: cy} = around;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const nx = cos * (x - cx) + sin * (y - cy) + cx;
  const ny = cos * (y - cy) - sin * (x - cx) + cy;
  return {x: nx, y: ny};
};

export const center = (box: BoundingBox) => {
  return {
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
  };
};

export const addRadians = (value: number, add: number) => {
  const c = Math.PI * 2;
  return (c + value + add) % c;
};

export const getAngle = (from: Position, to: Position) => {
  return Math.atan2(from.y - to.y, from.x - to.x);
};

export function must<T>(val: T | undefined | null, name?: string): T {
  if (val === undefined || val === null) {
    throw new Error(`assertion error: ${name ? name : 'val must be defined'}`);
  }
  return val;
}

export const randFloat = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

export const randElm = <T>(arr: Readonly<T[]>) => {
  return arr[randInt(0, arr.length)];
};

export const distance = (a: Position, b: Position): number => {
  const x = b.x - a.x;
  const y = b.y - a.y;
  return Math.sqrt(x * x + y * y);
};

export function getStage(screenSize: Size) {
  const edgeBuffer = 10;

  // TODO: would be better to get these from layout dynamically.
  const navBottom = 88;
  const introBottom = 763.5;

  return new Rect(
    edgeBuffer,
    navBottom,
    screenSize.width - edgeBuffer * 2,
    introBottom - edgeBuffer * 2 - navBottom,
  );
}

export function generateRandomPieces(
  home: Rect,
  stage: Rect,
  screenSize: Size,
) {
  const approxPieceSize = 50;
  const selectedPositions: Position[] = [];

  // This uses Mitchell's best candidate algorithm to generate the initial
  // positions for the puzzle: https://gist.github.com/mbostock/1893974.
  // The idea, roughly, is to loop through each piece and choose a random
  // position that's farthese from other pieces.

  const getCandidates = () => {
    return new Array(10).fill(0).map(() => {
      const pos = {
        x: randFloat(stage.left(), stage.right() - approxPieceSize),
        y: randFloat(stage.top(), stage.bottom() - approxPieceSize),
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

  for (let i = 0; i < PIECE_DEFINITIONS.length; i++) {
    const candidates = getCandidates();
    const farthest = candidates.reduce((best, cand) => {
      if (cand.minDist > best.minDist) {
        return cand;
      }
      return best;
    }, candidates[0]);
    selectedPositions.push(farthest.pos);
  }

  const ret: PieceModel[] = [];
  for (const [i, pos] of selectedPositions.entries()) {
    const coord = positionToCoordinate(pos, home, screenSize);
    const newPiece: PieceModel = {
      id: i.toString(),
      ...coord,
      rotation: randFloat(0, Math.PI * 2),
      handleRotation: Math.PI / 2, // north
      placed: false,
    };
    ret.push(newPiece);
  }

  return ret;
}
// Our coordinate system has 2 requirements:
// 1. We want pieces to be able to use the full horizontal width of the screen
// on wider screens, even when that means they are far outside the home location
// of letters.
// 2. No piece should be positioned off screen on any user's device.
// 3. When a piece is over a letter, it should be over the same part of the
// letter on every other user's screen. Otherwise when users drop pieces, other
// users with different sized screens will see the letter jump.
// Requirement 3 contradicts 1 and 2, so we use 2 overlaying systems.
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
  home: BoundingBox,
  screenSize: Size,
) => {
  const areaRight = home.x + home.width;
  const areaBottom = home.y + home.height;
  let x = (position.x - home.x) / home.width;
  if (x < 0) {
    // calculate fraction of left margin used, then translate into domain [-1..0].
    x = position.x / home.x - 1;
  } else if (x > 1) {
    // calculate fraction of right margin used, then translate into domain [1..2].
    const remainingScreen = screenSize.width - areaRight;
    x = (position.x - areaRight) / remainingScreen + 1;
  }
  // same but for y coordinates.
  let y = (position.y - home.y) / home.height;
  if (y < 0) {
    y = position.y / home.y - 1;
  } else if (y > 1) {
    const remainingScreen = screenSize.height - areaBottom;
    y = (position.y - areaBottom) / remainingScreen + 1;
  }
  return {x, y};
};

export const coordinateToPosition = (
  coord: Position,
  home: BoundingBox,
  screenSize: Size,
) => {
  const areaRight = home.x + home.width;
  let x = -1;
  if (coord.x < 0) {
    // translate coord back into domain [0..1] then multiply by left margin.
    x = (coord.x + 1) * home.x;
  } else if (coord.x > 1) {
    // same for right margin.
    x = areaRight + (coord.x - 1) * (screenSize.width - areaRight);
  } else {
    x = home.x + coord.x * home.width;
  }
  const areaBottom = home.y + home.height;
  let y = -1;
  if (coord.y < 0) {
    y = (coord.y + 1) * home.y;
  } else if (coord.y > 1) {
    y = areaBottom + (coord.y - 1) * (screenSize.height - areaBottom);
  } else {
    y = home.y + coord.y * home.height;
  }
  return {x, y};
};

export const getAbsoluteRect = (element: HTMLElement) => {
  const cr = element.getBoundingClientRect();
  return new Rect(
    cr.left + element.ownerDocument.documentElement.scrollLeft,
    cr.top + element.ownerDocument.documentElement.scrollTop,
    cr.width,
    cr.height,
  );
};

export const getScreenSize = () => {
  return {
    width: document.body.scrollWidth,
    height: document.body.scrollHeight,
  };
};

export class Rect {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
  ) {}
  left() {
    return this.x;
  }
  top() {
    return this.y;
  }
  right() {
    return this.x + this.width;
  }
  bottom() {
    return this.y + this.height;
  }
}
