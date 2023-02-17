/* tslint:disable */
/* eslint-disable */
/**
* @param {number} letter
* @param {Uint8Array} png_data
*/
export function update_cache(letter: number, png_data: Uint8Array): void;
/**
* @param {number} letter
* @param {number} time
* @param {Uint8Array} a_colors
* @param {Uint8Array} b_colors
* @param {Uint8Array} c_colors
* @param {Uint8Array} d_colors
* @param {Uint8Array} e_colors
* @param {number} splatter_count
* @param {Float64Array} timestamps
* @param {Uint32Array} splatter_actors
* @param {Uint8Array} colors
* @param {Float32Array} x_vals
* @param {Float32Array} y_vals
* @param {Uint8Array} splatter_animations
* @param {Float32Array} splatter_rotations
* @returns {Uint8Array}
*/
export function draw_buffer_png(letter: number, time: number, a_colors: Uint8Array, b_colors: Uint8Array, c_colors: Uint8Array, d_colors: Uint8Array, e_colors: Uint8Array, splatter_count: number, timestamps: Float64Array, splatter_actors: Uint32Array, colors: Uint8Array, x_vals: Float32Array, y_vals: Float32Array, splatter_animations: Uint8Array, splatter_rotations: Float32Array): Uint8Array;
/**
* @param {number} letter
* @param {CanvasRenderingContext2D} ctx
* @param {number} time
* @param {Uint8Array} a_colors
* @param {Uint8Array} b_colors
* @param {Uint8Array} c_colors
* @param {Uint8Array} d_colors
* @param {Uint8Array} e_colors
* @param {number} splatter_count
* @param {Float64Array} timestamps
* @param {Uint32Array} splatter_actors
* @param {Uint8Array} colors
* @param {Float32Array} x_vals
* @param {Float32Array} y_vals
* @param {Uint8Array} splatter_animations
* @param {Float32Array} splatter_rotations
*/
export function add_points_to_cache(letter: number, ctx: CanvasRenderingContext2D, time: number, a_colors: Uint8Array, b_colors: Uint8Array, c_colors: Uint8Array, d_colors: Uint8Array, e_colors: Uint8Array, splatter_count: number, timestamps: Float64Array, splatter_actors: Uint32Array, colors: Uint8Array, x_vals: Float32Array, y_vals: Float32Array, splatter_animations: Uint8Array, splatter_rotations: Float32Array): void;
/**
* @param {CanvasRenderingContext2D} ctx_a
* @param {CanvasRenderingContext2D} ctx_l
* @param {CanvasRenderingContext2D} ctx_i
* @param {CanvasRenderingContext2D} ctx_v
* @param {CanvasRenderingContext2D} ctx_e
* @param {number} time
* @param {Uint8Array} a_colors
* @param {Uint8Array} b_colors
* @param {Uint8Array} c_colors
* @param {Uint8Array} d_colors
* @param {Uint8Array} e_colors
* @param {Uint32Array} splatter_counts
* @param {Float64Array} timestamps
* @param {Uint32Array} splatter_actors
* @param {Uint8Array} colors
* @param {Float32Array} x_vals
* @param {Float32Array} y_vals
* @param {Uint8Array} splatter_animations
* @param {Float32Array} splatter_rotations
*/
export function draw_buffers(ctx_a: CanvasRenderingContext2D, ctx_l: CanvasRenderingContext2D, ctx_i: CanvasRenderingContext2D, ctx_v: CanvasRenderingContext2D, ctx_e: CanvasRenderingContext2D, time: number, a_colors: Uint8Array, b_colors: Uint8Array, c_colors: Uint8Array, d_colors: Uint8Array, e_colors: Uint8Array, splatter_counts: Uint32Array, timestamps: Float64Array, splatter_actors: Uint32Array, colors: Uint8Array, x_vals: Float32Array, y_vals: Float32Array, splatter_animations: Uint8Array, splatter_rotations: Float32Array): void;
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
  readonly update_cache: (a: number, b: number, c: number) => void;
  readonly draw_buffer_png: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number) => number;
  readonly add_points_to_cache: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number, b1: number) => void;
  readonly draw_buffers: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number, s: number, t: number, u: number, v: number, w: number, x: number, y: number, z: number, a1: number, b1: number, c1: number, d1: number, e1: number, f1: number) => void;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number) => void;
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
