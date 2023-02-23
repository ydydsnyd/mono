use super::data;
use base64::prelude::*;
use image::{
    imageops::{rotate180, rotate270, rotate90},
    DynamicImage, ImageFormat,
};
extern crate lazy_static;

pub fn precompute() {
    _ = SPLATTER_0;
    _ = SPLATTER_1;
    _ = SPLATTER_2;
    _ = SPLATTER_3;
    _ = SPLATTER_4;
}

pub struct Splatter {
    pub frames_0: [DynamicImage; 4],
    pub frames_90: [DynamicImage; 4],
    pub frames_180: [DynamicImage; 4],
    pub frames_270: [DynamicImage; 4],
}

fn get_frames(strings: [&'static str; 4], rotation: u8) -> [DynamicImage; 4] {
    [
        image_from_str(&strings[0]),
        image_from_str(&strings[1]),
        image_from_str(&strings[2]),
        image_from_str(&strings[3]),
    ]
    .map(|f| match rotation {
        1 => DynamicImage::ImageRgba8(rotate90(&f)),
        2 => DynamicImage::ImageRgba8(rotate180(&f)),
        3 => DynamicImage::ImageRgba8(rotate270(&f)),
        _ => f,
    })
}

impl Splatter {
    pub fn from(strings: [&'static str; 4]) -> Splatter {
        Splatter {
            frames_0: get_frames(strings, 0),
            frames_90: get_frames(strings, 1),
            frames_180: get_frames(strings, 2),
            frames_270: get_frames(strings, 3),
        }
    }
    pub fn at(&self, x: f32, y: f32) -> (i64, i64) {
        // NOTE: all splatters are 240 px, if this changes then remove the hardcode.
        let half = 120.0;
        ((x - half).floor() as i64, (y - half).floor() as i64)
    }
    pub fn frame(&self, frame: usize, rotation: u8) -> &DynamicImage {
        let frames = match rotation {
            1 => &self.frames_90,
            2 => &self.frames_180,
            3 => &self.frames_270,
            _ => &self.frames_0,
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
    x: f32,
    y: f32,
) -> (&'static DynamicImage, (i64, i64)) {
    match index {
        1 => (SPLATTER_1.frame(frame, rotation), SPLATTER_1.at(x, y)),
        2 => (SPLATTER_2.frame(frame, rotation), SPLATTER_2.at(x, y)),
        3 => (SPLATTER_3.frame(frame, rotation), SPLATTER_3.at(x, y)),
        4 => (SPLATTER_4.frame(frame, rotation), SPLATTER_4.at(x, y)),
        _ => (SPLATTER_0.frame(frame, rotation), SPLATTER_0.at(x, y)),
    }
}

lazy_static! {
    pub static ref SPLATTER_0: Splatter = Splatter::from(data::SPLATTER_0_DATA);
    pub static ref SPLATTER_1: Splatter = Splatter::from(data::SPLATTER_1_DATA);
    pub static ref SPLATTER_2: Splatter = Splatter::from(data::SPLATTER_2_DATA);
    pub static ref SPLATTER_3: Splatter = Splatter::from(data::SPLATTER_3_DATA);
    pub static ref SPLATTER_4: Splatter = Splatter::from(data::SPLATTER_4_DATA);
}
