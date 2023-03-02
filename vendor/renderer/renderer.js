import { UVMAP_SIZE, SPLATTER_ANIM_FRAMES, MAX_RENDERED_PHYSICS_STEPS } from './snippets/renderer-ba6236b463686f63/src/constants.ts';

let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
/**
*/
export function precompute() {
    wasm.precompute();
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {number} letter
* @param {Uint8Array} png_data
*/
export function update_cache(letter, png_data) {
    const ptr0 = passArray8ToWasm0(png_data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    wasm.update_cache(letter, ptr0, len0);
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {CanvasRenderingContext2D} ctx_a
* @param {CanvasRenderingContext2D} ctx_l
* @param {CanvasRenderingContext2D} ctx_i
* @param {CanvasRenderingContext2D} ctx_v
* @param {CanvasRenderingContext2D} ctx_e
*/
export function draw_caches(ctx_a, ctx_l, ctx_i, ctx_v, ctx_e) {
    try {
        wasm.draw_caches(addBorrowedObject(ctx_a), addBorrowedObject(ctx_l), addBorrowedObject(ctx_i), addBorrowedObject(ctx_v), addBorrowedObject(ctx_e));
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

let cachedUint32Memory0 = new Uint32Array();

function getUint32Memory0() {
    if (cachedUint32Memory0.byteLength === 0) {
        cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32Memory0;
}

function passArray32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getUint32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachedFloat32Memory0 = new Float32Array();

function getFloat32Memory0() {
    if (cachedFloat32Memory0.byteLength === 0) {
        cachedFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachedFloat32Memory0;
}

function passArrayF32ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 4);
    getFloat32Memory0().set(arg, ptr / 4);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
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
export function draw_buffer_png(letter, step, a_colors, b_colors, c_colors, d_colors, e_colors, splatter_count, steps, splatter_actors, colors, x_vals, y_vals, splatter_animations, splatter_rotations) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray8ToWasm0(a_colors, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(b_colors, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(c_colors, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArray8ToWasm0(d_colors, wasm.__wbindgen_malloc);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArray8ToWasm0(e_colors, wasm.__wbindgen_malloc);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArray32ToWasm0(steps, wasm.__wbindgen_malloc);
        const len5 = WASM_VECTOR_LEN;
        const ptr6 = passArray32ToWasm0(splatter_actors, wasm.__wbindgen_malloc);
        const len6 = WASM_VECTOR_LEN;
        const ptr7 = passArray8ToWasm0(colors, wasm.__wbindgen_malloc);
        const len7 = WASM_VECTOR_LEN;
        const ptr8 = passArrayF32ToWasm0(x_vals, wasm.__wbindgen_malloc);
        const len8 = WASM_VECTOR_LEN;
        const ptr9 = passArrayF32ToWasm0(y_vals, wasm.__wbindgen_malloc);
        const len9 = WASM_VECTOR_LEN;
        const ptr10 = passArray8ToWasm0(splatter_animations, wasm.__wbindgen_malloc);
        const len10 = WASM_VECTOR_LEN;
        const ptr11 = passArray8ToWasm0(splatter_rotations, wasm.__wbindgen_malloc);
        const len11 = WASM_VECTOR_LEN;
        wasm.draw_buffer_png(retptr, letter, step, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, splatter_count, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10, ptr11, len11);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v12 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v12;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

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
export function draw_buffers(ctx_a, ctx_l, ctx_i, ctx_v, ctx_e, step, a_colors, b_colors, c_colors, d_colors, e_colors, splatter_counts, steps, splatter_actors, colors, x_vals, y_vals, splatter_animations, splatter_rotations) {
    try {
        const ptr0 = passArray8ToWasm0(a_colors, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(b_colors, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray8ToWasm0(c_colors, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArray8ToWasm0(d_colors, wasm.__wbindgen_malloc);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArray8ToWasm0(e_colors, wasm.__wbindgen_malloc);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArray32ToWasm0(splatter_counts, wasm.__wbindgen_malloc);
        const len5 = WASM_VECTOR_LEN;
        const ptr6 = passArray32ToWasm0(steps, wasm.__wbindgen_malloc);
        const len6 = WASM_VECTOR_LEN;
        const ptr7 = passArray32ToWasm0(splatter_actors, wasm.__wbindgen_malloc);
        const len7 = WASM_VECTOR_LEN;
        const ptr8 = passArray8ToWasm0(colors, wasm.__wbindgen_malloc);
        const len8 = WASM_VECTOR_LEN;
        const ptr9 = passArrayF32ToWasm0(x_vals, wasm.__wbindgen_malloc);
        const len9 = WASM_VECTOR_LEN;
        const ptr10 = passArrayF32ToWasm0(y_vals, wasm.__wbindgen_malloc);
        const len10 = WASM_VECTOR_LEN;
        const ptr11 = passArray8ToWasm0(splatter_animations, wasm.__wbindgen_malloc);
        const len11 = WASM_VECTOR_LEN;
        const ptr12 = passArray8ToWasm0(splatter_rotations, wasm.__wbindgen_malloc);
        const len12 = WASM_VECTOR_LEN;
        wasm.draw_buffers(addBorrowedObject(ctx_a), addBorrowedObject(ctx_l), addBorrowedObject(ctx_i), addBorrowedObject(ctx_v), addBorrowedObject(ctx_e), step, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10, ptr11, len11, ptr12, len12);
    } finally {
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
        heap[stack_pointer++] = undefined;
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
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
export function update_physics_state(serialized_physics, start_step, num_steps, a_impulse_steps, a_impulse_x, a_impulse_y, a_impulse_z, l_impulse_steps, l_impulse_x, l_impulse_y, l_impulse_z, i_impulse_steps, i_impulse_x, i_impulse_y, i_impulse_z, v_impulse_steps, v_impulse_x, v_impulse_y, v_impulse_z, e_impulse_steps, e_impulse_x, e_impulse_y, e_impulse_z) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        var ptr0 = isLikeNone(serialized_physics) ? 0 : passArray8ToWasm0(serialized_physics, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(a_impulse_steps, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF32ToWasm0(a_impulse_x, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF32ToWasm0(a_impulse_y, wasm.__wbindgen_malloc);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArrayF32ToWasm0(a_impulse_z, wasm.__wbindgen_malloc);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArray32ToWasm0(l_impulse_steps, wasm.__wbindgen_malloc);
        const len5 = WASM_VECTOR_LEN;
        const ptr6 = passArrayF32ToWasm0(l_impulse_x, wasm.__wbindgen_malloc);
        const len6 = WASM_VECTOR_LEN;
        const ptr7 = passArrayF32ToWasm0(l_impulse_y, wasm.__wbindgen_malloc);
        const len7 = WASM_VECTOR_LEN;
        const ptr8 = passArrayF32ToWasm0(l_impulse_z, wasm.__wbindgen_malloc);
        const len8 = WASM_VECTOR_LEN;
        const ptr9 = passArray32ToWasm0(i_impulse_steps, wasm.__wbindgen_malloc);
        const len9 = WASM_VECTOR_LEN;
        const ptr10 = passArrayF32ToWasm0(i_impulse_x, wasm.__wbindgen_malloc);
        const len10 = WASM_VECTOR_LEN;
        const ptr11 = passArrayF32ToWasm0(i_impulse_y, wasm.__wbindgen_malloc);
        const len11 = WASM_VECTOR_LEN;
        const ptr12 = passArrayF32ToWasm0(i_impulse_z, wasm.__wbindgen_malloc);
        const len12 = WASM_VECTOR_LEN;
        const ptr13 = passArray32ToWasm0(v_impulse_steps, wasm.__wbindgen_malloc);
        const len13 = WASM_VECTOR_LEN;
        const ptr14 = passArrayF32ToWasm0(v_impulse_x, wasm.__wbindgen_malloc);
        const len14 = WASM_VECTOR_LEN;
        const ptr15 = passArrayF32ToWasm0(v_impulse_y, wasm.__wbindgen_malloc);
        const len15 = WASM_VECTOR_LEN;
        const ptr16 = passArrayF32ToWasm0(v_impulse_z, wasm.__wbindgen_malloc);
        const len16 = WASM_VECTOR_LEN;
        const ptr17 = passArray32ToWasm0(e_impulse_steps, wasm.__wbindgen_malloc);
        const len17 = WASM_VECTOR_LEN;
        const ptr18 = passArrayF32ToWasm0(e_impulse_x, wasm.__wbindgen_malloc);
        const len18 = WASM_VECTOR_LEN;
        const ptr19 = passArrayF32ToWasm0(e_impulse_y, wasm.__wbindgen_malloc);
        const len19 = WASM_VECTOR_LEN;
        const ptr20 = passArrayF32ToWasm0(e_impulse_z, wasm.__wbindgen_malloc);
        const len20 = WASM_VECTOR_LEN;
        wasm.update_physics_state(retptr, ptr0, len0, start_step, num_steps, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10, ptr11, len11, ptr12, len12, ptr13, len13, ptr14, len14, ptr15, len15, ptr16, len16, ptr17, len17, ptr18, len18, ptr19, len19, ptr20, len20);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var v21 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v21;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {Uint8Array | undefined} serialized_physics
* @param {number} step
*/
export function set_physics_state(serialized_physics, step) {
    var ptr0 = isLikeNone(serialized_physics) ? 0 : passArray8ToWasm0(serialized_physics, wasm.__wbindgen_malloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.set_physics_state(ptr0, len0, step);
}

/**
* @returns {number}
*/
export function get_physics_cache_step() {
    const ret = wasm.get_physics_cache_step();
    return ret >>> 0;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}
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
export function positions_for_step(target_step, a_impulse_steps, a_impulse_x, a_impulse_y, a_impulse_z, l_impulse_steps, l_impulse_x, l_impulse_y, l_impulse_z, i_impulse_steps, i_impulse_x, i_impulse_y, i_impulse_z, v_impulse_steps, v_impulse_x, v_impulse_y, v_impulse_z, e_impulse_steps, e_impulse_x, e_impulse_y, e_impulse_z) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        const ptr0 = passArray32ToWasm0(a_impulse_steps, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF32ToWasm0(a_impulse_x, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF32ToWasm0(a_impulse_y, wasm.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        const ptr3 = passArrayF32ToWasm0(a_impulse_z, wasm.__wbindgen_malloc);
        const len3 = WASM_VECTOR_LEN;
        const ptr4 = passArray32ToWasm0(l_impulse_steps, wasm.__wbindgen_malloc);
        const len4 = WASM_VECTOR_LEN;
        const ptr5 = passArrayF32ToWasm0(l_impulse_x, wasm.__wbindgen_malloc);
        const len5 = WASM_VECTOR_LEN;
        const ptr6 = passArrayF32ToWasm0(l_impulse_y, wasm.__wbindgen_malloc);
        const len6 = WASM_VECTOR_LEN;
        const ptr7 = passArrayF32ToWasm0(l_impulse_z, wasm.__wbindgen_malloc);
        const len7 = WASM_VECTOR_LEN;
        const ptr8 = passArray32ToWasm0(i_impulse_steps, wasm.__wbindgen_malloc);
        const len8 = WASM_VECTOR_LEN;
        const ptr9 = passArrayF32ToWasm0(i_impulse_x, wasm.__wbindgen_malloc);
        const len9 = WASM_VECTOR_LEN;
        const ptr10 = passArrayF32ToWasm0(i_impulse_y, wasm.__wbindgen_malloc);
        const len10 = WASM_VECTOR_LEN;
        const ptr11 = passArrayF32ToWasm0(i_impulse_z, wasm.__wbindgen_malloc);
        const len11 = WASM_VECTOR_LEN;
        const ptr12 = passArray32ToWasm0(v_impulse_steps, wasm.__wbindgen_malloc);
        const len12 = WASM_VECTOR_LEN;
        const ptr13 = passArrayF32ToWasm0(v_impulse_x, wasm.__wbindgen_malloc);
        const len13 = WASM_VECTOR_LEN;
        const ptr14 = passArrayF32ToWasm0(v_impulse_y, wasm.__wbindgen_malloc);
        const len14 = WASM_VECTOR_LEN;
        const ptr15 = passArrayF32ToWasm0(v_impulse_z, wasm.__wbindgen_malloc);
        const len15 = WASM_VECTOR_LEN;
        const ptr16 = passArray32ToWasm0(e_impulse_steps, wasm.__wbindgen_malloc);
        const len16 = WASM_VECTOR_LEN;
        const ptr17 = passArrayF32ToWasm0(e_impulse_x, wasm.__wbindgen_malloc);
        const len17 = WASM_VECTOR_LEN;
        const ptr18 = passArrayF32ToWasm0(e_impulse_y, wasm.__wbindgen_malloc);
        const len18 = WASM_VECTOR_LEN;
        const ptr19 = passArrayF32ToWasm0(e_impulse_z, wasm.__wbindgen_malloc);
        const len19 = WASM_VECTOR_LEN;
        wasm.positions_for_step(retptr, target_step, ptr0, len0, ptr1, len1, ptr2, len2, ptr3, len3, ptr4, len4, ptr5, len5, ptr6, len6, ptr7, len7, ptr8, len8, ptr9, len9, ptr10, len10, ptr11, len11, ptr12, len12, ptr13, len13, ptr14, len14, ptr15, len15, ptr16, len16, ptr17, len17, ptr18, len18, ptr19, len19);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        let v20;
        if (r0 !== 0) {
            v20 = getArrayF32FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 4);
        }
        return v20;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

let cachedUint8ClampedMemory0 = new Uint8ClampedArray();

function getUint8ClampedMemory0() {
    if (cachedUint8ClampedMemory0.byteLength === 0) {
        cachedUint8ClampedMemory0 = new Uint8ClampedArray(wasm.memory.buffer);
    }
    return cachedUint8ClampedMemory0;
}

function getClampedArrayU8FromWasm0(ptr, len) {
    return getUint8ClampedMemory0().subarray(ptr / 1, ptr / 1 + len);
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export const Letter = Object.freeze({ A:0,"0":"A",L:1,"1":"L",I:2,"2":"I",V:3,"3":"V",E:4,"4":"E", });

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_static_accessor_MAX_RENDERED_PHYSICS_STEPS_1227ae48b3a9f731 = function() {
        const ret = MAX_RENDERED_PHYSICS_STEPS;
        return ret;
    };
    imports.wbg.__wbg_static_accessor_SPLATTER_ANIM_FRAMES_659fe1818af3aa5a = function() {
        const ret = SPLATTER_ANIM_FRAMES;
        return ret;
    };
    imports.wbg.__wbg_static_accessor_UVMAP_SIZE_a2041fefcbe5a985 = function() {
        const ret = UVMAP_SIZE;
        return ret;
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_log_94ec9f9334743f04 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_newwithu8clampedarrayandsh_f7ef3a8f3fd04c8a = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_putImageData_23e0cc41d4fabcde = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        getObject(arg0).putImageData(getObject(arg1), arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_new_abda76e883ba8a5f = function() {
        const ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_658279fe44541cf6 = function(arg0, arg1) {
        const ret = getObject(arg1).stack;
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_error_f851667af71bcfc6 = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedFloat32Memory0 = new Float32Array();
    cachedInt32Memory0 = new Int32Array();
    cachedUint32Memory0 = new Uint32Array();
    cachedUint8Memory0 = new Uint8Array();
    cachedUint8ClampedMemory0 = new Uint8ClampedArray();


    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('renderer_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
