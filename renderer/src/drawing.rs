use image::{imageops, GenericImageView, Pixel, Rgb, RgbaImage};

mod data;
mod splatters;

#[allow(unused_imports)]
use crate::console_log;
use crate::SPLATTER_ANIM_FRAMES;

pub fn precompute() {
    splatters::precompute();
}

pub fn draw(
    image: &mut RgbaImage,
    time: f64,
    a_colors: &[u8],
    b_colors: &[u8],
    c_colors: &[u8],
    d_colors: &[u8],
    e_colors: &[u8],
    splatter_count: usize,
    timestamps: &[f64],
    splatter_actors: &[u32],
    colors: &[u8],
    x_vals: &[f32],
    y_vals: &[f32],
    splatter_animations: &[u8],
    splatter_rotations: &[u8],
) {
    assert_eq!(splatter_count, timestamps.len());
    assert_eq!(splatter_count, splatter_actors.len());
    assert_eq!(splatter_count, colors.len());
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
        let timestamp = timestamps[idx];
        let x = x_vals[idx] * width;
        let y = y_vals[idx] * height;

        // draw_filled_circle_mut(image, (x as i32, y as i32), 40, pixel);

        let anim_index = splatter_animations[idx] as usize;
        // Frames animate at ~30fps
        let anim_frame = ((time - timestamp) / 33.32).floor() as usize;
        if anim_frame > total_frames as usize {
            continue;
        }
        let (splatter_image, (sx, sy), size) =
            splatters::for_index(anim_index, anim_frame, splatter_rotations[idx], x, y);
        let crop_x = if sx < 0 { sx.abs() } else { 0 } as u32;
        let crop_y = if sy < 0 { sy.abs() } else { 0 } as u32;
        let crop_w = if sx < 0 {
            size + sx
        } else if size + sx > width as i64 {
            let extra = size + sx - (width as i64);
            (size - extra).max(0)
        } else {
            size
        } as u32;
        let crop_h = if sy < 0 {
            size + sy
        } else if size + sy > height as i64 {
            let extra = size + sy - (height as i64);
            (size - extra).max(0)
        } else {
            size
        } as u32;
        if crop_w == 0 && crop_h == 0 {
            continue;
        }
        let mut cropped_image = splatter_image
            .view(crop_x, crop_y, crop_w, crop_h)
            .to_image();
        let (end_color, start_color) = colors_at_idx(
            colors[idx],
            &a_colors,
            &b_colors,
            &c_colors,
            &d_colors,
            &e_colors,
        );
        let mut end_color_alpha = end_color.to_rgba();
        end_color_alpha[3] = ((anim_frame as f32 / total_frames as f32) * 255.0).floor() as u8;
        let mut color = start_color.to_rgba();
        color.blend(&end_color_alpha);
        for pixel in cropped_image.pixels_mut() {
            let alpha = pixel[3];
            if alpha > 0 {
                pixel[0] = color[0];
                pixel[1] = color[1];
                pixel[2] = color[2];
            }
        }
        imageops::overlay(image, &cropped_image, sx, sy);
    }
}

fn colors_at_idx(
    idx: u8,
    a_colors: &[u8],
    b_colors: &[u8],
    c_colors: &[u8],
    d_colors: &[u8],
    e_colors: &[u8],
) -> (Rgb<u8>, Rgb<u8>) {
    let colors = match idx {
        0 => a_colors,
        1 => b_colors,
        2 => c_colors,
        3 => d_colors,
        4 => e_colors,
        _ => a_colors,
    };
    return (
        Rgb([colors[0], colors[1], colors[2]]),
        Rgb([colors[3], colors[4], colors[5]]),
    );
}
