// @ts-check

import * as esbuild from 'esbuild';
import {readFile} from 'node:fs/promises';
import {makeDefine} from 'shared/out/build.js';
import {getExternalFromPackageJSON} from 'shared/out/tool/get-external-from-package-json.js';
import {injectRequire} from 'shared/out/tool/inject-require.js';

/**
 * @returns {Promise<{name: string; version: string}>}
 * @param {string | URL} relPath
 */
async function packageJSON(relPath) {
  const s = await readFile(new URL(relPath, import.meta.url), 'utf-8');
  return JSON.parse(s);
}

const define = makeDefine();
const reflectCliName = (await packageJSON('../package.json')).name;

async function main() {
  const outfile = 'out/index.mjs';
  await esbuild.build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    outfile,
    external: await getExternalFromPackageJSON(import.meta.url),
    platform: 'node',
    target: 'esnext',
    format: 'esm',
    sourcemap: false,
    banner: {
      js: injectRequire(),
    },
    define: {
      ...define,
      REFLECT_CLI_NAME: JSON.stringify(reflectCliName),
      TESTING: 'false',
    },
  });
}

await main();
