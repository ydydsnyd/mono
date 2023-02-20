use super::data;
use base64::prelude::*;
use image::{DynamicImage, ImageFormat};
extern crate lazy_static;

pub struct Splatter {
    pub frames: [DynamicImage; 4],
    pub size: f32,
}

impl Splatter {
    pub fn from(strings: [&'static str; 4]) -> Splatter {
        Splatter {
            frames: [
                image_from_str(&strings[0]),
                image_from_str(&strings[1]),
                image_from_str(&strings[2]),
                image_from_str(&strings[3]),
            ],
            size: 240.0,
        }
    }
    pub fn at(&self, x: f32, y: f32) -> (i64, i64) {
        let half = self.size / 2.0;
        ((x - half).floor() as i64, (y - half).floor() as i64)
    }
    pub fn frame(&self, frame: usize) -> &DynamicImage {
        if let Some(img) = self.frames.get(frame) {
            img
        } else {
            self.frames.last().unwrap()
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
    x: f32,
    y: f32,
) -> (&'static DynamicImage, (i64, i64), i64) {
    match index {
        1 => (
            SPLATTER_1.frame(frame),
            SPLATTER_1.at(x, y),
            SPLATTER_1.size as i64,
        ),
        2 => (
            SPLATTER_2.frame(frame),
            SPLATTER_2.at(x, y),
            SPLATTER_2.size as i64,
        ),
        3 => (
            SPLATTER_3.frame(frame),
            SPLATTER_3.at(x, y),
            SPLATTER_3.size as i64,
        ),
        4 => (
            SPLATTER_4.frame(frame),
            SPLATTER_4.at(x, y),
            SPLATTER_4.size as i64,
        ),
        _ => (
            SPLATTER_0.frame(frame),
            SPLATTER_0.at(x, y),
            SPLATTER_0.size as i64,
        ),
    }
}

lazy_static! {
    pub static ref SPLATTER_0: Splatter = Splatter::from(data::SPLATTER_0_DATA);
    pub static ref SPLATTER_1: Splatter = Splatter::from(data::SPLATTER_1_DATA);
    pub static ref SPLATTER_2: Splatter = Splatter::from(data::SPLATTER_2_DATA);
    pub static ref SPLATTER_3: Splatter = Splatter::from(data::SPLATTER_3_DATA);
    pub static ref SPLATTER_4: Splatter = Splatter::from(data::SPLATTER_4_DATA);
}
