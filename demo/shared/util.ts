import {LETTERS} from '../shared/letters';
import type {Color, Letter, Position, Size} from './types';

export const now = () => new Date().getTime();

export const colorToString = (color: Color) => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

export const scalePosition = (position: Position, scale: Size) => {
  return {
    x: position.x * scale.width,
    y: position.y * scale.height,
  };
};

export const letterMap = <T>(mapFn: (letter: Letter) => T) => {
  return LETTERS.reduce((map, letter) => {
    map[letter] = mapFn(letter);
    return map;
  }, {} as Record<Letter, T>);
};

export const asyncLetterMap = async <T>(
  mapFn: (letter: Letter) => Promise<T>,
) => {
  const map = {} as Record<Letter, T>;
  await Promise.all(
    LETTERS.map(async letter => {
      map[letter] = await mapFn(letter);
    }),
  );
  return map;
};

export const randomWithSeed = (
  value: number,
  seed: number,
  max = 1,
  min = 0,
): number => {
  const range = max * 1000 - min * 1000;
  const rand = (value * seed) % range;
  return (min * 1000 + rand) / 1000;
};

export function must<T>(val: T | undefined): T {
  if (val === undefined) {
    throw new Error('assertion error: val must be defined');
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
