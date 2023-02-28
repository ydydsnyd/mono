#[macro_use]
extern crate lazy_static;
use std::{env, fs::create_dir, path::Path};

pub static SPLATTER_ANIM_FRAMES: u8 = 8;

mod drawing;

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
        let (splatter, (_, _)) = drawing::splatters::for_index(idx, frame, 0, 0.0, 0.0);
        let img_path = path.join(format!("{}-{}.png", idx, frame));
        println!("Rendering {}-{}", idx, frame);
        image::save_buffer_with_format(
            img_path,
            &splatter.to_rgba8().to_vec(),
            240,
            240,
            image::ColorType::Rgba8,
            image::ImageFormat::Png,
        )
        .expect("Writing failed");
    }
}
