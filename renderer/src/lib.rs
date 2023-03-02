#[macro_use]
extern crate lazy_static;
extern crate console_error_panic_hook;

mod drawing;
mod physics;

use flate2::{bufread::DeflateDecoder, write::DeflateEncoder, Compression};
use image::{ImageFormat, RgbaImage};
use mut_static::MutStatic;
use nalgebra::point;
use physics::{get_position, Impulse, PhysicsState};
use std::{
    collections::HashMap,
    io::{Cursor, Read, Write},
    panic,
};
use wasm_bindgen::{prelude::*, Clamped};
use web_sys::{CanvasRenderingContext2d, ImageData};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[allow(unused_macros)]
#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => (crate::log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen(module = "/src/constants.ts")]
extern "C" {
    static COLOR_PALATE_RS: Vec<f32>;
    static UVMAP_SIZE: u32;
    static SPLATTER_ANIM_FRAMES: u8;
    static MAX_RENDERED_PHYSICS_STEPS: usize;
}

#[wasm_bindgen]
#[derive(PartialEq, Debug, Clone, Copy)]
pub enum Letter {
    A,
    L,
    I,
    V,
    E,
}

// Data model
// All drawing data is stored on the wasm heap - it can only be updated via rust code:

pub struct Caches {
    a: Vec<u8>,
    l: Vec<u8>,
    i: Vec<u8>,
    v: Vec<u8>,
    e: Vec<u8>,
}

impl Caches {
    pub fn new() -> Caches {
        let data = Caches {
            a: vec![],
            l: vec![],
            i: vec![],
            v: vec![],
            e: vec![],
        };
        data
    }

    pub fn set_data(&mut self, letter: &Letter, img: Vec<u8>) {
        match letter {
            Letter::A => self.a = img,
            Letter::L => self.l = img,
            Letter::I => self.i = img,
            Letter::V => self.v = img,
            Letter::E => self.e = img,
        }
    }

    pub fn get_data(&self, letter: &Letter) -> &Vec<u8> {
        match letter {
            Letter::A => &self.a,
            Letter::L => &self.l,
            Letter::I => &self.i,
            Letter::V => &self.v,
            Letter::E => &self.e,
        }
    }
}

pub struct Physics {
    pub state: PhysicsState,
    pub step: usize,
}

impl Physics {
    pub fn new() -> Physics {
        Physics {
            state: PhysicsState::new(),
            step: 0,
        }
    }

    pub fn copy(&self) -> Physics {
        // TODO: is there a cheaper way to do this?
        let serialized = bincode::serialize(&self.state).unwrap();
        Physics {
            state: bincode::deserialize(&serialized).unwrap(),
            step: self.step,
        }
    }
}

// Persistence - this is where we actually allocate the structs

lazy_static! {
    pub static ref CACHES: MutStatic<Caches> = MutStatic::from(Caches::new());
    pub static ref PHYSICS: MutStatic<Physics> = MutStatic::from(Physics::new());
}

// API - this is our "public" JS API:

#[wasm_bindgen]
pub fn precompute() {
    drawing::precompute();
}

#[wasm_bindgen]
pub fn update_cache(letter: Letter, png_data: Vec<u8>) {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let img =
        image::load_from_memory_with_format(&png_data, ImageFormat::Png).unwrap_or_else(|e| {
            // console_log!("data: {:?}", png_data);
            panic!(
                "Image cache appears to be corrupted. Error: {}",
                e.to_string()
            );
        });
    let pixels = img.as_rgba8().unwrap().to_vec();
    let mut caches = CACHES.write().unwrap();
    caches.set_data(&letter, pixels);
}

// Only used for debugging - draw caches to canvases
#[wasm_bindgen]
pub fn draw_caches(
    ctx_a: &CanvasRenderingContext2d,
    ctx_l: &CanvasRenderingContext2d,
    ctx_i: &CanvasRenderingContext2d,
    ctx_v: &CanvasRenderingContext2d,
    ctx_e: &CanvasRenderingContext2d,
) {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    draw_letter(Letter::A, ctx_a);
    draw_letter(Letter::L, ctx_l);
    draw_letter(Letter::I, ctx_i);
    draw_letter(Letter::V, ctx_v);
    draw_letter(Letter::E, ctx_e);
}
fn draw_letter(letter: Letter, context: &CanvasRenderingContext2d) {
    let caches = CACHES.read().unwrap();
    let cache = caches.get_data(&letter);
    let width = UVMAP_SIZE.clone();
    let height = UVMAP_SIZE.clone();
    if cache.len() == 0 {
        return;
    }
    let data = ImageData::new_with_u8_clamped_array_and_sh(Clamped(&mut &cache), height, width)
        .expect("Bad image data");
    context
        .put_image_data(&data, 0.0, 0.0)
        .expect("Writing to canvas failed");
}

