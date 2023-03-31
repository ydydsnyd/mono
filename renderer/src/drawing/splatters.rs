use std::collections::HashMap;

use crate::{COLOR_PALATE_RS, SPLATTER_ANIM_FRAMES};

use super::data;
use base64::prelude::*;
use image::{
    imageops::{rotate180, rotate270, rotate90},
    DynamicImage, ImageBuffer, ImageFormat, Pixel, Rgb, Rgba,
};
extern crate lazy_static;

pub fn precompute() {
    _ = SPLATTER_0;
    _ = SPLATTER_1;
    _ = SPLATTER_2;
    _ = SPLATTER_3;
}

pub struct SplatterImages {
    pub i_0: DynamicImage,
    pub i_1: DynamicImage,
    pub i_2: DynamicImage,
    pub i_3: DynamicImage,
}

impl SplatterImages {
    pub fn to_arr(&self) -> [&DynamicImage; 4] {
        return [&self.i_0, &self.i_1, &self.i_2, &self.i_3];
    }
}

pub struct SplatterFrames {
    pub color_index: u8,
    pub r_0: [ImageBuffer<Rgba<u8>, Vec<u8>>; 4],
    pub l_0: [ImageBuffer<Rgba<u8>, Vec<u8>>; 4],
    pub r_90: [ImageBuffer<Rgba<u8>, Vec<u8>>; 4],
    pub l_90: [ImageBuffer<Rgba<u8>, Vec<u8>>; 4],
    pub r_180: [ImageBuffer<Rgba<u8>, Vec<u8>>; 4],
    pub l_180: [ImageBuffer<Rgba<u8>, Vec<u8>>; 4],
    pub r_270: [ImageBuffer<Rgba<u8>, Vec<u8>>; 4],
    pub l_270: [ImageBuffer<Rgba<u8>, Vec<u8>>; 4],
}

pub struct Splatter {
    frames: HashMap<usize, SplatterFrames>,
}

pub enum SplatterSize {
    Regular = 0,
    Large = 1,
}

fn get_frames(
    splatter_num: u8,
    rotation: u8,
    size: SplatterSize,
    color_index: u8,
) -> [ImageBuffer<Rgba<u8>, Vec<u8>>; 4] {
    let total_frames = SPLATTER_ANIM_FRAMES.clone();
    let dynamic_images: [&DynamicImage; 4] = match splatter_num {
        1 => IMAGES_0.to_arr(),
        2 => IMAGES_1.to_arr(),
        3 => IMAGES_2.to_arr(),
        _ => IMAGES_3.to_arr(),
    };
    dynamic_images.map(|f| match rotation {
        1 => DynamicImage::ImageRgba8(rotate90(f)),
        2 => DynamicImage::ImageRgba8(rotate180(f)),
        3 => DynamicImage::ImageRgba8(rotate270(f)),
        _ => DynamicImage::ImageRgba8(f.to_rgba8()),
    });
    // .map(|f| match size {
    //     SplatterSize::Regular => f,
    //     SplatterSize::Large => f.resize(400, 400, imageops::FilterType::Nearest),
    // });
    let mut colored_images = vec![];
    for (frame, img) in dynamic_images.iter().enumerate() {
        let mut splatter_colored = img.to_rgba8();
        let (end_color, start_color) = colors_at_idx(color_index);
        let mut end_color_alpha = end_color.to_rgba();
        end_color_alpha[3] = ((frame as f32 / total_frames as f32) * 255.0).floor() as u8;
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
        colored_images.push(splatter_colored);
    }
    [
        colored_images.remove(0),
        colored_images.remove(0),
        colored_images.remove(0),
        colored_images.remove(0),
    ]
}

