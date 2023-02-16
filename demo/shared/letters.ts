import {Letter, Position} from './types';

export const LETTERS = [Letter.A, Letter.L, Letter.I, Letter.V, Letter.E];

export const LETTER_OFFSET = 0;

// TODO: x values are reversed in babylon - why?
export const LETTER_POSITIONS: Record<Letter, Position> = {
  [Letter.A]: {x: -5.65465, y: 1.69821},
  [Letter.L]: {x: -2.7806, y: 2.48276},
  [Letter.I]: {x: 0.835768, y: 2.56859},
  [Letter.V]: {x: 2.13617, y: 2.05105},
  [Letter.E]: {x: 6.18972, y: 1.7763},
};