// Render a pixel map to a png, for use on the server side when creating
// compressed "base" images. This isn't efficient enough to use in client-side
// wasm code, but produces a much smaller output than the client code, which is
// appropriate for storing.
#[wasm_bindgen]
pub fn draw_buffer_png(
    letter: Letter,
    step: usize,
    a_colors: Vec<u8>,
    b_colors: Vec<u8>,
    c_colors: Vec<u8>,
    d_colors: Vec<u8>,
    e_colors: Vec<u8>,
    splatter_count: usize,
    steps: Vec<usize>,
    splatter_actors: Vec<u32>,
    colors: Vec<u8>,
    x_vals: Vec<f32>,
    y_vals: Vec<f32>,
    splatter_animations: Vec<u8>,
    splatter_rotations: Vec<u8>,
) -> Vec<u8> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let caches = CACHES.read().unwrap();
    let cache = caches.get_data(&letter);
    let width = UVMAP_SIZE.clone();
    let height = UVMAP_SIZE.clone();
    let mut img: RgbaImage;
    if cache.len() == 0 {
        img = RgbaImage::new(width, height);
    } else {
        img = RgbaImage::from_vec(width, height, cache.to_vec()).expect("Bad image in buffers");
    }
    drawing::draw(
        &mut img,
        step,
        &a_colors,
        &b_colors,
        &c_colors,
        &d_colors,
        &e_colors,
        splatter_count,
        &steps,
        &splatter_actors,
        &colors,
        &x_vals,
        &y_vals,
        &splatter_animations,
        &splatter_rotations,
    );
    let mut png_data = Vec::new();
    img.write_to(&mut Cursor::new(&mut png_data), ImageFormat::Png)
        .expect("Failed writing png data");
    png_data
}

// Per-frame API: when we get new data, draw a buffer which combines our current cache with the provided data.

const LETTERS: [Letter; 5] = [Letter::A, Letter::L, Letter::I, Letter::V, Letter::E];
#[wasm_bindgen]
pub fn draw_buffers(
    ctx_a: &CanvasRenderingContext2d,
    ctx_l: &CanvasRenderingContext2d,
    ctx_i: &CanvasRenderingContext2d,
    ctx_v: &CanvasRenderingContext2d,
    ctx_e: &CanvasRenderingContext2d,
    step: usize,
    a_colors: Vec<u8>,
    b_colors: Vec<u8>,
    c_colors: Vec<u8>,
    d_colors: Vec<u8>,
    e_colors: Vec<u8>,
    splatter_counts: Vec<usize>,
    steps: Vec<usize>,
    splatter_actors: Vec<u32>,
    colors: Vec<u8>,
    x_vals: Vec<f32>,
    y_vals: Vec<f32>,
    splatter_animations: Vec<u8>,
    splatter_rotations: Vec<u8>,
) -> () {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let width = UVMAP_SIZE.clone();
    let height = UVMAP_SIZE.clone();
    let mut caches = CACHES.write().unwrap();
    for letter in LETTERS {
        let cache = caches.get_data(&letter);
        let letter_index = match letter {
            Letter::A => 0,
            Letter::L => 1,
            Letter::I => 2,
            Letter::V => 3,
            Letter::E => 4,
        };
        let splatter_count = splatter_counts[letter_index];
        let mut splatter_range_start = 0;
        for idx in 0..letter_index {
            splatter_range_start += splatter_counts[idx];
        }
        let splatter_end_idx = splatter_range_start + splatter_count;
        let mut img: RgbaImage;
        if cache.len() == 0 {
            img = RgbaImage::new(width, height);
        } else {
            img = RgbaImage::from_vec(width, height, cache.to_vec()).expect("Bad image in caches");
        }
        let ctx = match letter {
            Letter::A => ctx_a,
            Letter::L => ctx_l,
            Letter::I => ctx_i,
            Letter::V => ctx_v,
            Letter::E => ctx_e,
        };
        drawing::draw(
            &mut img,
            step,
            &a_colors,
            &b_colors,
            &c_colors,
            &d_colors,
            &e_colors,
            splatter_count,
            &steps[splatter_range_start..splatter_end_idx],
            &splatter_actors[splatter_range_start..splatter_end_idx],
            &colors[splatter_range_start..splatter_end_idx],
            &x_vals[splatter_range_start..splatter_end_idx],
            &y_vals[splatter_range_start..splatter_end_idx],
            &splatter_animations[splatter_range_start..splatter_end_idx],
            &splatter_rotations[splatter_range_start..splatter_end_idx],
        );
        let data =
            ImageData::new_with_u8_clamped_array_and_sh(Clamped(&mut img.to_vec()), height, width)
                .expect("Bad image data");
        ctx.put_image_data(&data, 0.0, 0.0)
            .expect("Writing to canvas failed");
        // When we update a buffer, also write back to the cache. This is ok because:
        // 1. Every animation builds on the frame before, e.g. a pixel will never be un-drawn if it has been added to a buffer.
        // 2. When we receive a new cache from the server (which could change the order of splatters), it will overwrite our local cache anyway.
        // Note that if we instead drew all splatters since the last server flattening,
        // our cache would always be perfect - but it would be slower. The tradeoff here
        // is that we'll accept a potential sudden re-ordering of splatters in the
        // server cache if it means we will always have very fast renders.
        // If we don't write to the cache here, we'd need to render every splatter in
        // reflect on every frame, which could get expensive (especially offline, where
        // the list will grow forever)
        caches.set_data(&letter, img.to_vec());
    }
}

