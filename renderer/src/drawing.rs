use image::{Rgba, RgbaImage};
use imageproc::{
    drawing::{draw_filled_circle_mut, draw_polygon_mut},
    point::Point,
};
use palette::{LinSrgb, Mix, Srgb};
use std::{collections::HashMap, collections::HashSet, f32::consts::PI, iter::FromIterator};

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
    point_count: usize,
    timestamps: &[f64],
    point_actors: &[u32],
    point_groups: &[u32],
    point_scales: &[f32],
    colors: &[u8],
    x_vals: &[f32],
    y_vals: &[f32],
    splatter_counts: &[usize],
    splatter_sizes: &[f32],
    splatter_x_vals: &[f32],
    splatter_y_vals: &[f32],
) -> Rectangle {
    assert_eq!(point_count, timestamps.len());
    assert_eq!(point_count, point_actors.len());
    assert_eq!(point_count, point_groups.len());
    assert_eq!(point_count, point_scales.len());
    assert_eq!(point_count, colors.len());
    assert_eq!(point_count, x_vals.len());
    assert_eq!(point_count, y_vals.len());
    assert_eq!(point_count, splatter_counts.len());
    let mut changed_rects: Vec<Rectangle> = vec![];
    if point_count == 0 {
        return Rectangle::zero();
    }
    let width = image.width() as f32;
    let height = image.height() as f32;
    // Our points are in "groups", which determine the order they are in - they may
    // have arrived in a different order though, so we need to reorder our point
    // indexes so that they are first sorted by group, then by insertion order.
    // So first, we build a set of unique groups and create a map of groups to their
    // (ordered) point indexes.
    let mut groups_set = HashSet::new();
    let mut group_points = HashMap::new();
    for point_num in 0..point_count {
        groups_set.insert(point_groups[point_num]);
        group_points
            .entry(point_groups[point_num])
            .and_modify(|points: &mut Vec<usize>| points.push(point_num))
            .or_insert(vec![point_num]);
    }
    // Then, we sort the groups
    let mut groups_ordered = Vec::from_iter(groups_set);
    groups_ordered.sort();
    // And then we iterate through the groups and append their points to a vector
    // that we'll use as a lookup table.
    let mut draw_indexes: Vec<usize> = vec![];
    let mut idx = 0;
    for group in groups_ordered {
        let points = group_points.get_mut(&group).unwrap();
        draw_indexes.append(points);
        idx = idx + points.len();
    }

    // We also have to build start/end indexes for splatters based on counts
    let mut splatter_start_idx = vec![0; point_count];
    let mut splatter_end_idx = vec![0; point_count];
    let mut current_start = 0;
    for point_num in 0..point_count {
        let splatter_count = splatter_counts[point_num];
        splatter_start_idx[point_num] = current_start;
        splatter_end_idx[point_num] = current_start + splatter_count;
        current_start = splatter_end_idx[point_num];
    }

    let base_point_size = crate::PAINT_POINT_SIZE.clone();
    let decay_age = crate::PAINT_DECAY_AGE.clone() as f64;

    assert_eq!(draw_indexes.len(), point_count);

    // Draw our points/strokes
    for point_num in 0..point_count {
        let point_idx = draw_indexes[point_num];
        let timestamp = timestamps[point_idx];
        // Change the color of the point based on how old it is
        let mut factor = 0.0;
        let (start_color, end_color) = colors_at_idx(
            colors[point_idx],
            &a_colors,
            &b_colors,
            &c_colors,
            &d_colors,
            &e_colors,
        );
        if time < timestamp + decay_age {
            factor = ((timestamp + decay_age) - time) / decay_age;
        }
        let (r, g, b): (u8, u8, u8) =
            Srgb::from_linear(start_color.mix(&end_color, 1.0 - factor as f32))
                .into_format()
                .into_components();
        let pixel = Rgba::from([r, g, b, 255]);
        let x = x_vals[point_idx] * width;
        let y = y_vals[point_idx] * height;
        let paint_point_size = (base_point_size * width) / point_scales[point_idx];
        // Draw the splatters for this point
        for splatter_idx in splatter_start_idx[point_idx]..splatter_end_idx[point_idx] {
            let size = paint_point_size * splatter_sizes[splatter_idx];
            let sx = x + paint_point_size * splatter_x_vals[splatter_idx];
            let sy = y + paint_point_size * splatter_y_vals[splatter_idx];
            let drip_y = splatter_distance(timestamp, size, time);
            // console_log!("draw splatter: {}, {}, {}, {}", sx, sy, sx, drip_y);
            draw_line(image, sx, sy, sx, sy + drip_y, size, pixel);
            changed_rects.push(Rectangle::from_line(
                sx,
                sy,
                sx,
                sy + drip_y,
                size,
                width,
                height,
            ));
        }

        // Draw a stroke
        // If we're the same actor, connect the two points. This only works if points
        // are drawn one group at a time
        let mut end_x = x;
        let mut end_y = y;
        if point_num > 0 {
            let last_idx = draw_indexes[point_num - 1];
            // If the last point isn't by the same person, we don't want to connect it.
            if point_actors[point_idx] == point_actors[last_idx] {
                let point_ts = timestamps[point_idx];
                let last_point_ts = timestamps[last_idx];
                // If the time difference between this point and the last is sufficiently long,
                // make a new line to avoid erratic straight lines
                if point_ts - last_point_ts < 80.0 {
                    let lx = x_vals[last_idx] * width;
                    let ly = y_vals[last_idx] * height;
                    // Because we're using texture maps, we also want to limit the distance of
                    // strokes, so that when you draw from one face to another that is far away (the
                    // UV maps are intentionally set up so that this will happen when changing
                    // faces), we don't draw through another face's texture.
                    let p_distance = distance(x, y, lx, ly).abs();
                    if p_distance < paint_point_size * 3.0 {
                        end_x = lx;
                        end_y = ly;
                    }
                }
            }
        }
        // console_log!("draw stroke: {}, {}, {}, {}", x, y, end_x, end_y);
        draw_line(image, x, y, end_x, end_y, paint_point_size, pixel);
        changed_rects.push(Rectangle::from_line(
            x,
            y,
            end_x,
            end_y,
            paint_point_size,
            width,
            height,
        ));
    }
    let changed_rect = Rectangle::containing(&changed_rects);

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

fn draw_line(
    image: &mut RgbaImage,
    start_x: f32,
    start_y: f32,
    end_x: f32,
    end_y: f32,
    size: f32,
    color: Rgba<u8>,
) {
    // console_log!("draw line: {}, {}, {}, {}", start_x, start_y, end_x, end_y);
    // all our lines have round caps, so draw a circle
    draw_filled_circle_mut(image, (start_x as i32, start_y as i32), size as i32, color);
    // if the line is just a dot, we're done. Round these because otherwise they may
    // produce identical positions when rounded.
    if end_x.round() != start_x.round() || end_y.round() != start_y.round() {
        // draw the end of our line
        draw_filled_circle_mut(image, (end_x as i32, end_y as i32), size as i32, color);
        if distance(start_x, start_y, end_x, end_y) > size / 2.0 {
            // and if it's far enough, connect them with a polygon
            let angle = (end_y - start_y).atan2(end_x - start_x);
            let angle_pos = angle + (PI / 2.0);
            let angle_neg = angle - (PI / 2.0);
            let x0 = start_x + size * angle_pos.cos();
            let y0 = start_y + size * angle_pos.sin();
            let p0 = Point::new(x0 as i32, y0 as i32);
            let x1 = start_x + size * angle_neg.cos();
            let y1 = start_y + size * angle_neg.sin();
            let p1 = Point::new(x1 as i32, y1 as i32);
            let x2 = end_x + size * angle_neg.cos();
            let y2 = end_y + size * angle_neg.sin();
            let p2 = Point::new(x2 as i32, y2 as i32);
            let x3 = end_x + size * angle_pos.cos();
            let y3 = end_y + size * angle_pos.sin();
            let p3 = Point::new(x3 as i32, y3 as i32);
            // console_log!("points: {:?}", [p0, p1, p2, p3]);
            let poly = &[p0, p1, p2, p3];
            // TODO: when painting drips while zoomed in, points will round to the same
            // pixel sometimes. We probably want to actually prevent this from happening,
            // but this isn't crazy expensive and will prevent a panic (and instead paint a
            // disembodied drip)
            if none_same(poly) {
                draw_polygon_mut(image, poly, color);
            }
        }
    }
}

fn splatter_distance(ts: f64, size: f32, time: f64) -> f32 {
    let decay_age = crate::PAINT_DECAY_AGE.clone() as f64;
    let drip_decay = crate::SPLATTER_DRIP_DECAY.clone() as f64;
    let drip_weight = crate::SPLATTER_DRIP_WEIGHT.clone() as f64;
    // If we're not fractional, just return the final value.
    if time > ts + decay_age {
        return size * drip_weight as f32;
    }
    // As we approach decay_age, the drip slows to 0, on a curve defined by drip_decay
    // how far along we are
    let r_factor = ((ts + decay_age) - time) / decay_age;
    let factor = 1.0 - r_factor;

    // now find the value at factor on a curve
    let mut r_amount = 1.0;
    let mut t = 0.0;
    while t < factor {
        r_amount -= r_amount * drip_decay;
        t += 0.01;
    }
    let amount = 1.0 - r_amount;
    ((size as f64) * drip_weight * amount) as f32
}

fn distance(f_x: f32, f_y: f32, t_x: f32, t_y: f32) -> f32 {
    let x = t_x - f_x;
    let y = t_y - f_y;
    (x * x + y * y).sqrt()
}

fn none_same(list: &[Point<i32>]) -> bool {
    for (idx, a) in list.iter().enumerate() {
        for b_idx in idx + 1..list.len() {
            let b = list[b_idx];
            if a.x == b.x && a.y == b.y {
                return false;
            }
        }
    }
    return true;
}

fn u8_to_pct(color: u8) -> f32 {
    color as f32 / 255.0
}

fn colors_at_idx(
    idx: u8,
    a_colors: &[u8],
    b_colors: &[u8],
    c_colors: &[u8],
    d_colors: &[u8],
    e_colors: &[u8],
) -> (LinSrgb, LinSrgb) {
    let colors = match idx {
        0 => a_colors,
        1 => b_colors,
        2 => c_colors,
        3 => d_colors,
        4 => e_colors,
        _ => a_colors,
    };
    (
        Srgb::new(
            u8_to_pct(colors[0]),
            u8_to_pct(colors[1]),
            u8_to_pct(colors[2]),
        )
        .into_linear(),
        Srgb::new(
            u8_to_pct(colors[3]),
            u8_to_pct(colors[4]),
            u8_to_pct(colors[5]),
        )
        .into_linear(),
    )
    // let start_idx = idx as usize * 6;
    // (
    //     Srgb::new(
    //         COLOR_PALATE_RS[start_idx],
    //         COLOR_PALATE_RS[start_idx + 1],
    //         COLOR_PALATE_RS[start_idx + 2],
    //     )
    //     .into_linear(),
    //     Srgb::new(
    //         COLOR_PALATE_RS[start_idx + 3],
    //         COLOR_PALATE_RS[start_idx + 4],
    //         COLOR_PALATE_RS[start_idx + 5],
    //     )
    //     .into_linear(),
    // )
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
