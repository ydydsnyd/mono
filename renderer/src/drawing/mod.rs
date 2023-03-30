use image::{imageops, RgbaImage};

mod data;
pub mod splatters;

#[allow(unused_imports)]
use crate::console_log;

use self::splatters::SplatterSize;

pub fn precompute() {
    splatters::precompute();
}

pub fn draw(
    image: &mut RgbaImage,
    splatter_count: usize,
    splatter_frames: &[usize],
    splatter_actors: &[u32],
    colors: &[u8],
    sizes: &[u8],
    x_vals: &[f32],
    y_vals: &[f32],
    splatter_animations: &[u8],
    splatter_rotations: &[u8],
) {
    assert_eq!(splatter_count, splatter_actors.len());
    assert_eq!(splatter_count, x_vals.len());
    assert_eq!(splatter_count, y_vals.len());
    assert_eq!(splatter_count, splatter_animations.len());
    assert_eq!(splatter_count, splatter_rotations.len());
    if splatter_count == 0 {
        return;
    }
    let width = image.width() as f32;
    let height = image.height() as f32;

    // Draw our splatters
    for idx in 0..splatter_count {
        let x = x_vals[idx] * width;
        let y = y_vals[idx] * height;
        let anim_frame = splatter_frames[idx];

        let anim_index = splatter_animations[idx] as usize;
        let (splatter_image, (sx, sy)) = splatters::for_index(
            anim_index,
            anim_frame,
            splatter_rotations[idx],
            colors[idx],
            match sizes[idx] {
                1 => SplatterSize::Large,
                _ => SplatterSize::Regular,
            },
            x,
            y,
        );
        imageops::overlay(image, splatter_image, sx, sy);
    }
}