// Physics API

#[wasm_bindgen]
pub fn update_physics_state(
    serialized_physics: Option<Vec<u8>>,
    start_step: usize,
    num_steps: usize,
    a_impulse_steps: Vec<usize>,
    a_impulse_x: Vec<f32>,
    a_impulse_y: Vec<f32>,
    a_impulse_z: Vec<f32>,
    l_impulse_steps: Vec<usize>,
    l_impulse_x: Vec<f32>,
    l_impulse_y: Vec<f32>,
    l_impulse_z: Vec<f32>,
    i_impulse_steps: Vec<usize>,
    i_impulse_x: Vec<f32>,
    i_impulse_y: Vec<f32>,
    i_impulse_z: Vec<f32>,
    v_impulse_steps: Vec<usize>,
    v_impulse_x: Vec<f32>,
    v_impulse_y: Vec<f32>,
    v_impulse_z: Vec<f32>,
    e_impulse_steps: Vec<usize>,
    e_impulse_x: Vec<f32>,
    e_impulse_y: Vec<f32>,
    e_impulse_z: Vec<f32>,
) -> Vec<u8> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    if let Some(physics_state) = serialized_physics {
        set_physics_state_impl(physics_state, start_step);
    }
    let mut physics = PHYSICS.write().unwrap();
    advance_physics(
        &mut physics,
        num_steps,
        &a_impulse_steps[..],
        &a_impulse_x[..],
        &a_impulse_y[..],
        &a_impulse_z[..],
        &l_impulse_steps[..],
        &l_impulse_x[..],
        &l_impulse_y[..],
        &l_impulse_z[..],
        &i_impulse_steps[..],
        &i_impulse_x[..],
        &i_impulse_y[..],
        &i_impulse_z[..],
        &v_impulse_steps[..],
        &v_impulse_x[..],
        &v_impulse_y[..],
        &v_impulse_z[..],
        &e_impulse_steps[..],
        &e_impulse_x[..],
        &e_impulse_y[..],
        &e_impulse_z[..],
    );
    let data = bincode::serialize(&physics.state).unwrap();
    compress(data)
}

#[wasm_bindgen]
pub fn set_physics_state(serialized_physics: Option<Vec<u8>>, step: usize) {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    if let Some(state) = serialized_physics {
        set_physics_state_impl(state, step);
    } else {
        let mut physics = PHYSICS.write().unwrap();
        physics.step = step;
    }
}

fn set_physics_state_impl(serialized_physics: Vec<u8>, step: usize) {
    let mut physics = PHYSICS.write().unwrap();
    physics.state =
        bincode::deserialize(&decompress(serialized_physics)).expect("Receieved bad physics data");
    physics.step = step;
}

#[wasm_bindgen]
pub fn get_physics_cache_step() -> usize {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let physics = PHYSICS.read().unwrap();
    physics.step
}

