import {ColorPalate, Letter, Splatter} from '../shared/types';
import {draw_buffers} from '../../renderer/pkg/renderer';
import {closest, letterMap, now} from '../shared/util';
import {splatters2RenderBatch} from '../shared/wasm-args';
import {MAX_SPLATTER_RENDER_AGE} from '../shared/constants';

let splatterIndexes = letterMap(_ => 0);

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
  const renderSplatters = letterMap(letter => {
    const currentIndex = splatterIndexes[letter];
    const renderIndex = closest(
      now() - MAX_SPLATTER_RENDER_AGE,
      splatters[letter].slice(currentIndex),
      s => s.t,
    );
    // closest returns the closest index without going over - therefore, we always
    // add one to get a slice that includes that index.
    splatterIndexes[letter] = currentIndex + renderIndex + 1;
    const rendered = splatters[letter].slice(splatterIndexes[letter]);
    if (rendered.length > 0) {
      needsRender.add(letter);
    }
    return rendered;
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
