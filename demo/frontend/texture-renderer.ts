import {ColorPalate, Letter, Splatter} from '../shared/types';
import {draw_buffers} from '../../renderer/pkg/renderer';
import {letterMap, now} from '../shared/util';
import {splatters2RenderBatch} from '../shared/wasm-args';

export const render = async (
  canvases: Record<Letter, HTMLCanvasElement>,
  splatters: Record<Letter, Splatter[]>,
  colors: ColorPalate,
) => {
  // Render new splatters
  const contexts = letterMap(
    letter => canvases[letter].getContext('2d') as CanvasRenderingContext2D,
  );
  const ts = now();
  // TODO: remove any splatters that are done animating and break early if there's none
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
    ...splatters2RenderBatch(splatters),
  );
};