impl Splatter {
    pub fn num(num: u8) -> Splatter {
        let num_colors = COLOR_PALATE_RS.len() / 6;
        let mut frames = HashMap::new();
        for color_index in 0..num_colors {
            frames.insert(
                color_index,
                SplatterFrames {
                    color_index: color_index as u8,
                    r_0: get_frames(num, 0, SplatterSize::Regular, color_index as u8),
                    l_0: get_frames(num, 0, SplatterSize::Large, color_index as u8),
                    r_90: get_frames(num, 1, SplatterSize::Regular, color_index as u8),
                    l_90: get_frames(num, 1, SplatterSize::Large, color_index as u8),
                    r_180: get_frames(num, 2, SplatterSize::Regular, color_index as u8),
                    l_180: get_frames(num, 2, SplatterSize::Large, color_index as u8),
                    r_270: get_frames(num, 3, SplatterSize::Regular, color_index as u8),
                    l_270: get_frames(num, 3, SplatterSize::Large, color_index as u8),
                },
            );
        }
        Splatter { frames }
    }
    pub fn at(&self, x: f32, y: f32, size: &SplatterSize) -> (i64, i64) {
        let half = match size {
            SplatterSize::Regular => 120.0,
            SplatterSize::Large => 200.0,
        };
        ((x - half).floor() as i64, (y - half).floor() as i64)
    }
    pub fn frame(
        &self,
        frame: usize,
        rotation: u8,
        color_index: u8,
        size: &SplatterSize,
    ) -> &ImageBuffer<Rgba<u8>, Vec<u8>> {
        let color_index_usize = &(color_index as usize);
        let frames = match rotation {
            1 => match size {
                SplatterSize::Regular => &self.frames[color_index_usize].r_90,
                SplatterSize::Large => &self.frames[color_index_usize].l_90,
            },
            2 => match size {
                SplatterSize::Regular => &self.frames[color_index_usize].r_180,
                SplatterSize::Large => &self.frames[color_index_usize].l_180,
            },
            3 => match size {
                SplatterSize::Regular => &self.frames[color_index_usize].r_270,
                SplatterSize::Large => &self.frames[color_index_usize].l_270,
            },
            _ => match size {
                SplatterSize::Regular => &self.frames[color_index_usize].r_0,
                SplatterSize::Large => &self.frames[color_index_usize].l_0,
            },
        };
        if let Some(img) = frames.get(frame) {
            img
        } else {
            frames.last().unwrap()
        }
    }
}

fn image_from_str(string: &str) -> DynamicImage {
    let data = BASE64_STANDARD_NO_PAD
        .decode(string)
        .expect("Bad splatter image");
    image::load_from_memory_with_format(&data, ImageFormat::Png).unwrap()
}

pub fn for_index(
    index: usize,
    frame: usize,
    rotation: u8,
    color_index: u8,
    size: SplatterSize,
    x: f32,
    y: f32,
) -> (&'static ImageBuffer<Rgba<u8>, Vec<u8>>, (i64, i64)) {
    match index {
        1 => (
            SPLATTER_1.frame(frame, rotation, color_index, &size),
            SPLATTER_1.at(x, y, &size),
        ),
        2 => (
            SPLATTER_2.frame(frame, rotation, color_index, &size),
            SPLATTER_2.at(x, y, &size),
        ),
        3 => (
            SPLATTER_3.frame(frame, rotation, color_index, &size),
            SPLATTER_3.at(x, y, &size),
        ),
        _ => (
            SPLATTER_0.frame(frame, rotation, color_index, &size),
            SPLATTER_0.at(x, y, &size),
        ),
    }
}

lazy_static! {
    pub static ref SPLATTER_0: Splatter = Splatter::num(0);
    pub static ref SPLATTER_1: Splatter = Splatter::num(1);
    pub static ref SPLATTER_2: Splatter = Splatter::num(2);
    pub static ref SPLATTER_3: Splatter = Splatter::num(3);
    pub static ref IMAGES_0: SplatterImages = SplatterImages {
        i_0: image_from_str(&data::SPLATTER_0_DATA[0]),
        i_1: image_from_str(&data::SPLATTER_0_DATA[1]),
        i_2: image_from_str(&data::SPLATTER_0_DATA[2]),
        i_3: image_from_str(&data::SPLATTER_0_DATA[3])
    };
    pub static ref IMAGES_1: SplatterImages = SplatterImages {
        i_0: image_from_str(&data::SPLATTER_1_DATA[0]),
        i_1: image_from_str(&data::SPLATTER_1_DATA[1]),
        i_2: image_from_str(&data::SPLATTER_1_DATA[2]),
        i_3: image_from_str(&data::SPLATTER_1_DATA[3])
    };
    pub static ref IMAGES_2: SplatterImages = SplatterImages {
        i_0: image_from_str(&data::SPLATTER_2_DATA[0]),
        i_1: image_from_str(&data::SPLATTER_2_DATA[1]),
        i_2: image_from_str(&data::SPLATTER_2_DATA[2]),
        i_3: image_from_str(&data::SPLATTER_2_DATA[3])
    };
    pub static ref IMAGES_3: SplatterImages = SplatterImages {
        i_0: image_from_str(&data::SPLATTER_3_DATA[0]),
        i_1: image_from_str(&data::SPLATTER_3_DATA[1]),
        i_2: image_from_str(&data::SPLATTER_3_DATA[2]),
        i_3: image_from_str(&data::SPLATTER_3_DATA[3])
    };
}

fn colors_at_idx(idx: u8) -> (Rgb<u8>, Rgb<u8>) {
    let start_idx = idx as usize * 6;
    let colors: &[u8] = &COLOR_PALATE_RS[start_idx..start_idx + 6];
    return (
        Rgb([colors[0], colors[1], colors[2]]),
        Rgb([colors[3], colors[4], colors[5]]),
    );
}
