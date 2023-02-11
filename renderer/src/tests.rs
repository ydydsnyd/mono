#[cfg(test)]
mod tests {
    use crate::{png_to_pix_map, render_cache_to_png, render_init_to_png};
    use wasm_bindgen_test::*;

    wasm_bindgen_test_configure!(run_in_browser);

    #[wasm_bindgen_test]
    fn png_data() {
        let width = 100;
        let height = 100;
        let time = 10000.0;
        let point_count = 2;
        let timestamps = vec![10000.0, 10001.0];
        let point_actors = vec![0, 1];
        let point_groups = vec![2, 3];
        let colors_r = vec![255, 255];
        let colors_g = vec![255, 255];
        let colors_b = vec![255, 255];
        let x_vals = vec![0.5, 0.6];
        let y_vals = vec![0.5, 0.6];
        let splatter_sizes = vec![];
        let splatter_x_vals = vec![];
        let splatter_counts = vec![0, 0];
        let splatter_y_vals = vec![];
        let png_data = render_init_to_png(
            width,
            height,
            time,
            point_count,
            timestamps,
            point_actors,
            point_groups,
            colors_r,
            colors_g,
            colors_b,
            x_vals,
            y_vals,
            splatter_counts,
            splatter_sizes,
            splatter_x_vals,
            splatter_y_vals,
        );
        println!("{:?}", png_data);
        let pix_data = png_to_pix_map(png_data);
        let width = 100;
        let height = 100;
        let time = 10000.0;
        let point_count = 2;
        let timestamps = vec![10000.0, 10001.0];
        let point_actors = vec![0, 1];
        let point_groups = vec![2, 3];
        let colors_r = vec![255, 255];
        let colors_g = vec![255, 255];
        let colors_b = vec![255, 255];
        let x_vals = vec![0.5, 0.6];
        let y_vals = vec![0.5, 0.6];
        let splatter_sizes = vec![];
        let splatter_x_vals = vec![];
        let splatter_counts = vec![0, 0];
        let splatter_y_vals = vec![];
        let updated_data = render_cache_to_png(
            pix_data,
            width,
            height,
            time,
            point_count,
            timestamps,
            point_actors,
            point_groups,
            colors_r,
            colors_g,
            colors_b,
            x_vals,
            y_vals,
            splatter_counts,
            splatter_sizes,
            splatter_x_vals,
            splatter_y_vals,
        );
        let updated_png_data = png_to_pix_map(updated_data);
        let updated_pix_data = png_to_pix_map(updated_png_data);
        let width = 100;
        let height = 100;
        let time = 10000.0;
        let point_count = 2;
        let timestamps = vec![10000.0, 10001.0];
        let point_actors = vec![0, 1];
        let point_groups = vec![2, 3];
        let colors_r = vec![255, 255];
        let colors_g = vec![255, 255];
        let colors_b = vec![255, 255];
        let x_vals = vec![0.5, 0.6];
        let y_vals = vec![0.5, 0.6];
        let splatter_sizes = vec![];
        let splatter_x_vals = vec![];
        let splatter_counts = vec![0, 0];
        let splatter_y_vals = vec![];
        let final_data = render_cache_to_png(
            updated_pix_data,
            width,
            height,
            time,
            point_count,
            timestamps,
            point_actors,
            point_groups,
            colors_r,
            colors_g,
            colors_b,
            x_vals,
            y_vals,
            splatter_counts,
            splatter_sizes,
            splatter_x_vals,
            splatter_y_vals,
        );
        println!("{:?}", final_data);
    }
}
