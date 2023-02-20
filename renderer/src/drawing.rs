use image::{
    imageops::{self, rotate180, rotate270, rotate90},
    GenericImageView, Pixel, Rgb, RgbaImage,
};

mod data;
mod splatters;

#[allow(unused_imports)]
use crate::console_log;

#[derive(Clone, Debug)]
pub struct Rectangle {
    pub x0: u32,
    pub y0: u32,
    pub x1: u32,
    pub y1: u32,
}

impl Rectangle {
    #[allow(dead_code)]
    pub fn total_pixels(&self) -> u32 {
        (self.y1 - self.y0) * self.width()
    }
    pub fn width(&self) -> u32 {
        self.x1 - self.x0
    }
    pub fn pixel_range<T>(
        &self,
        pixels: Vec<T>,
        source_width: usize,
        indexes_per_pixel: u32,
    ) -> (Vec<T>, u32)
    where
        T: Copy,
    {
        // Get this rect from a list of pixels.
        let mut pixel_range: Vec<T> = vec![];
        let mut last_row = 0;
        // Loop over "rows" of pixels.
        for y_idx in self.y0..self.y1 {
            // Our offset for this row is the row index times the width, times the number of
            // indexes per pixel.
            let row = (y_idx * indexes_per_pixel) as usize * source_width;
            for x in self.x0 * indexes_per_pixel..self.x1 * indexes_per_pixel {
                // Then we need to add the x offset, which is just the offset of this row.
                let idx = row + x as usize;
                pixel_range.push(pixels[idx]);
            }
            last_row = y_idx;
        }
        assert!(
            pixel_range.len() % 4 == 0,
            "Invalid pixel range {}",
            pixel_range.len()
        );
        (pixel_range, last_row + 1 - self.y0)
    }
    fn zero() -> Rectangle {
        Rectangle {
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 0,
        }
    }
    fn from_circle(
        center_x: f32,
        center_y: f32,
        radius: f32,
        source_width: f32,
        source_height: f32,
    ) -> Rectangle {
        Rectangle {
            x0: (center_x - radius / 2.0).min(0.0) as u32,
            y0: (center_y - radius / 2.0).min(0.0) as u32,
            x1: (center_x + radius / 2.0).max(source_width) as u32,
            y1: (center_y + radius / 2.0).max(source_height) as u32,
        }
    }
    #[allow(dead_code)]
    fn from_line(
        start_x: f32,
        start_y: f32,
        end_x: f32,
        end_y: f32,
        size: f32,
        source_width: f32,
        source_height: f32,
    ) -> Rectangle {
        let rad = size as u32;
        let tx = if start_x < end_x { start_x } else { end_x } as u32;
        let ty = if start_y < end_y { start_y } else { end_y } as u32;
        let bx = if start_x > end_x { start_x } else { end_x } as u32;
        let by = if start_y > end_y { start_y } else { end_y } as u32;
        println!("{}, {}, {}", bx, by, rad);
        Rectangle {
            x0: tx - rad.min(tx),
            y0: ty - rad.min(ty),
            x1: (bx + rad).min(source_width as u32),
            y1: (by + rad).min(source_height as u32),
        }
    }
    fn containing(rects: &Vec<Rectangle>) -> Rectangle {
        let mut outer = rects[0].to_owned();
        for rect in &rects[1..] {
            outer.x0 = outer.x0.min(rect.x0);
            outer.y0 = outer.y0.min(rect.y0);
            outer.x1 = outer.x1.max(rect.x1);
            outer.y1 = outer.y1.max(rect.y1);
        }
        outer
    }
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
) -> Rectangle {
    assert_eq!(splatter_count, timestamps.len());
    assert_eq!(splatter_count, splatter_actors.len());
    assert_eq!(splatter_count, colors.len());
    assert_eq!(splatter_count, x_vals.len());
    assert_eq!(splatter_count, y_vals.len());
    assert_eq!(splatter_count, splatter_animations.len());
    assert_eq!(splatter_count, splatter_rotations.len());
    let mut changed_rects: Vec<Rectangle> = vec![];
    if splatter_count == 0 {
        return Rectangle::zero();
    }
    let width = image.width() as f32;
    let height = image.height() as f32;

    // Draw our splatters
    for idx in 0..splatter_count {
        let timestamp = timestamps[idx];
        let x = x_vals[idx] * width;
        let y = y_vals[idx] * height;

        // draw_filled_circle_mut(image, (x as i32, y as i32), 40, pixel);

        let anim_index = splatter_animations[idx] as usize;
        // Frames animate at ~30fps
        let anim_frame = ((time - timestamp) / 33.32).floor() as usize;
        let (splatter_image, (sx, sy), size) = splatters::for_index(anim_index, anim_frame, x, y);
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
            return Rectangle::zero();
        }
        let mut cropped_image = splatter_image
            .view(crop_x, crop_y, crop_w, crop_h)
            .to_image();
        if splatter_rotations[idx] == 1 {
            rotate90(&cropped_image);
        } else if splatter_rotations[idx] == 2 {
            rotate180(&cropped_image);
        } else if splatter_rotations[idx] == 2 {
            rotate270(&cropped_image);
        }
        let color = color_at_idx(
            colors[idx],
            &a_colors,
            &b_colors,
            &c_colors,
            &d_colors,
            &e_colors,
        );
        for pixel in cropped_image.pixels_mut() {
            let alpha = pixel[3];
            if alpha > 0 {
                pixel[0] = color[0];
                pixel[1] = color[1];
                pixel[2] = color[2];
            }
        }
        imageops::overlay(image, &cropped_image, sx, sy);

        // changed_rects.push(Rectangle::from_circle(x, y, 40.0, width, height));
    }
    let changed_rect = Rectangle {
        x0: 0,
        y0: 0,
        x1: width as u32,
        y1: height as u32,
    };
    // let changed_rect = Rectangle::containing(&changed_rects);

    // let tx = changed_rect.x0 as f32;
    // let ty = changed_rect.y0 as f32;
    // let bx = changed_rect.x1 as f32;
    // let by = changed_rect.y1 as f32;

    // draw_line_segment_mut(image, (tx, ty), (bx, ty), Rgba([254, 0, 0, 254]));
    // draw_line_segment_mut(image, (bx, ty), (bx, by), Rgba([254, 0, 0, 254]));
    // draw_line_segment_mut(image, (bx, by), (tx, by), Rgba([254, 0, 0, 254]));
    // draw_line_segment_mut(image, (tx, by), (tx, ty), Rgba([254, 0, 0, 254]));

    changed_rect
}

