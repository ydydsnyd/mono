import type {Color} from './types';
import {
  COLOR_PALATE_RS,
  RENDERED_PHYSICS_STEP_WINDOW_SIZE,
} from '../../renderer/src/constants';
export {UVMAP_SIZE, SPLATTER_ANIM_FRAMES} from '../../renderer/src/constants';

// Bucketing
export const ORCHESTRATOR_ROOM_ID = 'orchestrator-room';
export const ROOM_MAX_ACTORS = 100;

// Demo position
export const DEMO_OFFSET_BOTTOM = 180;

// Splatters
// To avoid our data growing infinitely, "flatten" splatters to an image in
// batches if they are sufficiently old.
export const SPLATTER_MAX_AGE = 2000; // ms
export const SPLATTER_FLATTEN_MIN = 10; // count
// ms between splatters. This is a minimum, so any number below about 16 will
// just splatter every frame (or more accurately, this will fall back to
// MIN_STEP_MS)
export const SPLATTER_MS = 42;
// Splatter animation speed
export const SPLATTER_ANIMATION_FRAME_DURATION = 30; // ~33fps

// Clear animation
export const CLEAR_STEP_ANIM_FRAMES = 8;
export const CLEAR_ANIMATION_FRAME_DURATION = 35;

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
  [COLOR_PALATE_RS[0], COLOR_PALATE_RS[1], COLOR_PALATE_RS[2]],
  [COLOR_PALATE_RS[6], COLOR_PALATE_RS[7], COLOR_PALATE_RS[8]],
  [COLOR_PALATE_RS[12], COLOR_PALATE_RS[13], COLOR_PALATE_RS[14]],
  [COLOR_PALATE_RS[18], COLOR_PALATE_RS[19], COLOR_PALATE_RS[20]],
  [COLOR_PALATE_RS[24], COLOR_PALATE_RS[25], COLOR_PALATE_RS[26]],
];

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
