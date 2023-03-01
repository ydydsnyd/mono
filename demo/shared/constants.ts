import type {Color} from './types';
import {COLOR_PALATE_RS} from '../../renderer/src/constants';
export {
  UVMAP_SIZE,
  SPLATTER_ANIM_FRAMES,
  MAX_RENDERED_PHYSICS_STEPS,
} from '../../renderer/src/constants';

// Demo position
export const DEMO_OFFSET_BOTTOM = 180;

// Debug
export const DEBUG_PHYSICS = false;
export const DEBUG_TEXTURES = false;

// Splatters
export const SPLATTER_FLATTEN_MIN = 10;
// ms between splatters. Apparently machine guns are like 12fps, so about once
// every 84ms. Seems reasonable to do about half that.
export const SPLATTER_MS = 42;

// Some browsers are capable of rendering > 60fps, but we don't expect/want that
// since we assume each step is about 16ms.
export const MIN_STEP_MS = 16;

// Render a step older than our global step so that things can change in our
// "past" without jerkiness or without us seeing jitter due to missing spring
// apexes.
export const STEP_RENDER_DELAY = 10;
// Once every 100 steps, tell the server what step we have. This will make sure
// clients don't desync more than about this many steps.
export const STEP_UPDATE_INTERVAL = 100;

// 3D
// How many steps it takes for our environment to spin in a circle
export const ENVIRONMENT_CYCLE_STEPS = 1000;
// Brightness of environmental lighting
export const ENVIRONMENT_TEXTURE_LEVEL = 0.6;

// The only data that changes on an actor is the loction, so update them at a
// lower frequency than cursors.
export const ACTOR_UPDATE_INTERVAL = 1000;

// Sample fps at this low pass. Higher means a longer sample time, resulting in
// averaging over a longer period of time.
export const FPS_LOW_PASS = 10;

// Hide inactive cursors when idle for some amount of time, so we don't have a
// bunch of zombies around the screen if people AFK or whatever
export const HIDE_CURSOR_DELAY = 5000;

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

// Mutators/etc
// Can't put more than 131072 bytes in a DO, so use a number under half that
// since these will refer to strings
export const CACHE_CHUNK_STRING_SIZE = 65535;
