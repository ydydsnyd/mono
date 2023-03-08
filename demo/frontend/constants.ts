// Frontend constants - anything that uses a build-time dependency like process
// needs to be in this file, as the worker runs in an isolate, which does not
// have node.js globals.

// Sample fps at this low pass. Higher means a longer sample time, resulting in
// averaging over a longer period of time.
export const FPS_LOW_PASS = 10;
export const DEBUG_PHYSICS = process.env.NEXT_PUBLIC_DEBUG_PHYSICS === 'true';
export const DEBUG_TEXTURES = process.env.NEXT_PUBLIC_DEBUG_TEXTURES === 'true';
