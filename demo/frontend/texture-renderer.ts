import {ColorPalate, Letter, Splatter} from '../shared/types';
import {draw_buffers} from '../../renderer/pkg/renderer';
import {letterMap} from '../shared/util';
import {splatters2RenderBatch} from '../shared/wasm-args';
import {LETTERS} from '../shared/letters';
import {splatterId} from '../shared/mutators';
import {SPLATTER_ANIM_FRAMES} from '../shared/constants';

let renderedSplatters = new Set<string>();

export const render = async (
  step: number,
  buffers: Record<Letter, HTMLCanvasElement>,
  canvases: Record<Letter, HTMLCanvasElement>,
  splatters: Record<Letter, Splatter[]>,
  colors: ColorPalate,
) => {
  // Render new splatters
  const contexts = letterMap(
    letter => buffers[letter].getContext('2d') as CanvasRenderingContext2D,
  );
  let needsRender = new Set<Letter>();
  const renderSplatters = letterMap<Splatter[]>(_ => []);
  LETTERS.forEach(letter => {
    for (const splatter of splatters[letter]) {
      const id = splatterId(splatter);
      if (renderedSplatters.has(id)) {
        continue;
      }
      renderSplatters[letter].push(splatter);
      needsRender.add(letter);
      // Continue to render these splatters until have rendered their step + the
      // number of frames. After this point, add them to renderedSplatters so we will
      // stop re-rendering them.
      if (step >= splatter.s + SPLATTER_ANIM_FRAMES) {
        renderedSplatters.add(id);
      }
    }
  });
  if (!needsRender.size) {
    return;
  }
  draw_buffers(
    contexts[Letter.A],
    contexts[Letter.L],
    contexts[Letter.I],
    contexts[Letter.V],
    contexts[Letter.E],
    step,
    new Uint8Array(colors[0].flat()),
    new Uint8Array(colors[1].flat()),
    new Uint8Array(colors[2].flat()),
    new Uint8Array(colors[3].flat()),
    new Uint8Array(colors[4].flat()),
    ...splatters2RenderBatch(renderSplatters),
  );
  needsRender.forEach(letter => {
    const ctx = canvases[letter].getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(buffers[letter], 0, 0);
  });
};
