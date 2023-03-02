/* tslint:disable */
/* eslint-disable */
/**
*/
export function precompute(): void;
/**
* @param {number} letter
* @param {Uint8Array} png_data
*/
export function update_cache(letter: number, png_data: Uint8Array): void;
/**
* @param {CanvasRenderingContext2D} ctx_a
* @param {CanvasRenderingContext2D} ctx_l
* @param {CanvasRenderingContext2D} ctx_i
* @param {CanvasRenderingContext2D} ctx_v
* @param {CanvasRenderingContext2D} ctx_e
*/
export function draw_caches(ctx_a: CanvasRenderingContext2D, ctx_l: CanvasRenderingContext2D, ctx_i: CanvasRenderingContext2D, ctx_v: CanvasRenderingContext2D, ctx_e: CanvasRenderingContext2D): void;
/**
* @param {number} letter
* @param {number} step
* @param {Uint8Array} a_colors
* @param {Uint8Array} b_colors
* @param {Uint8Array} c_colors
* @param {Uint8Array} d_colors
* @param {Uint8Array} e_colors
* @param {number} splatter_count
* @param {Uint32Array} steps
* @param {Uint32Array} splatter_actors
* @param {Uint8Array} colors
* @param {Float32Array} x_vals
* @param {Float32Array} y_vals
* @param {Uint8Array} splatter_animations
* @param {Uint8Array} splatter_rotations
* @returns {Uint8Array}
*/
export function draw_buffer_png(letter: number, step: number, a_colors: Uint8Array, b_colors: Uint8Array, c_colors: Uint8Array, d_colors: Uint8Array, e_colors: Uint8Array, splatter_count: number, steps: Uint32Array, splatter_actors: Uint32Array, colors: Uint8Array, x_vals: Float32Array, y_vals: Float32Array, splatter_animations: Uint8Array, splatter_rotations: Uint8Array): Uint8Array;
/**
* @param {CanvasRenderingContext2D} ctx_a
* @param {CanvasRenderingContext2D} ctx_l
* @param {CanvasRenderingContext2D} ctx_i
* @param {CanvasRenderingContext2D} ctx_v
* @param {CanvasRenderingContext2D} ctx_e
* @param {number} step
* @param {Uint8Array} a_colors
* @param {Uint8Array} b_colors
* @param {Uint8Array} c_colors
* @param {Uint8Array} d_colors
* @param {Uint8Array} e_colors
* @param {Uint32Array} splatter_counts
* @param {Uint32Array} steps
* @param {Uint32Array} splatter_actors
* @param {Uint8Array} colors
* @param {Float32Array} x_vals
* @param {Float32Array} y_vals
* @param {Uint8Array} splatter_animations
* @param {Uint8Array} splatter_rotations
*/
export function draw_buffers(ctx_a: CanvasRenderingContext2D, ctx_l: CanvasRenderingContext2D, ctx_i: CanvasRenderingContext2D, ctx_v: CanvasRenderingContext2D, ctx_e: CanvasRenderingContext2D, step: number, a_colors: Uint8Array, b_colors: Uint8Array, c_colors: Uint8Array, d_colors: Uint8Array, e_colors: Uint8Array, splatter_counts: Uint32Array, steps: Uint32Array, splatter_actors: Uint32Array, colors: Uint8Array, x_vals: Float32Array, y_vals: Float32Array, splatter_animations: Uint8Array, splatter_rotations: Uint8Array): void;
/**
* @param {Uint8Array | undefined} serialized_physics
* @param {number} start_step
* @param {number} num_steps
* @param {Uint32Array} a_impulse_steps
* @param {Float32Array} a_impulse_x
* @param {Float32Array} a_impulse_y
* @param {Float32Array} a_impulse_z
* @param {Uint32Array} l_impulse_steps
* @param {Float32Array} l_impulse_x
* @param {Float32Array} l_impulse_y
* @param {Float32Array} l_impulse_z
* @param {Uint32Array} i_impulse_steps
* @param {Float32Array} i_impulse_x
* @param {Float32Array} i_impulse_y
* @param {Float32Array} i_impulse_z
* @param {Uint32Array} v_impulse_steps
* @param {Float32Array} v_impulse_x
* @param {Float32Array} v_impulse_y
* @param {Float32Array} v_impulse_z
* @param {Uint32Array} e_impulse_steps
* @param {Float32Array} e_impulse_x
* @param {Float32Array} e_impulse_y
* @param {Float32Array} e_impulse_z
* @returns {Uint8Array}
*/
export function update_physics_state(serialized_physics: Uint8Array | undefined, start_step: number, num_steps: number, a_impulse_steps: Uint32Array, a_impulse_x: Float32Array, a_impulse_y: Float32Array, a_impulse_z: Float32Array, l_impulse_steps: Uint32Array, l_impulse_x: Float32Array, l_impulse_y: Float32Array, l_impulse_z: Float32Array, i_impulse_steps: Uint32Array, i_impulse_x: Float32Array, i_impulse_y: Float32Array, i_impulse_z: Float32Array, v_impulse_steps: Uint32Array, v_impulse_x: Float32Array, v_impulse_y: Float32Array, v_impulse_z: Float32Array, e_impulse_steps: Uint32Array, e_impulse_x: Float32Array, e_impulse_y: Float32Array, e_impulse_z: Float32Array): Uint8Array;
/**
* @param {Uint8Array} serialized_physics
* @param {number} step
*/
export function set_physics_state(serialized_physics: Uint8Array, step: number): void;
/**
* @returns {number}
*/
export function get_physics_cache_step(): number;
/**
* @param {number} target_step
* @param {Uint32Array} a_impulse_steps
* @param {Float32Array} a_impulse_x
* @param {Float32Array} a_impulse_y
* @param {Float32Array} a_impulse_z
* @param {Uint32Array} l_impulse_steps
* @param {Float32Array} l_impulse_x
* @param {Float32Array} l_impulse_y
* @param {Float32Array} l_impulse_z
* @param {Uint32Array} i_impulse_steps
* @param {Float32Array} i_impulse_x
* @param {Float32Array} i_impulse_y
* @param {Float32Array} i_impulse_z
* @param {Uint32Array} v_impulse_steps
* @param {Float32Array} v_impulse_x
* @param {Float32Array} v_impulse_y
* @param {Float32Array} v_impulse_z
* @param {Uint32Array} e_impulse_steps
* @param {Float32Array} e_impulse_x
* @param {Float32Array} e_impulse_y
* @param {Float32Array} e_impulse_z
* @returns {Float32Array | undefined}
*/
export function positions_for_step(target_step: number, a_impulse_steps: Uint32Array, a_impulse_x: Float32Array, a_impulse_y: Float32Array, a_impulse_z: Float32Array, l_impulse_steps: Uint32Array, l_impulse_x: Float32Array, l_impulse_y: Float32Array, l_impulse_z: Float32Array, i_impulse_steps: Uint32Array, i_impulse_x: Float32Array, i_impulse_y: Float32Array, i_impulse_z: Float32Array, v_impulse_steps: Uint32Array, v_impulse_x: Float32Array, v_impulse_y: Float32Array, v_impulse_z: Float32Array, e_impulse_steps: Uint32Array, e_impulse_x: Float32Array, e_impulse_y: Float32Array, e_impulse_z: Float32Array): Float32Array | undefined;
/**
*/
export enum Letter {
  A,
  L,
  I,
  V,
  E,
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly precompute: () => void;
  readonly update_cache: (a: number, b: number, c: number) => void;
  readonly draw_caches: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly draw_buffer_png: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number, b1: number) => void;
  readonly draw_buffers: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number, b1: number, c1: number, d1: number, e1: number, f1: number) => void;
  readonly update_physics_state: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number, b1: number, c1: number, d1: number, e1: number, f1: number, g1: number, h1: number, i1: number, j1: number, k1: number, l1: number, m1: number, n1: number, o1: number, p1: number, q1: number, r1: number, s1: number) => void;
  readonly set_physics_state: (a: number, b: number, c: number) => void;
  readonly get_physics_cache_step: () => number;
  readonly positions_for_step: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number, b1: number, c1: number, d1: number, e1: number, f1: number, g1: number, h1: number, i1: number, j1: number, k1: number, l1: number, m1: number, n1: number, o1: number, p1: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
