import {LETTERS} from './letters';
import type {ActorID, Letter, Point} from './types';

// Converts our js object values into flat args so they can be passed to wasm
// without having to convert into pointers
type renderBatchArgs = [
  Uint32Array, // point_counts: Vec<usize>,
  Float64Array, // timestamps: Vec<f64>,
  Uint32Array, // point_actors: Vec<u32>,
  Uint32Array, // point_groups: Vec<u32>,
  Float32Array, // point_scales: Vec<f32>,
  Uint8Array, // colors: Vec<u8>,
  Float32Array, // x_vals: Vec<f32>,
  Float32Array, // y_vals: Vec<f32>,
  Uint32Array, // splatter_counts: Vec<usize>,
  Float32Array, // splatter_sizes: Vec<f32>,
  Float32Array, // splatter_x_vals: Vec<f32>,
  Float32Array, // splatter_y_vals: Vec<f32>,
];
export const points2RenderBatch = (points: Record<Letter, Point[]>) => {
  // Instead of sending big unicode strings into wasm, just assign each unique
  // actor in this set an integer value, and send that instead of the id.
  let actorNum = 0;
  const actorNums: Record<ActorID, number> = {};
  let totalSplatters = 0;
  const totalPoints = LETTERS.reduce((pointCount, letter) => {
    totalSplatters += points[letter].reduce((count, p) => {
      if (!actorNums[p.u]) {
        actorNums[p.u] = actorNum++;
      }
      count += p.p.length;
      return count;
    }, 0);
    return pointCount + points[letter].length;
  }, 0);
  const args: renderBatchArgs = [
    new Uint32Array(LETTERS.length),
    new Float64Array(totalPoints),
    new Uint32Array(totalPoints),
    new Uint32Array(totalPoints),
    new Float32Array(totalPoints),
    new Uint8Array(totalPoints),
    new Float32Array(totalPoints),
    new Float32Array(totalPoints),
    new Uint32Array(totalPoints),
    new Float32Array(totalSplatters),
    new Float32Array(totalSplatters),
    new Float32Array(totalSplatters),
  ];

  let pBaseIdx = 0;
  let sBaseIdx = 0;
  LETTERS.forEach((letter, letterIdx) => {
    args[0][letterIdx] = points[letter].length;
    points[letter].forEach((point, pIdx) => {
      const index = pBaseIdx + pIdx;
      args[1][index] = point.t;
      args[2][index] = actorNums[point.u];
      args[3][index] = point.g;
      args[4][index] = point.s;
      args[5][index] = point.c;
      args[6][index] = point.x;
      args[7][index] = point.y;
      args[8][index] = point.p.length;
      point.p.forEach((splatter, sIndex) => {
        const index = sBaseIdx + sIndex;
        args[9][index] = splatter.s;
        args[10][index] = splatter.x;
        args[11][index] = splatter.y;
      });
      sBaseIdx += point.p.length;
    });
    pBaseIdx += points[letter].length;
  });
  return args;
};

type renderArgs = [
  number, //point_count: usize,
  Float64Array, // timestamps: Vec<f64>,
  Uint32Array, // point_actors: Vec<u32>,
  Uint32Array, // point_groups: Vec<u32>,
  Float32Array, // point_scales: Vec<f32>,
  Uint8Array, // colors: Vec<u8>,
  Float32Array, // x_vals: Vec<f32>,
  Float32Array, // y_vals: Vec<f32>,
  Uint32Array, // splatter_counts: Vec<usize>,
  Float32Array, // splatter_sizes: Vec<f32>,
  Float32Array, // splatter_x_vals: Vec<f32>,
  Float32Array, // splatter_y_vals: Vec<f32>,
];

export const points2Render = (points: Point[]) => {
  // Instead of sending big unicode strings into wasm, just assign each unique
  // actor in this set an integer value, and send that instead of the id.
  let actorNum = 0;
  const actorNums: Record<ActorID, number> = {};
  const splatterCount = points.reduce((count, p) => {
    if (!actorNums[p.u]) {
      actorNums[p.u] = actorNum++;
    }
    count += p.p.length;
    return count;
  }, 0);
  const args: renderArgs = [
    points.length,
    new Float64Array(points.length),
    new Uint32Array(points.length),
    new Uint32Array(points.length),
    new Float32Array(points.length),
    new Uint8Array(points.length),
    new Float32Array(points.length),
    new Float32Array(points.length),
    new Uint32Array(points.length),
    new Float32Array(splatterCount),
    new Float32Array(splatterCount),
    new Float32Array(splatterCount),
  ];
  let sBaseIdx = 0;
  points.forEach((point, index) => {
    args[1][index] = point.t;
    args[2][index] = actorNums[point.u];
    args[3][index] = point.g;
    args[4][index] = point.s;
    args[5][index] = point.c;
    args[6][index] = point.x;
    args[7][index] = point.y;
    args[8][index] = point.p.length;
    point.p.forEach((splatter, sIndex) => {
      const index = sBaseIdx + sIndex;
      args[9][index] = splatter.s;
      args[10][index] = splatter.x;
      args[11][index] = splatter.y;
    });
    sBaseIdx += point.p.length;
  });
  return args;
};
