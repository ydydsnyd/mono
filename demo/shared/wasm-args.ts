import type {ActorID, Splatter} from './types';

type renderArgs = [
  number, // splatter_count: usize,
  Uint32Array, // splatter_frames: Vec<usize>,
  Uint32Array, // splatter_actors: Vec<u32>,
  Uint8Array, // colors: Vec<u8>,
  Uint8Array, // sizes: Vec<u8>,
  Float32Array, // x_vals: Vec<f32>,
  Float32Array, // y_vals: Vec<f32>,
  Uint8Array, // splatter_animations: Vec<u8>,
  Uint8Array, // splatter_rotations: Vec<u8>,
];

export const splatters2Render = (splatters: Splatter[], frames: number[]) => {
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
    new Uint32Array(splatters.length),
    new Uint32Array(splatters.length),
    new Uint8Array(splatters.length),
    new Uint8Array(splatters.length),
    new Float32Array(splatters.length),
    new Float32Array(splatters.length),
    new Uint8Array(splatters.length),
    new Uint8Array(splatters.length),
  ];
  splatters.forEach((splatter, index) => {
    args[1][index] = frames[index];
    args[2][index] = actorNums[splatter.u];
    args[3][index] = splatter.c;
    args[4][index] = splatter.s;
    args[5][index] = splatter.x;
    args[6][index] = splatter.y;
    args[7][index] = splatter.a;
    args[8][index] = splatter.r;
  });
  return args;
};
