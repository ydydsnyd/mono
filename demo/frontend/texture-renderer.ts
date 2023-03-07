import {ColorPalate, Letter, Splatter} from '../shared/types';
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
  UVMAP_SIZE,
} from '../shared/constants';
import {splatterId} from '../shared/mutators';

const clearAnimationFrames: Record<Letter, HTMLCanvasElement[]> = letterMap(
  _ => [],
);
// Just loads all the animation frames in parallel.
let animationFramesPromise: Promise<any> | undefined = undefined;
export const loadClearAnimationFrames = async () => {
  animationFramesPromise = Promise.all(
    LETTERS.map(async letter => {
      const frames = [];
      for (let i = 0; i < CLEAR_STEP_ANIM_FRAMES - 1; i++) {
        frames.push(`/clear-frames/${letter}${i + 1}.png`);
      }
      const canvases = await Promise.all(
        frames.map(path => {
          return new Promise<HTMLCanvasElement>(resolve => {
            const canvas = document.createElement('canvas');
            canvas.width = UVMAP_SIZE;
            canvas.height = UVMAP_SIZE;
            const image = new Image();
            image.onload = () => {
              const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
              ctx.save();
              // Axes are inverted in babylon, so we need to flip the canvas inside out before drawing.
              ctx.translate(0, UVMAP_SIZE);
              ctx.rotate(Math.PI);
              ctx.scale(-1, 1);
              ctx.drawImage(image, 0, 0);
              ctx.restore();
              resolve(canvas);
            };
            image.src = path;
          });
        }),
      );
      clearAnimationFrames[letter] = canvases;
    }),
  );
  await animationFramesPromise;
};

const getClearAnimationFrame = async (
  letter: Letter,
  frame: number,
): Promise<HTMLCanvasElement> => {
  // We should NOT load this lazily, as it's in the render loop. Force consumers to preload.
  if (!animationFramesPromise) {
    throw new Error(
      'You must call loadClearAnimationFrames before attempting to animate a clear.',
    );
  }
  // Just in case we're not done yet, make sure the frames have loaded.
  await animationFramesPromise;
  return clearAnimationFrames[letter][frame]!;
};

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

export const renderFrame = async (
  time: number,
  canvases: Record<Letter, HTMLCanvasElement>,
  colors: ColorPalate,
  lastClear: number | undefined,
  updated: false | ((letter: Letter) => void),
) => {
  let clearing = false;
  if (lastClear) {
    clearing = await renderClearFrame(time, lastClear, canvases);
  }
  LETTERS.forEach(letter => {
    const ctx = canvases[letter].getContext('2d') as CanvasRenderingContext2D;
    0;
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

let lastRenderedClear = -1;
const renderClearFrame = async (
  time: number,
  lastClear: number,
  canvases: Record<Letter, HTMLCanvasElement>,
): Promise<boolean> => {
  const contexts = letterMap(
    letter =>
      canvases[letter].getContext('2d', {
        willReadFrequently: true,
      }) as CanvasRenderingContext2D,
  );
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
        const ctx = contexts[letter];
        ctx.clearRect(0, 0, canvases[letter].width, canvases[letter].height);
      });
    } else {
      // First, just render the in-memory caches to our buffers.
      draw_caches(
        contexts[Letter.A],
        contexts[Letter.L],
        contexts[Letter.I],
        contexts[Letter.V],
        contexts[Letter.E],
      );
      // Then, find the frame for this animation and subtract it from the cache
      await Promise.all(
        LETTERS.map(async letter => {
          const ctx = contexts[letter];
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
      contexts[Letter.A],
      contexts[Letter.L],
      contexts[Letter.I],
      contexts[Letter.V],
      contexts[Letter.E],
    );
  }
  return renderClear;
};