#[wasm_bindgen]
pub fn positions_for_step(
    target_step: usize,
    a_impulse_steps: Vec<usize>,
    a_impulse_x: Vec<f32>,
    a_impulse_y: Vec<f32>,
    a_impulse_z: Vec<f32>,
    l_impulse_steps: Vec<usize>,
    l_impulse_x: Vec<f32>,
    l_impulse_y: Vec<f32>,
    l_impulse_z: Vec<f32>,
    i_impulse_steps: Vec<usize>,
    i_impulse_x: Vec<f32>,
    i_impulse_y: Vec<f32>,
    i_impulse_z: Vec<f32>,
    v_impulse_steps: Vec<usize>,
    v_impulse_x: Vec<f32>,
    v_impulse_y: Vec<f32>,
    v_impulse_z: Vec<f32>,
    e_impulse_steps: Vec<usize>,
    e_impulse_x: Vec<f32>,
    e_impulse_y: Vec<f32>,
    e_impulse_z: Vec<f32>,
) -> Option<Vec<f32>> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let mut physics_cache = PHYSICS.write().unwrap();
    if target_step <= physics_cache.step {
        console_log!(
            "Attempted to run physics to target {} but cache is already at {}",
            target_step,
            physics_cache.step
        );
        return None;
    }
    let steps_to_target = target_step - physics_cache.step;
    let max_steps = MAX_RENDERED_PHYSICS_STEPS.clone();
    let advance_cache_by = if steps_to_target > max_steps {
        steps_to_target - max_steps
    } else {
        0
    };
    if advance_cache_by > 0 {
        advance_physics(
            &mut physics_cache,
            advance_cache_by,
            slice_until(&a_impulse_steps, advance_cache_by),
            slice_until(&a_impulse_x, advance_cache_by),
            slice_until(&a_impulse_y, advance_cache_by),
            slice_until(&a_impulse_z, advance_cache_by),
            slice_until(&l_impulse_steps, advance_cache_by),
            slice_until(&l_impulse_x, advance_cache_by),
            slice_until(&l_impulse_y, advance_cache_by),
            slice_until(&l_impulse_z, advance_cache_by),
            slice_until(&i_impulse_steps, advance_cache_by),
            slice_until(&i_impulse_x, advance_cache_by),
            slice_until(&i_impulse_y, advance_cache_by),
            slice_until(&i_impulse_z, advance_cache_by),
            slice_until(&v_impulse_steps, advance_cache_by),
            slice_until(&v_impulse_x, advance_cache_by),
            slice_until(&v_impulse_y, advance_cache_by),
            slice_until(&v_impulse_z, advance_cache_by),
            slice_until(&e_impulse_steps, advance_cache_by),
            slice_until(&e_impulse_x, advance_cache_by),
            slice_until(&e_impulse_y, advance_cache_by),
            slice_until(&e_impulse_z, advance_cache_by),
        );
    }
    let advance_window_by = steps_to_target - advance_cache_by;
    // console_log!(
    //     "PH: {} (behind {}) (cache +{}, render {}, cache: {}). A: {}, {}",
    //     target_step,
    //     steps_to_target,
    //     advance_cache_by,
    //     advance_window_by,
    //     physics_cache.step,
    //     slice_until(&a_impulse_steps, advance_cache_by).len(),
    //     slice_from(&a_impulse_steps, advance_cache_by).len()
    // );
    let mut serialized_data: Vec<f32> = vec![];
    let mut windowed_physics = physics_cache.copy();
    advance_physics(
        &mut windowed_physics,
        advance_window_by,
        slice_from(&a_impulse_steps, advance_cache_by),
        slice_from(&a_impulse_x, advance_cache_by),
        slice_from(&a_impulse_y, advance_cache_by),
        slice_from(&a_impulse_z, advance_cache_by),
        slice_from(&l_impulse_steps, advance_cache_by),
        slice_from(&l_impulse_x, advance_cache_by),
        slice_from(&l_impulse_y, advance_cache_by),
        slice_from(&l_impulse_z, advance_cache_by),
        slice_from(&i_impulse_steps, advance_cache_by),
        slice_from(&i_impulse_x, advance_cache_by),
        slice_from(&i_impulse_y, advance_cache_by),
        slice_from(&i_impulse_z, advance_cache_by),
        slice_from(&v_impulse_steps, advance_cache_by),
        slice_from(&v_impulse_x, advance_cache_by),
        slice_from(&v_impulse_y, advance_cache_by),
        slice_from(&v_impulse_z, advance_cache_by),
        slice_from(&e_impulse_steps, advance_cache_by),
        slice_from(&e_impulse_x, advance_cache_by),
        slice_from(&e_impulse_y, advance_cache_by),
        slice_from(&e_impulse_z, advance_cache_by),
    );
    add_data_for_letter(&windowed_physics.state, Letter::A, &mut serialized_data);
    add_data_for_letter(&windowed_physics.state, Letter::L, &mut serialized_data);
    add_data_for_letter(&windowed_physics.state, Letter::I, &mut serialized_data);
    add_data_for_letter(&windowed_physics.state, Letter::V, &mut serialized_data);
    add_data_for_letter(&windowed_physics.state, Letter::E, &mut serialized_data);
    Some(serialized_data)
}

