use image::{GenericImageView, Rgba};
use image::{Pixel, Rgb, RgbaImage};

mod data;
pub mod splatters;

#[allow(unused_imports)]
use crate::console_log;
use crate::COLOR_PALATE_RS;
use crate::SPLATTER_ANIM_FRAMES;

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
    let total_frames = SPLATTER_ANIM_FRAMES.clone();

    // Draw our splatters
    for idx in 0..splatter_count {
        let x = x_vals[idx] * width;
        let y = y_vals[idx] * height;
        let anim_frame = splatter_frames[idx];

        let anim_index = splatter_animations[idx] as usize;
        let (splatter_image, (sx, sy)) = splatters::for_index(
            anim_index,
            anim_frame,
            match sizes[idx] {
                1 => SplatterSize::Large,
                _ => SplatterSize::Regular,
            },
            x,
            y,
        );
        let (end_color, start_color) = colors_at_idx(colors[idx]);
        let mut end_color_alpha = end_color.to_rgba();
        end_color_alpha[3] = ((anim_frame as f32 / total_frames as f32) * 255.0).floor() as u8;
        let mut color = start_color.to_rgba();
        color.blend(&end_color_alpha);
        let (s_width, s_height) = splatter_image.dimensions();
        for x in 0..s_width {
            for y in 0..s_height {
                let mut fx = x;
                let mut fy = y;
                if splatter_rotations[idx] == 1 {
                    // 90 degrees
                    let new_x = (s_height as u32) - fy - 1;
                    fy = fx;
                    fx = new_x;
                } else if splatter_rotations[idx] == 2 {
                    // 180 degrees
                    fx = (s_width as u32) - fx - 1;
                    fy = (s_height as u32) - fy - 1;
                } else if splatter_rotations[idx] == 3 {
                    // 270 degrees
                    let new_y = (s_width as u32) - fx - 1;
                    fx = fy;
                    fy = new_y;
                }
                let pixel = splatter_image.get_pixel(fx, fy);
                let alpha = pixel[3];
                let dx = sx as u32 + x;
                let dy = sy as u32 + y;
                if alpha > 0 && (dx as f32) < width && (dy as f32) < height {
                    let mut pixel = image.get_pixel(dx, dy).clone();
                    if pixel[3] > 0 {
                        pixel.blend(&Rgba::from([color[0], color[1], color[2], alpha]));
                    } else {
                        pixel = Rgba::from([color[0], color[1], color[2], alpha]);
                    }
                    image.put_pixel(dx, dy, pixel);
                }
            }
        }
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
