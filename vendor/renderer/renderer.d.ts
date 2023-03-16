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
export function overwrite_caches(ctx_a: CanvasRenderingContext2D, ctx_l: CanvasRenderingContext2D, ctx_i: CanvasRenderingContext2D, ctx_v: CanvasRenderingContext2D, ctx_e: CanvasRenderingContext2D): void;
/**
* @param {CanvasRenderingContext2D} ctx_a
* @param {CanvasRenderingContext2D} ctx_l
* @param {CanvasRenderingContext2D} ctx_i
* @param {CanvasRenderingContext2D} ctx_v
* @param {CanvasRenderingContext2D} ctx_e
*/
export function draw_caches(ctx_a: CanvasRenderingContext2D, ctx_l: CanvasRenderingContext2D, ctx_i: CanvasRenderingContext2D, ctx_v: CanvasRenderingContext2D, ctx_e: CanvasRenderingContext2D): void;
/**
* @param {Uint8Array | undefined} png_data
* @param {number} splatter_count
* @param {Uint32Array} splatter_frames
* @param {Uint32Array} splatter_actors
* @param {Uint8Array} colors
* @param {Float32Array} x_vals
* @param {Float32Array} y_vals
* @param {Uint8Array} splatter_animations
* @param {Uint8Array} splatter_rotations
* @returns {Uint8Array}
*/
export function draw_cache_png(png_data: Uint8Array | undefined, splatter_count: number, splatter_frames: Uint32Array, splatter_actors: Uint32Array, colors: Uint8Array, x_vals: Float32Array, y_vals: Float32Array, splatter_animations: Uint8Array, splatter_rotations: Uint8Array): Uint8Array;
/**
* @param {number} letter
* @param {CanvasRenderingContext2D} ctx
* @param {number} splatter_count
* @param {Uint32Array} splatter_frames
* @param {Uint32Array} splatter_actors
* @param {Uint8Array} colors
* @param {Float32Array} x_vals
* @param {Float32Array} y_vals
* @param {Uint8Array} splatter_animations
* @param {Uint8Array} splatter_rotations
*/
export function draw_buffer(letter: number, ctx: CanvasRenderingContext2D, splatter_count: number, splatter_frames: Uint32Array, splatter_actors: Uint32Array, colors: Uint8Array, x_vals: Float32Array, y_vals: Float32Array, splatter_animations: Uint8Array, splatter_rotations: Uint8Array): void;
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
  readonly overwrite_caches: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly draw_caches: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly draw_cache_png: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number, r: number) => void;
  readonly draw_buffer: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number, k: number, l: number, m: number, n: number, o: number, p: number, q: number) => void;
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
