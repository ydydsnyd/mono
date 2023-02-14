import {
  add_points_to_cache,
  draw_buffer_png,
  Letter as RendererLetter,
  update_cache,
} from '../../renderer/pkg/renderer';
import {decodePngData, encodePngData} from './png-data';
import {points2Render} from './points2wasm';
import {ColorPalate, Letter, Point} from './types';
import {now} from './util';

export const getRendererLetter = (letter: Letter): RendererLetter => {
  switch (letter) {
    case Letter.A:
      return RendererLetter.A;
    case Letter.L:
      return RendererLetter.L;
    case Letter.I:
      return RendererLetter.I;
    case Letter.V:
      return RendererLetter.V;
    case Letter.E:
      return RendererLetter.E;
  }
};

export const addPointsToCache = (
  letter: Letter,
  context: CanvasRenderingContext2D,
  points: Point[],
  colors: ColorPalate,
) => {
  add_points_to_cache(
    getRendererLetter(letter),
    context,
    now(),
    new Uint8Array(colors[0].flat()),
    new Uint8Array(colors[1].flat()),
    new Uint8Array(colors[2].flat()),
    new Uint8Array(colors[3].flat()),
    new Uint8Array(colors[4].flat()),
    ...points2Render(points),
  );
};

export const updateCache = (letter: Letter, png: string) => {
  update_cache(getRendererLetter(letter), decodePngData(png));
};

export const getCache = (
  letter: Letter,
  points: Point[],
  colors: ColorPalate,
) => {
  return encodePngData(
    draw_buffer_png(
      getRendererLetter(letter),
      now(),
      new Uint8Array(colors[0].flat()),
      new Uint8Array(colors[1].flat()),
      new Uint8Array(colors[2].flat()),
      new Uint8Array(colors[3].flat()),
      new Uint8Array(colors[4].flat()),
      ...points2Render(points),
    ),
  );
};
