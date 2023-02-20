// This is the base UV map size, which is useful for scaling pixel counts.
export const UVMAP_SIZE = 800;

// This is stored as a flat array so that it can be imported into rust without
// messing with types or implementing serialization.
// For each color, there are 6 consecutive bits. The first 3 are the r,g,b of
// the starting color, and the second 3 are the r,g,b of the ending color.
export const COLOR_PALATE_RS: number[] = [
  0.37254902, 0.90980392, 1, 0, 0.77254902, 0.89803922, 0.39215686, 1, 0,
  0.36862745, 0.85098039, 0.05882353, 0.90588235, 1, 0, 0.83921569, 0.9254902,
  0, 0.98823529, 0.28627451, 0.67058824, 0.8745098, 0, 0.47843137, 1, 0.6, 0,
  0.82745098, 0.49803922, 0,
];

/**

Blue:
95, 232, 255
0, 197, 229

Green:
100, 255, 0
94, 217, 15

Yellow:
231, 255, 0
214, 236, 0

Pink:
252, 73, 171
223, 0, 122

Orange:
255, 153, 0
211, 127, 0

 */
