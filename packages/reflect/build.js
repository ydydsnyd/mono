// @ts-check
/* eslint-env node, es2022 */

import * as esbuild from 'esbuild';
import {writeFile} from 'fs/promises';
import * as path from 'path';
import {fileURLToPath} from 'url';
import {sharedOptions} from '../shared/src/build.js';
import {makeDefine} from './make-define.js';

// You can then visualize the metafile at https://esbuild.github.io/analyze/
const metafile = process.argv.includes('--metafile');
const debug = process.argv.includes('--debug');

const dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildESM() {
  const mode = debug ? 'debug' : 'unknown';
  const minify = false; //!debug;
  const shared = sharedOptions(minify, metafile);
  const outfile = path.join(dirname, 'out', 'reflect.js');
  const define = await makeDefine(mode);
  const result = await esbuild.build({
    ...shared,
    // Use neutral to remove the automatic define for process.env.NODE_ENV
    platform: 'neutral',
    define,
    format: 'esm',
    entryPoints: [path.join(dirname, 'src', 'mod.ts')],
    outfile,
    metafile,
  });
  if (metafile) {
    await writeFile(outfile + '.meta.json', JSON.stringify(result.metafile));
  }
}

try {
  await buildESM();
} catch {
  process.exitCode = 1;
}
