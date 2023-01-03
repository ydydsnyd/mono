// @ts-check

import * as esbuild from 'esbuild';
import {makeDefine} from './make-define.js';
import {writeFile} from 'fs/promises';

const forBundleSizeDashboard = process.argv.includes('--bundle-sizes');
const perf = process.argv.includes('--perf');
const debug = process.argv.includes('--debug');

// You can then visualize the metafile at https://esbuild.github.io/analyze/
const metafile = process.argv.includes('--metafile');

/**
 * @param {boolean} minify
 * @returns {{
 *   bundle: boolean;
 *   target: string;
 *   mangleProps?: RegExp;
 *   reserveProps?: RegExp;
 * }}
 */
function sharedOptions(minify) {
  const opts = {
    bundle: true,
    target: 'es2018',
  };
  if (minify) {
    return {...opts, mangleProps: /^_./, reserveProps: /^__.*__$/};
  }
  return opts;
}

/**
 * @typedef {'unknown'|'debug'|'release'} BuildMode
 */

/**
 * @typedef {{
 *   minify: boolean,
 *   ext: string,
 *   mode: BuildMode
 * }} BuildOptions
 */

/**
 * @param {esbuild.BuildOptions & BuildOptions} options
 */
async function buildReplicache(options) {
  const {ext, mode, ...restOfOptions} = options;
  const result = await esbuild.build({
    ...sharedOptions(options.minify),
    ...restOfOptions,
    // Use neutral to remove the automatic define for process.env.NODE_ENV
    platform: 'neutral',
    outfile: 'out/replicache.' + ext,
    entryPoints: ['src/mod.ts'],
    define: await makeDefine(mode),
    metafile,
    sourcemap: true,
  });
  if (metafile) {
    await writeFile(
      'out/replicache.' + ext + '.meta.json',
      JSON.stringify(result.metafile),
    );
  }
}

/**
 * @param {Partial<BuildOptions>} options
 */
async function buildMJS({minify = true, ext = 'js', mode = 'unknown'} = {}) {
  await buildReplicache({format: 'esm', minify, ext, mode});
}

/**
 * @param {Partial<BuildOptions>} options
 */
async function buildCJS({minify = true, ext = 'cjs', mode = 'unknown'} = {}) {
  await buildReplicache({format: 'cjs', minify, ext, mode});
}

async function buildCLI() {
  await esbuild.build({
    ...sharedOptions(true),
    platform: 'node',
    external: ['node:*'],
    outfile: 'out/cli.cjs',
    entryPoints: ['tool/cli.ts'],
    minify: true,
  });
}

if (perf) {
  await buildMJS({mode: 'release'});
} else if (forBundleSizeDashboard) {
  // We keep cjs as js and mjs as mjs so the dashboard does not get reset
  await Promise.all([
    buildMJS({minify: false, ext: 'mjs'}),
    buildMJS({minify: true, ext: 'min.mjs'}),
    buildCJS({minify: false, ext: 'js'}),
    buildCJS({minify: true, ext: 'min.js'}),
    buildCLI(),
  ]);
} else {
  let opts = {};
  if (debug) {
    opts = {minify: false};
  }
  await Promise.all([buildMJS(opts), buildCJS(opts), buildCLI()]);
}
