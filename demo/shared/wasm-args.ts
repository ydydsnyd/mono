import {LETTERS} from './letters';
import type {ActorID, Letter, Splatter} from './types';

// Converts our js object values into flat args so they can be passed to wasm
// without having to convert into pointers
type renderBatchArgs = [
  Uint32Array, // splatter_counts: Vec<usize>,
  Float64Array, // timestamps: Vec<f64>,
  Uint32Array, // splatter_actors: Vec<u32>,
  Uint8Array, // colors: Vec<u8>,
  Float32Array, // x_vals: Vec<f32>,
  Float32Array, // y_vals: Vec<f32>,
  Uint8Array, // splatter_animations: Vec<u8>,
  Float32Array, // splatter_rotations: Vec<f32>,
];
export const splatters2RenderBatch = (
  splatters: Record<Letter, Splatter[]>,
) => {
  // Instead of sending big unicode strings into wasm, just assign each unique
  // actor in this set an integer value, and send that instead of the id.
  let actorNum = 0;
  const actorNums: Record<ActorID, number> = {};
  const totalSplatters = LETTERS.reduce((splatterCount, letter) => {
    splatters[letter].forEach(s => {
      if (!actorNums[s.u]) {
        actorNums[s.u] = actorNum++;
      }
    });
    return splatterCount + splatters[letter].length;
  }, 0);
  const args: renderBatchArgs = [
    new Uint32Array(LETTERS.length),
    new Float64Array(totalSplatters),
    new Uint32Array(totalSplatters),
    new Uint8Array(totalSplatters),
    new Float32Array(totalSplatters),
    new Float32Array(totalSplatters),
    new Uint8Array(totalSplatters),
    new Float32Array(totalSplatters),
  ];

  let baseIdx = 0;
  LETTERS.forEach((letter, letterIdx) => {
    args[0][letterIdx] = splatters[letter].length;
    splatters[letter].forEach((splatter, idx) => {
      const index = baseIdx + idx;
      args[1][index] = splatter.t;
      args[2][index] = actorNums[splatter.u];
      args[3][index] = splatter.c;
      args[4][index] = splatter.x;
      args[5][index] = splatter.y;
      args[6][index] = splatter.a;
      args[7][index] = splatter.r;
    });
    baseIdx += splatters[letter].length;
  });
  return args;
};

type renderArgs = [
  number, // splatter_count: usize,
  Float64Array, // timestamps: Vec<f64>,
  Uint32Array, // point_actors: Vec<u32>,
  Uint8Array, // colors: Vec<u8>,
  Float32Array, // x_vals: Vec<f32>,
  Float32Array, // y_vals: Vec<f32>,
  Uint8Array, // splatter_animations: Vec<u8>,
  Float32Array, // splatter_rotations: Vec<f32>,
];

export const splatters2Render = (splatters: Splatter[]) => {
  // Instead of sending big unicode strings into wasm, just assign each unique
  // actor in this set an integer value, and send that instead of the id.
  let actorNum = 0;
  const actorNums: Record<ActorID, number> = {};
  splatters.forEach(s => {
    if (!actorNums[s.u]) {
      actorNums[s.u] = actorNum++;
    }
  });
  const args: renderArgs = [
    splatters.length,
    new Float64Array(splatters.length),
    new Uint32Array(splatters.length),
    new Uint8Array(splatters.length),
    new Float32Array(splatters.length),
    new Float32Array(splatters.length),
    new Uint8Array(splatters.length),
    new Float32Array(splatters.length),
  ];
  splatters.forEach((splatter, index) => {
    args[1][index] = splatter.t;
    args[2][index] = actorNums[splatter.u];
    args[3][index] = splatter.c;
    args[4][index] = splatter.x;
    args[5][index] = splatter.y;
    args[6][index] = splatter.a;
    args[7][index] = splatter.r;
  });
  return args;
};
