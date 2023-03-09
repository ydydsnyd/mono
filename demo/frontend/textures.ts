import {CLEAR_STEP_ANIM_FRAMES, UVMAP_SIZE} from '../shared/constants';
import type {Letter} from '../shared/types';
import {asyncLetterMap, letterMap} from '../shared/util';

const textures: Record<Letter, HTMLCanvasElement> = letterMap(() => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = UVMAP_SIZE;
  canvas.height = UVMAP_SIZE;
  return canvas;
});
const contexts: Record<Letter, CanvasRenderingContext2D> = letterMap(letter => {
  return textures[letter].getContext('2d', {
    willReadFrequently: true,
  }) as CanvasRenderingContext2D;
});

export const getCanvas = (letter: Letter) => textures[letter];

export const getContext = (letter: Letter) => contexts[letter];

export const getSize = (letter: Letter) => {
  const canvas = textures[letter];
  return {width: canvas.width, height: canvas.height};
};

// Animation frames also need to manage their own canvases

const clearAnimationFrames: Record<Letter, HTMLCanvasElement[]> = letterMap(
  _ => [],
);
// Just loads all the animation frames in parallel.
let animationFramesPromise: Promise<any> | undefined = undefined;
export const loadClearAnimationFrames = async () => {
  (animationFramesPromise = asyncLetterMap(async letter => {
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
  })),
    await animationFramesPromise;
};

export const getClearAnimationFrame = async (
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
