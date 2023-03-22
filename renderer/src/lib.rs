#[macro_use]
extern crate lazy_static;
extern crate console_error_panic_hook;

mod drawing;

use image::{ImageFormat, RgbaImage};
use mut_static::MutStatic;
use std::{io::Cursor, panic};
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
    static COLOR_PALATE_RS: Vec<u8>;
    static UVMAP_SIZE: u32;
    static SPLATTER_ANIM_FRAMES: u8;
    static RENDERED_PHYSICS_STEP_WINDOW_SIZE: usize;
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

// Persistence - this is where we actually allocate the structs

lazy_static! {
    pub static ref CACHES: MutStatic<Caches> = MutStatic::from(Caches::new());
}

// API - this is our "public" JS API:

// Some animations are lazily computed. This just makes them eagerly evaluate so
// we don't have random cost during animations.
#[wasm_bindgen]
pub fn precompute() {
    drawing::precompute();
}

// Write a png to the cache for a given letter
#[wasm_bindgen]
pub fn update_cache(letter: Letter, png_data: Vec<u8>) {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let img =
        image::load_from_memory_with_format(&png_data, ImageFormat::Png).unwrap_or_else(|e| {
            panic!(
                "Image cache appears to be corrupted. Error: {}",
                e.to_string()
            );
        });
    let pixels = img.as_rgba8().unwrap().to_vec();
    let mut caches = CACHES.write().unwrap();
    caches.set_data(&letter, pixels);
}

// Update caches by copying from a client context
#[wasm_bindgen]
pub fn overwrite_caches(
    ctx_a: &CanvasRenderingContext2d,
    ctx_l: &CanvasRenderingContext2d,
    ctx_i: &CanvasRenderingContext2d,
    ctx_v: &CanvasRenderingContext2d,
    ctx_e: &CanvasRenderingContext2d,
) {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    overwrite_cache(Letter::A, ctx_a);
    overwrite_cache(Letter::L, ctx_l);
    overwrite_cache(Letter::I, ctx_i);
    overwrite_cache(Letter::V, ctx_v);
    overwrite_cache(Letter::E, ctx_e);
}
fn overwrite_cache(letter: Letter, ctx: &CanvasRenderingContext2d) {
    let width = UVMAP_SIZE.clone() as f64;
    let height = UVMAP_SIZE.clone() as f64;
    let img_data = ctx
        .get_image_data(0.0, 0.0, width, height)
        .expect("Failed reading image data when overwriting cache");
    let mut caches = CACHES.write().unwrap();
    caches.set_data(&letter, img_data.data().to_vec());
}

// Draw our current caches to the given contexts
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
    context.clear_rect(0.0, 0.0, width as f64, height as f64);
    context
        .put_image_data(&data, 0.0, 0.0)
        .expect("Writing to canvas failed");
}

// Render a pixel map to a png, for use on the server side when creating
// compressed "base" images. This isn't efficient enough to use in client-side
// wasm code, but produces a much smaller output than the client code, which is
// appropriate for storing.
#[wasm_bindgen]
pub fn draw_cache_png(
    png_data: Option<Vec<u8>>,
    splatter_count: usize,
    splatter_frames: Vec<usize>,
    splatter_actors: Vec<u32>,
    colors: Vec<u8>,
    sizes: Vec<u8>,
    x_vals: Vec<f32>,
    y_vals: Vec<f32>,
    splatter_animations: Vec<u8>,
    splatter_rotations: Vec<u8>,
) -> Vec<u8> {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let width = UVMAP_SIZE.clone();
    let height = UVMAP_SIZE.clone();
    let mut img: RgbaImage;
    if let Some(data) = png_data {
        img = image::load_from_memory_with_format(&data, ImageFormat::Png)
            .unwrap_or_else(|e| {
                panic!(
                    "draw_cache_png received bad image data. Error: {}",
                    e.to_string()
                );
            })
            .to_rgba8();
    } else {
        img = RgbaImage::new(width, height);
    }
    drawing::draw(
        &mut img,
        splatter_count,
        &splatter_frames,
        &splatter_actors,
        &colors,
        &sizes,
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
#[wasm_bindgen]
pub fn draw_buffer(
    letter: Letter,
    ctx: &CanvasRenderingContext2d,
    splatter_count: usize,
    splatter_frames: Vec<usize>,
    splatter_actors: Vec<u32>,
    colors: Vec<u8>,
    sizes: Vec<u8>,
    x_vals: Vec<f32>,
    y_vals: Vec<f32>,
    splatter_animations: Vec<u8>,
    splatter_rotations: Vec<u8>,
) {
    panic::set_hook(Box::new(console_error_panic_hook::hook));
    let width = UVMAP_SIZE.clone();
    let height = UVMAP_SIZE.clone();
    let mut caches = CACHES.write().unwrap();
    let cache = caches.get_data(&letter);
    let mut img: RgbaImage;
    if cache.len() == 0 {
        img = RgbaImage::new(width, height);
    } else {
        img = RgbaImage::from_vec(width, height, cache.to_vec()).expect("Bad image in caches");
    }
    drawing::draw(
        &mut img,
        splatter_count,
        &splatter_frames,
        &splatter_actors,
        &colors,
        &sizes,
        &x_vals,
        &y_vals,
        &splatter_animations,
        &splatter_rotations,
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
