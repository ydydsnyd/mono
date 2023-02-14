import {BoundingBox, Letter, Size} from './types';

export const LETTERS = [Letter.A, Letter.L, Letter.I, Letter.V, Letter.E];

export const LETTER_POSITIONS_BASE_SCALE: Size = {
  width: 320,
  height: 113,
};

// Positions @ 320x113 resolution
export const LETTER_POSITIONS: Record<Letter, BoundingBox> = {
  [Letter.A]: {
    x: 0.328,
    y: 32.263,
    width: 69.856,
    height: 80.512,
  },
  [Letter.L]: {
    x: 83.237,
    y: 4.44,
    width: 25.1597,
    height: 106.56,
  },
  [Letter.I]: {
    x: 120.935,
    y: 0,
    width: 29.304,
    height: 111,
  },
  [Letter.V]: {
    x: 154.488,
    y: 34.04,
    width: 85.84,
    height: 76.96,
  },
  [Letter.E]: {
    x: 242.216,
    y: 32.264,
    width: 77.108,
    height: 80.512,
  },
};
