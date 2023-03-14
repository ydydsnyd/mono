import {
  draw_buffer_png,
  Letter as RendererLetter,
  update_cache,
} from '../../vendor/renderer';
import {encode, decode} from './uint82b64';
import {splatters2Render} from './wasm-args';
import {Debug, Letter, Splatter} from './types';
import {SPLATTER_ANIM_FRAMES} from './constants';

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

export const updateCache = (letter: Letter, png: string, debug?: Debug) => {
  const decoded = decode(png);
  if (decoded) {
    update_cache(getRendererLetter(letter), decoded);
    if (debug) {
      debug.cacheUpdated(letter, png);
    }
  }
};

export const getCache = (letter: Letter, splatters: Splatter[]) => {
  return encode(
    draw_buffer_png(
      getRendererLetter(letter),
      ...splatters2Render(
        splatters,
        // When we draw a cache, we just want the "finished" state of all the
        // animations, as they're presumed to be complete and immutable.
        splatters.map(() => SPLATTER_ANIM_FRAMES),
      ),
    ),
  );
};
