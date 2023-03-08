use image::{imageops, Pixel, Rgb, RgbaImage};

mod data;
pub mod splatters;

#[allow(unused_imports)]
use crate::console_log;
use crate::COLOR_PALATE_RS;
use crate::SPLATTER_ANIM_FRAMES;

pub fn precompute() {
    splatters::precompute();
}

pub fn draw(
    image: &mut RgbaImage,
    splatter_count: usize,
    splatter_frames: &[usize],
    splatter_actors: &[u32],
    colors: &[u8],
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
    let total_frames = SPLATTER_ANIM_FRAMES.clone();

    // Draw our splatters
    for idx in 0..splatter_count {
        let x = x_vals[idx] * width;
        let y = y_vals[idx] * height;
        let anim_frame = splatter_frames[idx];

        let anim_index = splatter_animations[idx] as usize;
        let (splatter_image, (sx, sy)) =
            splatters::for_index(anim_index, anim_frame, splatter_rotations[idx], x, y);
        let mut splatter_colored = splatter_image.to_rgba8();
        let (end_color, start_color) = colors_at_idx(colors[idx]);
        let mut end_color_alpha = end_color.to_rgba();
        end_color_alpha[3] = ((anim_frame as f32 / total_frames as f32) * 255.0).floor() as u8;
        let mut color = start_color.to_rgba();
        color.blend(&end_color_alpha);
        for pixel in splatter_colored.pixels_mut() {
            let alpha = pixel[3];
            if alpha > 0 {
                pixel[0] = color[0];
                pixel[1] = color[1];
                pixel[2] = color[2];
            }
        }
        imageops::overlay(image, &splatter_colored, sx, sy);
    }
}

fn colors_at_idx(idx: u8) -> (Rgb<u8>, Rgb<u8>) {
    let start_idx = idx as usize * 6;
    let colors: &[u8] = &COLOR_PALATE_RS[start_idx..start_idx + 6];
    return (
        Rgb([colors[0], colors[1], colors[2]]),
        Rgb([colors[3], colors[4], colors[5]]),
    );
}
