import {
  draw_buffer_png,
  set_physics_state,
  Letter as RendererLetter,
  update_cache,
  positions_for_step,
} from '../../vendor/renderer';
import {encode, decode} from './uint82b64';
import {impulses2Physics, splatters2Render} from './wasm-args';
import {
  ColorPalate,
  Impulse,
  Letter,
  Letter3DPosition,
  Splatter,
} from './types';
import {letterMap} from './util';
import {LETTERS} from './letters';
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
      new Uint8Array(colors[0].flat()),
      new Uint8Array(colors[1].flat()),
      new Uint8Array(colors[2].flat()),
      new Uint8Array(colors[3].flat()),
      new Uint8Array(colors[4].flat()),
      ...splatters2Render(
        splatters,
        // When we draw a cache, we just want the "finished" state of all the
        // animations, as they're presumed to be complete and immutable.
        splatters.map(() => SPLATTER_ANIM_FRAMES),
      ),
    ),
  );
};

export const setPhysics = (step: number, state?: string) => {
  set_physics_state(state ? decode(state) : undefined, step);
};

// This function gets whatever the current state of the physics is (held in wasm
// memory) and finds the positions of lettters when advanced N steps forward.
export const get3DPositions = (
  targetStep: number,
  impulses: Record<Letter, Impulse[]>,
): Record<Letter, Letter3DPosition> | undefined => {
  const flatPositions = positions_for_step(
    targetStep,
    ...impulses2Physics(impulses),
  );
  if (!flatPositions) {
    return;
  }
  const positions = letterMap<Letter3DPosition>(_ => ({
    position: {x: -1, y: -1, z: -1},
    rotation: {x: -1, y: -1, z: -1, w: -1},
  }));
  LETTERS.forEach((letter, idx) => {
    let startIdx = idx * 7;
    positions[letter].position.x = flatPositions[startIdx + 0];
    positions[letter].position.y = flatPositions[startIdx + 1];
    positions[letter].position.z = flatPositions[startIdx + 2];
    positions[letter].rotation.x = flatPositions[startIdx + 3];
    positions[letter].rotation.y = flatPositions[startIdx + 4];
    positions[letter].rotation.z = flatPositions[startIdx + 5];
    positions[letter].rotation.w = flatPositions[startIdx + 6];
  });
  return positions;
};
