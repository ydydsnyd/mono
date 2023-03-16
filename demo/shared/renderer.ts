import {Letter as RendererLetter, update_cache} from '../../vendor/renderer';
import {decode} from './uint82b64';
import {Debug, Letter} from './types';

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
