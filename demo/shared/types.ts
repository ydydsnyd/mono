// Per-frame application state. We query reflect directly for this data every
// time we draw.
export type State = {
  actorId: ActorID;
  actors: Record<ActorID, Actor>;
  cursors: Record<ActorID, Cursor>;
  impulses: Record<Letter, Impulse[]>;
  physicsStep: number;
  physicsState: string | undefined; // b64 encoded state
};

export enum ClientStatus {
  INITIALIZING = 'initializing',
  SERVER_CONFIRMED = 'server-confirmed',
}

export type Debug = {
  fps: number;
  cacheUpdated: (letter: Letter, cache: string) => void;
};

export type ActorID = string;

export type Color = [number, number, number]; // rgb

export type Actor = OrchestratorActor & {
  location: string;
};

export type OrchestratorActor = {
  id: ActorID;
  colorIndex: number;
  room: string;
};

export type Letter3DPosition = {
  position: Vector;
  rotation: Quaternion;
};

export type Impulse = Vector & {
  u: ActorID;
  s: number; // step
};

export type LetterHandles = Record<Letter, number>;

export enum Letter {
  A = 'a',
  L = 'l',
  I = 'i',
  V = 'v',
  E = 'e',
}

// Each letter also can be painted on, by adding splatters.
export type Splatter = Position & {
  u: ActorID; // actor ID
  c: number; // color index, from COLOR_PALATE
  a: number; // splatter animation index
  t: number; // timestamp
  r: number; // rotation of splatter animation
};

// Each actor has a cursor. They are positioned in global space, so we also need
// to send the space around so we can draw them relatively.
export enum TouchState {
  Unknown = 0,
  Touching = 1,
  Clicking = 2,
}
export type Cursor = Position & {
  actorId: ActorID;
  onPage: boolean;
  ts: number;
  isDown: boolean;
  touchState: TouchState;
};

export type BoundingBox = Position & Size;

export type Size = {
  width: number;
  height: number;
};

export type Quaternion = Vector & {
  w: number;
};

export type Vector = Position & {
  z: number;
};

// In this app, all position values are between 0 and 1, and expected to be
// multiplied by window.innerWidth/window.innerHeight when used in rendering
// code.
export type Position = {
  x: number;
  y: number;
};

export enum Env {
  CLIENT,
  SERVER,
}
