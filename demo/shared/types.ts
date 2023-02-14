// Per-frame application state. We query reflect directly for this data every
// time we draw.
export type State = {
  actorId: ActorID;
  actors: Record<ActorID, Actor>;
  cursors: Record<ActorID, Cursor>;
  tools: Record<ActorID, Tool>;
  rotations: Record<Letter, Rotation>;
  points: Record<Letter, Point[]>;
  rawCaches: Record<Letter, string>;
  scales: Record<Letter, number>;
  positions: Record<Letter, Position>;
  sequences: Record<Letter, number>;
  owners: Record<Letter, ActorID | undefined>;
};

export type ActorID = string;

export type Color = [number, number, number]; // rgb

export type ColorPalate = [
  [Color, Color],
  [Color, Color],
  [Color, Color],
  [Color, Color],
  [Color, Color],
];

export type Rotation = number;

export type Actor = {
  id: ActorID;
  colorIndex: number;
  location: string;
  isBot: boolean;
};

export type LetterCache = {
  letter: Letter;
  cache: string;
};

export type LetterPosition = {
  letter: Letter;
  position: Position;
};

export type LetterScale = {
  letter: Letter;
  scale: number;
};

export type LetterRotation = {
  letter: Letter;
  rotation: Rotation;
};

export type LetterOwner = {
  letter: Letter;
  actorId: ActorID;
};

export enum Letter {
  A = 'a',
  L = 'l',
  I = 'i',
  V = 'v',
  E = 'e',
}

export enum Tool {
  PAINT = 'paint',
  MOVE = 'move',
  ROTATE = 'rotate',
  SCALE = 'scale',
}

// Each letter also can be painted on, by adding points.
export type Point = Position & {
  u: ActorID; // actor ID
  t: number; // timestamp
  c: number; // color index, from COLOR_PALATE
  s: number; // scale that this point was drawn at
  p: Splatter[]; // splatters
  g: number; // group
};

export type Splatter = Position & {
  s: number; // size
};

// Each actor has a cursor. They are positioned in global space, so we also need
// to send the space around so we can draw them relatively.
export type Cursor = Position & {
  actorId: ActorID;
  onPage: boolean;
  ts: number;
  isDown: boolean;
};

export type BoundingBox = Position & Size;

export type Size = {
  width: number;
  height: number;
};

export interface Vector extends Position {
  z: number;
}

// In this app, all position values are between 0 and 1, and expected to be
// multiplied by window.innerWidth/window.innerHeight when used in rendering
// code.
export type Position = {
  x: number;
  y: number;
};

export type BotmasterState = {
  clientID?: string | undefined;
  mode: 'intro' | 'nanny';
};
