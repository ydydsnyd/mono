import type {ColorPalate, Letter, Splatter} from '../shared/types';
import {draw_buffer} from '../../vendor/renderer';
import {letterMap} from '../shared/util';
import {splatters2Render} from '../shared/wasm-args';
import {LETTERS} from '../shared/letters';
import {getRendererLetter} from '../shared/renderer';
import {
  SPLATTER_ANIMATION_FRAME_DURATION,
  SPLATTER_ANIM_FRAMES,
} from '../shared/constants';
import {splatterId} from '../shared/mutators';

type Animation = Splatter & {added: number};

const animatingSplatters: Record<Letter, Animation[]> = letterMap(() => []);

const animFrame = (time: number, animation: Animation): number => {
  const msElapsed = time - animation.added;
  return Math.round(msElapsed / SPLATTER_ANIMATION_FRAME_DURATION);
};

export const drawSplatter = (
  time: number,
  letter: Letter,
  splatter: Splatter,
) => {
  animatingSplatters[letter].push({...splatter, added: time});
};

export const renderInitialFrame = (
  canvases: Record<Letter, HTMLCanvasElement>,
  splatters: Record<Letter, Splatter[]>,
  colors: ColorPalate,
) => {
  LETTERS.forEach(letter => {
    const ctx = canvases[letter].getContext('2d') as CanvasRenderingContext2D;
    draw_buffer(
      getRendererLetter(letter),
      ctx,
      new Uint8Array(colors[0].flat()),
      new Uint8Array(colors[1].flat()),
      new Uint8Array(colors[2].flat()),
      new Uint8Array(colors[3].flat()),
      new Uint8Array(colors[4].flat()),
      ...splatters2Render(
        splatters[letter],
        // When we draw a cache, we just want the "finished" state of all the
        // animations, as they're presumed to be complete and immutable.
        splatters[letter].map(() => SPLATTER_ANIM_FRAMES),
      ),
    );
  });
};

const addedSplatters = new Set<string>();

export const renderFrame = (
  time: number,
  canvases: Record<Letter, HTMLCanvasElement>,
  colors: ColorPalate,
  updated: false | ((letter: Letter) => void),
) => {
  LETTERS.forEach(letter => {
    const ctx = canvases[letter].getContext('2d') as CanvasRenderingContext2D;
    0;
    const frames: number[] = [];
    animatingSplatters[letter] = animatingSplatters[letter].filter(anim => {
      const frame = animFrame(time, anim);
      if (frame <= SPLATTER_ANIM_FRAMES) {
        frames.push(frame);
        return true;
      } else if (!addedSplatters.has(splatterId(anim))) {
        // If we don't know if this splatter has been rendered but it's old, it may be
        // old but added after initialization. To make sure we don't draw partial
        // splatters, draw this at its last frame, then add it to a list so we don't
        // render it ever again.
        frames.push(SPLATTER_ANIM_FRAMES);
        addedSplatters.add(splatterId(anim));
        return true;
      } else {
        return false;
      }
    });
    if (updated && animatingSplatters[letter].length === 0) {
      return;
    }
    draw_buffer(
      getRendererLetter(letter),
      ctx,
      new Uint8Array(colors[0].flat()),
      new Uint8Array(colors[1].flat()),
      new Uint8Array(colors[2].flat()),
      new Uint8Array(colors[3].flat()),
      new Uint8Array(colors[4].flat()),
      ...splatters2Render(animatingSplatters[letter], frames),
    );
    if (updated) {
      updated(letter);
    }
  });
};
