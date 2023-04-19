import type {Color} from './types';

// Globals
export const USER_ID = 'anon';
export const LOCATION_PLACEHOLDER = 'Somewhere';

// Visual
export const PIECE_MIN_Z_INDEX = 200;
export const SVG_ORIGINAL_SIZE = {width: 568, height: 198};

// Bucketing
export const ORCHESTRATOR_ROOM_ID = 'orchestrator-room';
export const ROOM_MAX_ACTORS = 50;
export const ACTIVITY_PING_FREQUENCY = 5000; // ms
export const ACTIVITY_TIMEOUT = 2 * 1000 * 60; // ms

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

// Some browsers are capable of rendering > 60fps, but we don't expect/want that
// since we assume each step is about 16ms.
export const MIN_STEP_MS = 16;

// The only data that changes on an actor is the loction, so update them at a
// lower frequency than cursors.
export const ACTOR_UPDATE_INTERVAL = 1000;

// Cycle through these colors for users.
// Rust stores both start and end colors, and stores them as a flat list. Pull
// out the first 3 of each 6-length slice.
// This is stored as a flat array so that it can be imported into rust without
// messing with types or implementing serialization.
// For each color, there are 6 consecutive values. The first 3 are the r,g,b of
// the starting color, and the second 3 are the r,g,b of the ending color.
export const COLOR_PALATE_RS: number[] = [
  // Pink
  252, 73, 171, 223, 0, 122,
  // Light Blue
  95, 232, 255, 0, 197, 229,
  // Orange
  255, 153, 0, 211, 127, 0,
  // Green
  100, 255, 0, 94, 217, 15,
  // Blue
  57, 184, 255, 29, 157, 229,
  // Red
  255, 156, 156, 238, 126, 126,
  // Turquoise
  46, 214, 214, 39, 195, 195,
  // Magenta
  235, 10, 255, 213, 5, 232,
  // Citrine
  237, 200, 4, 219, 185, 9,
];
export const COLOR_PALATE: Color[] = COLOR_PALATE_RS.reduce(
  (palate, val, idx) => {
    if (idx % 6 === 0) {
      palate.push([val, COLOR_PALATE_RS[idx + 1], COLOR_PALATE_RS[idx + 2]]);
    }
    return palate;
  },
  [] as [number, number, number][],
);

// Bots

// We divide the alive timestamp by this, and if it's 0 (and we have less than
// MAX_CONCURRENT_BOTS, and we're not already playing a bot), we run a bot.
export const BOT_RANDOM_SEED = 5;
// The chance that any given bot will place a piece vs just browsing around
export const PLACE_PIECE_PROBABILITY = 1;
export const MIN_BROWSE_FRAMES = 100;
export const MIN_FIND_OR_DRAG_FRAMES = 20;
export const FIND_LENGTH_RANGE = [20, 200];
export const MAX_CLIENT_BROADCASTS = 1;
export const MAX_CONCURRENT_BOTS = 3;
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
