import {LETTERS} from './letters';
import {ActorID, Impulse, Letter, Splatter} from './types';
import {letterMap} from './util';

type renderArgs = [
  number, // splatter_count: usize,
  Uint32Array, // splatter_frames: Vec<usize>,
  Uint32Array, // splatter_actors: Vec<u32>,
  Uint8Array, // colors: Vec<u8>,
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
    new Float32Array(splatters.length),
    new Float32Array(splatters.length),
    new Uint8Array(splatters.length),
    new Uint8Array(splatters.length),
  ];
  splatters.forEach((splatter, index) => {
    args[1][index] = frames[index];
    args[2][index] = actorNums[splatter.u];
    args[3][index] = splatter.c;
    args[4][index] = splatter.x;
    args[5][index] = splatter.y;
    args[6][index] = splatter.a;
    args[7][index] = splatter.r;
  });
  return args;
};

type physicsArgs = [
  Uint32Array, // a_impulse_steps: Vec<usize>,
  Float32Array, // a_impulse_x: Vec<f32>,
  Float32Array, // a_impulse_y: Vec<f32>,
  Float32Array, // a_impulse_z: Vec<f32>,
  Uint32Array, // l_impulse_steps: Vec<usize>,
  Float32Array, // l_impulse_x: Vec<f32>,
  Float32Array, // l_impulse_y: Vec<f32>,
  Float32Array, // l_impulse_z: Vec<f32>,
  Uint32Array, // i_impulse_steps: Vec<usize>,
  Float32Array, // i_impulse_x: Vec<f32>,
  Float32Array, // i_impulse_y: Vec<f32>,
  Float32Array, // i_impulse_z: Vec<f32>,
  Uint32Array, // v_impulse_steps: Vec<usize>,
  Float32Array, // v_impulse_x: Vec<f32>,
  Float32Array, // v_impulse_y: Vec<f32>,
  Float32Array, // v_impulse_z: Vec<f32>,
  Uint32Array, // v_impulse_steps: Vec<usize>,
  Float32Array, // v_impulse_x: Vec<f32>,
  Float32Array, // v_impulse_y: Vec<f32>,
  Float32Array, // v_impulse_z: Vec<f32>,
];

export const impulses2Physics = (
  impulses: Record<Letter, Impulse[]>,
): physicsArgs => {
  const steps = letterMap<Uint32Array>(
    l => new Uint32Array(impulses[l].length),
  );
  const x_vals = letterMap<Float32Array>(
    l => new Float32Array(impulses[l].length),
  );
  const y_vals = letterMap<Float32Array>(
    l => new Float32Array(impulses[l].length),
  );
  const z_vals = letterMap<Float32Array>(
    l => new Float32Array(impulses[l].length),
  );
  LETTERS.forEach(letter => {
    impulses[letter].forEach((impulse, idx) => {
      steps[letter][idx] = impulse.s;
      x_vals[letter][idx] = impulse.x;
      y_vals[letter][idx] = impulse.y;
      z_vals[letter][idx] = impulse.z;
    });
  });
  return [
    steps[Letter.A],
    x_vals[Letter.A],
    y_vals[Letter.A],
    z_vals[Letter.A],
    steps[Letter.L],
    x_vals[Letter.L],
    y_vals[Letter.L],
    z_vals[Letter.L],
    steps[Letter.I],
    x_vals[Letter.I],
    y_vals[Letter.I],
    z_vals[Letter.I],
    steps[Letter.V],
    x_vals[Letter.V],
    y_vals[Letter.V],
    z_vals[Letter.V],
    steps[Letter.E],
    x_vals[Letter.E],
    y_vals[Letter.E],
    z_vals[Letter.E],
  ];
};
