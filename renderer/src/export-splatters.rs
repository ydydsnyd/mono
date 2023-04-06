#[macro_use]
extern crate lazy_static;
use std::{env, fs::create_dir, path::Path};

mod drawing;
pub static SPLATTER_ANIM_FRAMES: u8 = 8;

#[macro_export]
macro_rules! console_log {
    ($($t:tt)*) => (println!("{}", &format_args!($($t)*).to_string()))
}

pub fn main() {
    let out_dir = env::current_dir().unwrap().join("target/splatters");
    if !out_dir.exists() {
        create_dir(&out_dir).expect("Failed creating dir");
    }
    render_splatter_to_file(0, &out_dir);
    render_splatter_to_file(1, &out_dir);
    render_splatter_to_file(2, &out_dir);
    render_splatter_to_file(3, &out_dir);
}

fn render_splatter_to_file(idx: usize, path: &Path) {
    for frame in 0..8 {
        let (splatter, (_, _)) = drawing::splatters::for_index(
            idx,
            frame,
            drawing::splatters::SplatterSize::Regular,
            0.0,
            0.0,
        );
        println!("Rendering {}-{}@240", idx, frame);
        image::save_buffer_with_format(
            path.join(format!("{}-{}@240.png", idx, frame)),
            &splatter.to_vec(),
            240,
            240,
            image::ColorType::Rgba8,
            image::ImageFormat::Png,
        )
        .expect("Writing failed");
    }
}
