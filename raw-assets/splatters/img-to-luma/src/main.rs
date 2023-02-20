use base64::prelude::*;
use std::{env, fs};

use image::{io::Reader, ImageFormat};

fn main() {
    // file path provided by user
    let input = env::args().nth(1).unwrap();

    let paths = fs::read_dir(input).expect("invalid input");
    let mut anim_no = 0;
    let mut b64_output: String = "".to_string();
    // let mut raw_output: String = "".to_string();
    // let mut images = (vec![], vec![], vec![], vec![]);
    for (idx, path) in paths.enumerate() {
        let image = Reader::open(path.unwrap().path())
            .expect("Bad image")
            .decode()
            .expect("Invalid image data");
        let luma = image.into_luma_alpha8();
        let mut png_data = std::io::Cursor::new(vec![]);
        luma.write_to(&mut png_data, ImageFormat::Png)
            .expect("Failed writing png data");

        if idx % 4 == 0 {
            b64_output = format!(
                "{}pub const SPLATTER_{}_DATA: [&'static str; 4] = [\n",
                b64_output, anim_no
            );
            anim_no += 1;
        }
        let encoded = BASE64_STANDARD_NO_PAD.encode(png_data.get_ref());
        b64_output = format!("{}\"{}\",\n", b64_output, encoded);
        if idx % 4 == 3 {
            b64_output += "];\n";
        }
        // match idx % 4 {
        //     0 => images.0 = png_data.get_ref().to_owned(),
        //     1 => images.1 = png_data.get_ref().to_owned(),
        //     2 => images.2 = png_data.get_ref().to_owned(),
        //     3 => images.3 = png_data.get_ref().to_owned(),
        //     _ => panic!("Not possible"),
        // }
        // if idx % 4 == 3 {
        //     anim_no += 1;
        //     raw_output = format!(
        //         "{}pub const SPLATTER_{}_DATA: ([u8; {}],[u8; {}],[u8; {}],[u8; {}]) = (\n[{:?}],\n[{:?}],\n[{:?}],\n[{:?}],\n);\n",
        //         raw_output, anim_no, images.0.len(), images.1.len(), images.2.len(), images.3.len(),
        //         images.0, images.1, images.2, images.3
        //     );
        // }
    }
    print!("{}", b64_output);
}
