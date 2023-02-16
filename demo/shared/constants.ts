import type {Color} from './types';
import {COLOR_PALATE_RS, PAINT_DECAY_AGE} from '../../renderer/src/constants';
export {UVMAP_SIZE} from '../../renderer/src/constants';

// How much padding each canvas should have above and below it
export const CANVAS_HEIGHT_PADDING = 0.2;

// Splatters
export const SPLATTER_COUNT_MAX = 5;
export const SPLATTER_MAX_DISTANCE = 0.5;
export const SPLATTER_MAX_SIZE = 0.5;
export const SPLATTER_MIN_SIZE = 0.1;

// Flatten points older than this
export const POINT_AGE_MAX = PAINT_DECAY_AGE;
export const POINT_CLEANUP_MIN = 10;

export const CLIENT_CACHE_INTERVAL = 1000;

// Allow rewriting up to 400 frames of physics in the past
export const MAX_RENDERED_STEPS = 400;
export const STEP_RENDER_DELAY = 25; // 400ms @ 60fps

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
