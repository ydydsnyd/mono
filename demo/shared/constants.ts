import type {Color} from './types';
import {
  COLOR_PALATE_RS,
  RENDERED_PHYSICS_STEP_WINDOW_SIZE,
} from '../../renderer/src/constants';
export {UVMAP_SIZE, SPLATTER_ANIM_FRAMES} from '../../renderer/src/constants';

// Demo position
export const DEMO_OFFSET_BOTTOM = 180;

// Splatters
export const SPLATTER_FLATTEN_MIN = 10;
// ms between splatters. This is a minimum, so any number below about 16 will
// just splatter every frame (or more accurately, this will fall back to
// MIN_STEP_MS)
export const SPLATTER_MS = 0;

// Some browsers are capable of rendering > 60fps, but we don't expect/want that
// since we assume each step is about 16ms.
export const MIN_STEP_MS = 16;

// 3D
// How many steps it takes for our environment to spin in a circle
export const ENVIRONMENT_CYCLE_STEPS = 1000;
// Brightness of environmental lighting
export const ENVIRONMENT_TEXTURE_LEVEL = 0.6;

// The only data that changes on an actor is the loction, so update them at a
// lower frequency than cursors.
export const ACTOR_UPDATE_INTERVAL = 1000;

// Cycle through these colors for users.
export const COLOR_PALATE: Color[] = [
  [
    COLOR_PALATE_RS[0] * 255,
    COLOR_PALATE_RS[1] * 255,
    COLOR_PALATE_RS[2] * 255,
  ],
  [
    COLOR_PALATE_RS[6] * 255,
    COLOR_PALATE_RS[7] * 255,
    COLOR_PALATE_RS[8] * 255,
  ],
  [
    COLOR_PALATE_RS[12] * 255,
    COLOR_PALATE_RS[13] * 255,
    COLOR_PALATE_RS[14] * 255,
  ],
  [
    COLOR_PALATE_RS[18] * 255,
    COLOR_PALATE_RS[19] * 255,
    COLOR_PALATE_RS[20] * 255,
  ],
  [
    COLOR_PALATE_RS[24] * 255,
    COLOR_PALATE_RS[25] * 255,
    COLOR_PALATE_RS[26] * 255,
  ],
];

export const COLOR_PALATE_END: Color[] = [
  [
    COLOR_PALATE_RS[3] * 255,
    COLOR_PALATE_RS[4] * 255,
    COLOR_PALATE_RS[5] * 255,
  ],
  [
    COLOR_PALATE_RS[9] * 255,
    COLOR_PALATE_RS[10] * 255,
    COLOR_PALATE_RS[11] * 255,
  ],
  [
    COLOR_PALATE_RS[15] * 255,
    COLOR_PALATE_RS[16] * 255,
    COLOR_PALATE_RS[17] * 255,
  ],
  [
    COLOR_PALATE_RS[21] * 255,
    COLOR_PALATE_RS[22] * 255,
    COLOR_PALATE_RS[23] * 255,
  ],
  [
    COLOR_PALATE_RS[27] * 255,
    COLOR_PALATE_RS[28] * 255,
    COLOR_PALATE_RS[29] * 255,
  ],
];

// Debug

// We share this file with the worker environment which is not node.js and has
// no process global.
const env = (() => {
  const hasProcess = typeof process !== 'undefined';
  if (hasProcess) {
    return {
      NEXT_PUBLIC_DEBUG_PHYSICS: process.env.NEXT_PUBLIC_DEBUG_PHYSICS,
      NEXT_PUBLIC_DEBUG_TEXTURES: process.env.NEXT_PUBLIC_DEBUG_TEXTURES,
    };
  }
  return {
    NEXT_PUBLIC_DEBUG_PHYSICS: undefined,
    NEXT_PUBLIC_DEBUG_TEXTURES: undefined,
  };
})();

// Sample fps at this low pass. Higher means a longer sample time, resulting in
// averaging over a longer period of time.
export const FPS_LOW_PASS = 10;
export const DEBUG_PHYSICS = env.NEXT_PUBLIC_DEBUG_PHYSICS === 'true';
export const DEBUG_TEXTURES = env.NEXT_PUBLIC_DEBUG_TEXTURES === 'true';

// Mutators/etc

// We don't want flattening to happen too often (or too infrequently), as it is
// slower than normal mutations (but delaying it too much will make it too
// expensive to run without a noticeable hang)
export const MIN_PHYSICS_FLATTENING_STEPS = 100;
export const MAX_PHYSICS_FLATTENING_STEPS =
  RENDERED_PHYSICS_STEP_WINDOW_SIZE + MIN_PHYSICS_FLATTENING_STEPS;

// Can't put more than 131072 bytes in a DO, so use a number under half that
// since these will refer to strings
export const CACHE_CHUNK_STRING_SIZE = 65535;
