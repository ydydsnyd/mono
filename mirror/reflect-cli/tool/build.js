// @ts-check

import * as esbuild from 'esbuild';
import {rm} from 'fs/promises';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {getVersion} from '../../../packages/reflect-shared/tool/get-version.js';
import {getExternalFromPackageJSON} from '../../../packages/shared/src/tool/get-external-from-package-json.js';
import {injectRequire} from '../../../packages/shared/src/tool/inject-require.js';

/**
 * @returns {Promise<{name: string; version: string}>}
 * @param {string} path
 */
async function packageJSON(path) {
  const s = await readFile(toAbsPath(path), 'utf-8');
  return JSON.parse(s);
}

/**
 * @param {string} path
 * @returns {string}
 */
function toAbsPath(path) {
  return fileURLToPath(new URL(path, import.meta.url));
}

const reflectVersion = getVersion();
const reflectCliName = (await packageJSON('../package.json')).name;

async function main() {
  const outdir = toAbsPath('../out');
  await rm(outdir, {recursive: true, force: true});
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outdir,
    external: await getExternalFromPackageJSON(import.meta.url),
    platform: 'node',
    target: 'esnext',
    format: 'esm',
    sourcemap: false,
    banner: {
      js: injectRequire(),
    },
    define: {
      REFLECT_VERSION: JSON.stringify(reflectVersion),
      REFLECT_CLI_NAME: JSON.stringify(reflectCliName),
    },
    splitting: true,
    minify: true,
  });
}

await main();
