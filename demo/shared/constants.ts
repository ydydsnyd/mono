import type {Color} from './types';
import {COLOR_PALATE_RS} from '../../renderer/src/constants';
export {UVMAP_SIZE, SPLATTER_ANIM_FRAMES} from '../../renderer/src/constants';

// Globals
export const USER_ID = 'anon';
export const LOCATION_PLACEHOLDER = 'Somewhere';

// Bucketing
export const ORCHESTRATOR_ROOM_ID = 'orchestrator-room';
export const ROOM_MAX_ACTORS = 50;
export const ACTIVITY_PING_FREQUENCY = 5000; // ms
export const ACTIVITY_TIMEOUT = 5 * 1000 * 60; // ms

// Cursors
// Min/max Y values to show a custom cursor in. These values are percentage of
// the alive canvas, calculated from the center of the canvas.
export const SHOW_CUSTOM_CURSOR_MIN_Y = -1.2;
export const SHOW_CUSTOM_CURSOR_MAX_Y = 2;
// Touches give us the radius of the contact surface:
// https://developer.mozilla.org/en-US/docs/Web/API/Touch/radiusX
// Draw a circle around it that has a diameter this many pixels bigger than
// that circle.
export const TOUCH_CIRCLE_PADDING = 70; // px
// Require the finger to be down for a bit before showing the indicator, to
// avoid triggering on taps
export const MIN_TOUCH_TIME_FOR_INDICATOR = 100; // ms

// Splatters
// To avoid our data growing infinitely, "flatten" splatters to an image in
// batches if they are sufficiently old.
export const SPLATTER_MAX_AGE = 1000; // ms
export const SPLATTER_FLATTEN_FREQUENCY = 50; // count. This must be less than 65535
// Splatter animation speed
export const SPLATTER_ANIMATION_FRAME_DURATION = 30; // ~33fps
// Fire splatters at this rate
export const SPLATTER_FIRE_RATE = 84; // ~12fps

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
export const ENVIRONMENT_TEXTURE_LEVEL = 0.3;

// The only data that changes on an actor is the loction, so update them at a
// lower frequency than cursors.
export const ACTOR_UPDATE_INTERVAL = 1000;

// Cycle through these colors for users.
// Rust stores both start and end colors, and stores them as a flat list. Pull
// out the first 3 of each 6-length slice.
export const COLOR_PALATE: Color[] = COLOR_PALATE_RS.reduce(
  (palate, val, idx) => {
    if (idx % 6 === 0) {
      palate.push([val, COLOR_PALATE_RS[idx + 1], COLOR_PALATE_RS[idx + 2]]);
    }
    return palate;
  },
  [] as [number, number, number][],
);

// Mutators

// Can't put more than 131072 bytes in a DO, so use a number under half that
// since these will refer to strings
export const CACHE_CHUNK_STRING_SIZE = 65535;

// Bots

export const BOT_RANDOM_LOCATIONS = [
  'Jaipur 🇮🇳',
  'Mumbai 🇮🇳',
  'Basra 🇮🇶',
  'Dubai 🇦🇪',
  'Medellin 🇨🇴',
  'Gujranwala 🇵🇰',
  'Abuja 🇳🇪',
  'Dhaka 🇧🇩',
  'Taipei 🇹🇼',
  'Nablus 🇵🇸',
  'Hanoi 🇻🇳',
  'Curitiba 🇧🇷',
  'Alexandria 🇪🇬',
  'Bangkok 🇹🇭',
  'Khartoum 🇸🇩',
  'Zürich 🇨🇭',
  'Geneva 🇨🇭',
  'Paris 🇫🇷',
  'Lyon 🇫🇷',
  'Oslo 🇳🇴',
  'Tokyo 🇯🇵',
  'London 🇬🇧',
  'Singapore 🇸🇬',
  'Hong Kong 🇨🇳',
  'Shanghai 🇨🇳',
  'Beijing 🇨🇳',
  'Sydney 🇦🇺',
  'Melbourne 🇦🇺',
  'Frankfurt 🇩🇪',
  'Toronto 🇨🇦',
  'Seoul 🇰🇷',
  'New York 🇺🇸',
  'Los Angeles 🇺🇸',
  'Dallas 🇺🇸',
  'Houston 🇺🇸',
  'Chicago 🇺🇸',
  'Washington D.C. 🇺🇸',
  'Detroit 🇺🇸',
  'Phoenix 🇺🇸',
  'Plano 🇺🇸',
  'San Bernardino 🇺🇸',
  'Salt Lake City 🇺🇸',
  'New Haven 🇺🇸',
  'New Orleans 🇺🇸',
  'Page 🇺🇸',
  'Tuscon 🇺🇸',
  'Miami 🇺🇸',
  'Arlington 🇺🇸',
  'Modesto 🇺🇸',
  'Memphis 🇺🇸',
  'Chesapeake 🇺🇸',
  'Anaheim 🇺🇸',
  'Tulsa 🇺🇸',
  'Durham 🇺🇸',
  'Montgomery 🇺🇸',
  'San Antonio 🇺🇸',
  'Minneapolis 🇺🇸',
  'Dallas 🇺🇸',
  'San Francisco 🇺🇸',
  'Oakland 🇺🇸',
  'San Jose 🇺🇸',
  'Portland 🇺🇸',
  'Sunnyvale 🇺🇸',
  'Santa Clara 🇺🇸',
  'Redwood City 🇺🇸',
  'Mountain View 🇺🇸',
  'Palo Alto 🇺🇸',
  'Menlo Park 🇺🇸',
  'Cupertino 🇺🇸',
  'Atlanta 🇺🇸',
  'Honolulu 🇺🇸',
];
