import {ColorPalate, Letter, Splatter} from '../shared/types';
import {draw_buffers} from '../../renderer/pkg/renderer';
import {letterMap, now} from '../shared/util';
import {splatters2RenderBatch} from '../shared/wasm-args';
import {LETTERS} from '../shared/letters';
import {splatterId} from '../shared/mutators';

let renderedSplatters = new Set<string>();

// Splatters have 4 frames rendered at 30fps, so this is the length of time we
// need to re-render splatters every frame before skipping them
export const SPLATTER_RENDER_DURATION = 4 * 32.2;

export const render = async (
  buffers: Record<Letter, HTMLCanvasElement>,
  canvases: Record<Letter, HTMLCanvasElement>,
  splatters: Record<Letter, Splatter[]>,
  colors: ColorPalate,
) => {
  // Render new splatters
  const contexts = letterMap(
    letter => buffers[letter].getContext('2d') as CanvasRenderingContext2D,
  );
  const ts = now();
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
      if (splatter.t - now() > SPLATTER_RENDER_DURATION) {
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
    ts,
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
