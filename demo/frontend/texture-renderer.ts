import {LETTERS, LETTER_PATHS} from '../shared/letters';
import {ColorPalate, Letter, Point} from '../shared/types';
import {draw_buffers} from '../../renderer/pkg/renderer';
import {closest, letterMap, now} from '../shared/util';
import {points2RenderBatch} from '../shared/points2wasm';
import {POINT_AGE_MAX} from '../shared/constants';
import {addPointsToCache} from '../shared/renderer';

// Client side caching - keeps our pixel counts low even when we're offline.
export const cacheOldPoints = (
  letter: Letter,
  canvas: HTMLCanvasElement,
  points: Point[],
  currentIndex: number,
  colors: ColorPalate,
): number => {
  let ts = now();
  // Find the first cacheable point. This assumes that points are always sorted by
  // age from oldest to newest.
  let oldIndex = closest(ts - POINT_AGE_MAX, points, p => p.t);
  if (oldIndex <= currentIndex) {
    return currentIndex;
  }
  const oldPoints: Point[] = points.slice(0, oldIndex);
  addPointsToCache(
    letter,
    canvas.getContext('2d') as CanvasRenderingContext2D,
    oldPoints,
    colors,
  );
  return oldIndex;
};

// Takes an array of pixel data generated in our wasm code and draws it to a canvas
export const drawData = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: Uint8Array,
) => {
  const imgData = new ImageData(width, height);
  for (let i = 0; i < data.length; i++) {
    imgData.data[i] = data[i];
  }
  ctx.putImageData(imgData, 0, 0);
};

export const render = async (
  canvases: Record<Letter, HTMLCanvasElement>,
  points: Record<Letter, Point[]>,
  pointIndexes: Record<Letter, number>,
  colors: ColorPalate,
) => {
  // Render new points
  const contexts = letterMap(
    letter => canvases[letter].getContext('2d') as CanvasRenderingContext2D,
  );
  const slicedPoints = letterMap(letter =>
    points[letter].slice(pointIndexes[letter]),
  );
  draw_buffers(
    contexts[Letter.A],
    contexts[Letter.L],
    contexts[Letter.I],
    contexts[Letter.V],
    contexts[Letter.E],
    now(),
    new Uint8Array(colors[0].flat()),
    new Uint8Array(colors[1].flat()),
    new Uint8Array(colors[2].flat()),
    new Uint8Array(colors[3].flat()),
    new Uint8Array(colors[4].flat()),
    ...points2RenderBatch(slicedPoints),
  );
};
