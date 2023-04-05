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
    // Destination image
    image: &mut RgbaImage,
    // Number of splatters to draw
    splatter_count: usize,
    // The frame within the animation of each splatter to draw
    splatter_frames: &[usize],
    // The actor who drew each splatter
    // Not used.
    splatter_actors: &[u32],
    // The color of each splatter
    colors: &[u8],
    // The size of each splatter
    sizes: &[u8],
    // The x position of each splatter on the canvas
    x_vals: &[f32],
    // The y position of each splatter on the canvas
    y_vals: &[f32],
    // The index of one of the four splatter animations to use for each splatter
    splatter_animations: &[u8],
    // The rotation of each splatter
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
                let dx = sx + x as i64;
                let dy = sy + y as i64;
                if alpha > 0 && dx > 0 && dy > 0 && (dx as f32) < width && (dy as f32) < height {
                    let mut pixel = image.get_pixel(dx as u32, dy as u32).clone();
                    if pixel[3] > 0 {
                        pixel.blend(&Rgba::from([color[0], color[1], color[2], alpha]));
                    } else {
                        pixel = Rgba::from([color[0], color[1], color[2], alpha]);
                    }
                    image.put_pixel(dx as u32, dy as u32, pixel);
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