fn color_at_idx(
    idx: u8,
    a_colors: &[u8],
    b_colors: &[u8],
    c_colors: &[u8],
    d_colors: &[u8],
    e_colors: &[u8],
) -> Rgb<u8> {
    let colors = match idx {
        0 => a_colors,
        1 => b_colors,
        2 => c_colors,
        3 => d_colors,
        4 => e_colors,
        _ => a_colors,
    };
    return Rgb([colors[0], colors[1], colors[2]]);
}

#[cfg(test)]
mod tests {
    use super::Rectangle;

    #[test]
    fn total_pixels() {
        let rect = Rectangle {
            x0: 10,
            y0: 10,
            x1: 20,
            y1: 20,
        };
        assert_eq!(rect.total_pixels(), 100);
    }

    #[test]
    fn pixel_rect() {
        let rect = Rectangle {
            x0: 2,
            y0: 2,
            x1: 4,
            y1: 4,
        };
        let pixels = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
            47, 48, 49, 50,
        ];
        assert_eq!(
            rect.pixel_range(pixels.to_vec(), 6, 1),
            (vec![15, 16, 21, 22], 2)
        );
        // With an offset of 2
        assert_eq!(
            rect.pixel_range(pixels.to_vec(), 5, 2),
            (vec![25, 26, 27, 28, 35, 36, 37, 38], 2)
        );
    }

    #[test]
    fn rect_expansion() {
        let rect1 = Rectangle {
            x0: 0,
            y0: 0,
            x1: 29,
            y1: 32,
        };
        let rect2 = Rectangle {
            x0: 23,
            y0: 43,
            x1: 789,
            y1: 231,
        };
        let container = Rectangle::containing(&vec![rect1, rect2]);
        assert_eq!(container.x0, 0);
        assert_eq!(container.y0, 0);
        assert_eq!(container.x1, 789);
        assert_eq!(container.y1, 231);
    }
    #[test]
    fn rect_for_line() {
        let rect = Rectangle::from_line(0.0, 0.0, 89.0, 748.0, 40.0, 800.0, 800.0);
        assert_eq!(rect.x0, 0);
        assert_eq!(rect.y0, 0);
        assert_eq!(rect.x1, 129);
        assert_eq!(rect.y1, 788);
    }
    #[test]
    fn rect_for_line_overflow() {
        let rect = Rectangle::from_line(0.0, 0.0, 80.0, 80.0, 40.0, 80.0, 80.0);
        assert_eq!(rect.x0, 0);
        assert_eq!(rect.y0, 0);
        assert_eq!(rect.x1, 80);
        assert_eq!(rect.y1, 80);
    }
}
