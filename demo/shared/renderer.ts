import {
  add_points_to_cache,
  draw_buffer_png,
  get_physics,
  get_positions,
  Letter as RendererLetter,
  update_cache,
} from '../../renderer/pkg/renderer';
import {encode, decode} from './uint82b64';
import {impulses2Physics, splatters2Render} from './wasm-args';
import {
  ColorPalate,
  Impulse,
  Letter,
  Letter3DPosition,
  Splatter,
} from './types';
import {letterMap, now} from './util';
import {LETTERS} from './letters';

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

export const runPhysics = (
  physics: string | undefined,
  step: number,
  impulses: Record<Letter, Impulse[]>,
): [Record<Letter, Letter3DPosition>, string, Uint8Array] => {
  let newPhysics = get_physics(
    physics ? decode(physics) : undefined,
    step,
    ...impulses2Physics(impulses),
  );
  let flatPositions = get_positions(newPhysics);
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
  return [positions, encode(newPhysics), newPhysics];
};
