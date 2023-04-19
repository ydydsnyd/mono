import {
  BoundingBox,
  Color,
  Cursor,
  Position,
  RecordingCursor,
  Size,
  TouchState,
} from './types';

export const getLazyFunction = <T, R = void>(): [
  (arg: T) => Promise<R>,
  (createFn: (arg: T) => Promise<R>) => Promise<void>,
] => {
  let pastCalls: [T, (value: R) => void][] = [];
  let currentFn: ((arg: T) => Promise<R>) | undefined;
  return [
    async arg => {
      if (currentFn) {
        return await currentFn(arg);
      }
      return new Promise<R>(resolver => {
        pastCalls.push([arg, resolver]);
      });
    },
    async (fn: (arg: T) => Promise<R>) => {
      currentFn = fn;
      if (pastCalls) {
        for await (const [arg, promise] of pastCalls) {
          const ret = await currentFn(arg);
          promise(ret as R);
        }
        pastCalls = [];
      }
    },
  ];
};

export const now = () => new Date().getTime();

export const nextNumber = (last?: number): number => {
  return (last || 0) + 1;
};

export const sortableKeyNum = (number: number): string => {
  const hex = number.toString(16);
  return String.fromCharCode(hex.length) + hex;
};

export const cursorToRecordingCursor = (cursor: Cursor): RecordingCursor => {
  return {
    x: cursor.x,
    y: cursor.y,
    t: cursor.ts,
    o: cursor.onPage,
    d: cursor.isDown,
  };
};
export const recordingCursorToCursor = (
  actorID: string,
  rc: RecordingCursor,
): Cursor => {
  return {
    x: rc.x,
    y: rc.y,
    ts: rc.y,
    touchState: TouchState.Unknown,
    actorID: actorID,
    isDown: rc.d,
    onPage: true,
    activePiece: -1,
  };
};

export const colorToString = (color: Color) => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

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

export const scalePosition = (position: Position, scale: Size) => {
  return {
    x: position.x * scale.width,
    y: position.y * scale.height,
  };
};

export const relative = (coordinate: Position, from: Position) => {
  return {
    x: coordinate.x - from.x,
    y: coordinate.y - from.y,
  };
};

export const addCoords = (a: Position, b: Position) => {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
};

export const scaleRange = (min: number, max: number, scale: number) => {
  return scale * (max - min) + min;
};

export const addRadians = (value: number, add: number) => {
  const c = Math.PI * 2;
  return (c + value + add) % c;
};

export const getAngle = (from: Position, to: Position) => {
  return Math.atan2(from.y - to.y, from.x - to.x);
};

export const toCurve = (value: number, min: number, max: number) => {
  // Given value between 0 and 1, find a value between min and max, where 0.5 is max and both 1 and 0 are min.
  if (value >= 0.5) {
    value = Math.abs(1 - value);
  }
  return scaleRange(min, max, value / 0.5);
};

export const chooseRandomWithSeed = <T>(
  randomizer: string | number,
  seed: number,
  list: T[],
  allowed?: (item: T, index: number) => boolean,
): [T, number] | undefined => {
  if (!list.length) {
    return undefined;
  }
  let index: number;
  let iterations = 1000;
  do {
    if (!--iterations) {
      throw new Error(
        'chooseRandomWithSeed should succeed in less than 1000 tries.',
      );
    }
    index = Math.floor(randomWithSeed(randomizer, seed, list.length));
  } while (allowed && !allowed(list[index], index));
  return [list[index], index];
};

export const randomWithSeed = (
  value: number | string,
  seed: number,
  max = 1,
  min = 0,
): number => {
  const numVal =
    typeof value === 'string' ? Math.abs(simpleHash(value) / 10000) : value;
  const range = max * 1000 - min * 1000;
  const rand = (numVal * seed) % range;
  return (min * 1000 + rand) / 1000;
};

const simpleHash = (s: string) => {
  var hash = 0,
    i,
    chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
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

export const approxInt = (around: number, plusMinus: number) => {
  const min = Math.ceil(around - plusMinus / 2);
  const max = Math.floor(around + plusMinus / 2);
  return randInt(min, max);
};

export const randElm = <T>(arr: Readonly<T[]>) => {
  return arr[randInt(0, arr.length)];
};

export const randSign = (v: number) => {
  if (Math.random() < 0.5) {
    return Math.abs(v) * -1;
  } else {
    return Math.abs(v);
  }
};

export const distance = (a: Position, b: Position): number => {
  const x = b.x - a.x;
  const y = b.y - a.y;
  return Math.sqrt(x * x + y * y);
};

// Binary search for the input that is nearest witout going over the provided ts value.
// Should be O(log(n))
export const closest = <T, V>(v: T, inputs: V[], transform: (v: V) => T) => {
  if (inputs.length === 0) {
    return -1;
  }
  let middle = -1;
  let startIndex = 0;
  let endIndex = inputs.length;
  while (true) {
    middle = startIndex + Math.floor((endIndex - startIndex) / 2);
    const middleVal = transform(inputs[middle]);
    if (middleVal === v) {
      return middle;
    } else if (middleVal < v) {
      startIndex = middle + 1;
      if (startIndex === endIndex) {
        return middle;
      }
    } else if (middleVal > v) {
      endIndex = middle;
    }
    if (startIndex === endIndex) {
      return startIndex - 1;
    }
  }
};