fn add_data_for_letter(state: &PhysicsState, letter: Letter, data: &mut Vec<f32>) {
    let (translation, rotation) = get_position(&state, letter);
    data.append(&mut vec![translation[0], translation[1], translation[2]]);
    data.append(&mut vec![
        rotation[0],
        rotation[1],
        rotation[2],
        rotation[3],
    ]);
}

fn advance_physics(
    physics: &mut Physics,
    num_steps: usize,
    a_impulse_steps: &[usize],
    a_impulse_x: &[f32],
    a_impulse_y: &[f32],
    a_impulse_z: &[f32],
    l_impulse_steps: &[usize],
    l_impulse_x: &[f32],
    l_impulse_y: &[f32],
    l_impulse_z: &[f32],
    i_impulse_steps: &[usize],
    i_impulse_x: &[f32],
    i_impulse_y: &[f32],
    i_impulse_z: &[f32],
    v_impulse_steps: &[usize],
    v_impulse_x: &[f32],
    v_impulse_y: &[f32],
    v_impulse_z: &[f32],
    e_impulse_steps: &[usize],
    e_impulse_x: &[f32],
    e_impulse_y: &[f32],
    e_impulse_z: &[f32],
) {
    let mut impulses = HashMap::new();
    add_impulses(
        &mut impulses,
        Letter::A,
        a_impulse_steps,
        a_impulse_x,
        a_impulse_y,
        a_impulse_z,
    );
    add_impulses(
        &mut impulses,
        Letter::L,
        l_impulse_steps,
        l_impulse_x,
        l_impulse_y,
        l_impulse_z,
    );
    add_impulses(
        &mut impulses,
        Letter::I,
        i_impulse_steps,
        i_impulse_x,
        i_impulse_y,
        i_impulse_z,
    );
    add_impulses(
        &mut impulses,
        Letter::V,
        v_impulse_steps,
        v_impulse_x,
        v_impulse_y,
        v_impulse_z,
    );
    add_impulses(
        &mut impulses,
        Letter::E,
        e_impulse_steps,
        e_impulse_x,
        e_impulse_y,
        e_impulse_z,
    );
    let current_step = physics.step;
    physics::advance_physics(&mut physics.state, current_step, num_steps, impulses);
    physics.step = current_step + num_steps;
}

fn add_impulses(
    impulses: &mut HashMap<usize, Vec<Impulse>>,
    letter: Letter,
    steps: &[usize],
    x_vals: &[f32],
    y_vals: &[f32],
    z_vals: &[f32],
) {
    for (num, step) in steps.iter().enumerate() {
        let step_impulses = match impulses.get_mut(step) {
            Some(arr) => arr,
            _ => {
                impulses.insert(*step, vec![]);
                impulses.get_mut(step).unwrap()
            }
        };
        step_impulses.push(Impulse {
            letter,
            point: point![x_vals[num], y_vals[num], z_vals[num]],
        })
    }
}

fn compress(data: Vec<u8>) -> Vec<u8> {
    let mut encoder = DeflateEncoder::new(Vec::new(), Compression::best());
    encoder.write_all(&data).expect("Writing failed");
    encoder.finish().expect("Encoding failed")
}
fn decompress(data: Vec<u8>) -> Vec<u8> {
    let mut decoder = DeflateDecoder::new(&data[..]);
    let mut out = vec![];
    decoder.read_to_end(&mut out).expect("Decoding failed");
    out
}

fn slice_until<T>(vec: &Vec<T>, index: usize) -> &[T] {
    if index < vec.len() {
        return &vec[..index];
    }
    return &vec[..];
}
fn slice_from<T>(vec: &Vec<T>, index: usize) -> &[T] {
    if index < vec.len() {
        return &vec[index..];
    }
    return &vec[0..0];
}
