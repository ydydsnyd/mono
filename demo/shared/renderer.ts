import {
  add_points_to_cache,
  draw_buffer_png,
  Letter as RendererLetter,
  update_cache,
} from '../../renderer/pkg/renderer';
import {encode, decode} from './uint82b64';
import {splatters2Render} from './wasm-args';
import {ColorPalate, Letter, Splatter} from './types';
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

export const addSplattersToCache = (
  letter: Letter,
  context: CanvasRenderingContext2D,
  points: Splatter[],
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
    ...splatters2Render(points),
  );
};

export const updateCache = (letter: Letter, png: string) => {
  update_cache(getRendererLetter(letter), decode(png));
};

export const getCache = (
  letter: Letter,
  splatters: Splatter[],
  colors: ColorPalate,
) => {
  return encode(
    draw_buffer_png(
      getRendererLetter(letter),
      now(),
      new Uint8Array(colors[0].flat()),
      new Uint8Array(colors[1].flat()),
      new Uint8Array(colors[2].flat()),
      new Uint8Array(colors[3].flat()),
      new Uint8Array(colors[4].flat()),
      ...splatters2Render(splatters),
    ),
  );
};
