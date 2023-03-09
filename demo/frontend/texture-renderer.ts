import {Letter, Splatter} from '../shared/types';
import {
  draw_buffer,
  draw_caches,
  overwrite_caches,
} from '../../vendor/renderer';
import {letterMap} from '../shared/util';
import {splatters2Render} from '../shared/wasm-args';
import {LETTERS} from '../shared/letters';
import {getRendererLetter} from '../shared/renderer';
import {
  CLEAR_ANIMATION_FRAME_DURATION,
  CLEAR_STEP_ANIM_FRAMES,
  SPLATTER_ANIMATION_FRAME_DURATION,
  SPLATTER_ANIM_FRAMES,
} from '../shared/constants';
import {splatterId} from '../shared/mutators';
import {getClearAnimationFrame, getContext, getSize} from './textures';

type Animation = Splatter & {added: number};

const animatingSplatters: Record<Letter, Animation[]> = letterMap(() => []);

const animFrame = (
  time: number,
  animationStart: number,
  frameDuration: number,
): number => {
  const msElapsed = time - animationStart;
  return Math.round(msElapsed / frameDuration);
};

export const drawSplatter = (
  time: number,
  letter: Letter,
  splatter: Splatter,
) => {
  animatingSplatters[letter].push({...splatter, added: time});
};

export const renderInitialFrame = (splatters: Record<Letter, Splatter[]>) => {
  LETTERS.forEach(letter => {
    const ctx = getContext(letter);
    draw_buffer(
      getRendererLetter(letter),
      ctx,
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

export const triggerSplatterRedraw = () => addedSplatters.clear();

export const renderFrame = async (
  time: number,
  lastClear: number | undefined,
  updated: false | ((letter: Letter) => void),
) => {
  let clearing = false;
  if (lastClear) {
    clearing = await renderClearFrame(time, lastClear);
  }
  LETTERS.forEach(letter => {
    const ctx = getContext(letter);
    const frames: number[] = [];
    animatingSplatters[letter] = animatingSplatters[letter].filter(anim => {
      const frame = animFrame(
        time,
        anim.added,
        SPLATTER_ANIMATION_FRAME_DURATION,
      );
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
    if (!clearing && updated && animatingSplatters[letter].length === 0) {
      return;
    }
    draw_buffer(
      getRendererLetter(letter),
      ctx,
      ...splatters2Render(animatingSplatters[letter], frames),
    );
    if (updated) {
      updated(letter);
    }
  });
};

let lastRenderedClear = -1;
const renderClearFrame = async (
  time: number,
  lastClear: number,
): Promise<boolean> => {
  const clearFrame = animFrame(time, lastClear, CLEAR_ANIMATION_FRAME_DURATION);
  const renderClear =
    clearFrame < CLEAR_STEP_ANIM_FRAMES || lastRenderedClear !== lastClear;
  // When we animate a clear, we need to perform an animation directly on the
  // cache, since they're already clear upstream but our local cache will still
  // have paint on it.
  if (renderClear) {
    lastRenderedClear = lastClear;
    if (clearFrame >= CLEAR_STEP_ANIM_FRAMES - 1) {
      // On the last frame of the animation, we don't need to copy - just clear the cache.
      LETTERS.map(async letter => {
        const ctx = getContext(letter);
        const size = getSize(letter);
        ctx.clearRect(0, 0, size.width, size.height);
      });
    } else {
      // First, just render the in-memory caches to our buffers.
      draw_caches(
        getContext(Letter.A),
        getContext(Letter.L),
        getContext(Letter.I),
        getContext(Letter.V),
        getContext(Letter.E),
      );
      // Then, find the frame for this animation and subtract it from the cache
      await Promise.all(
        LETTERS.map(async letter => {
          const ctx = getContext(letter);
          const image = await getClearAnimationFrame(letter, clearFrame);
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          ctx.drawImage(image, 0, 0);
          ctx.restore();
        }),
      );
    }
    // After updating the caches, write them back so that they'll be used as the
    // base for the below renders.
    overwrite_caches(
      getContext(Letter.A),
      getContext(Letter.L),
      getContext(Letter.I),
      getContext(Letter.V),
      getContext(Letter.E),
    );
  }
  return renderClear;
};
