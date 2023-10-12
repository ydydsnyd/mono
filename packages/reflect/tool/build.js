// @ts-check

import * as esbuild from 'esbuild';
import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';
import {makeDefine, sharedOptions} from '../../shared/src/build.js';
import {getExternalFromPackageJSON} from '../../shared/src/tool/get-external-from-package-json.js';

/** @param {string[]} parts */
function basePath(...parts) {
  return path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    ...parts,
  );
}

function copyDTSFilesFromPackages() {
  for (const name of ['client', 'server', 'shared']) {
    for (const ext of ['d.ts']) {
      const src = basePath(
        '..',
        `reflect-${name}`,
        'out',
        `reflect-${name + '.' + ext}`,
      );
      const dst = basePath((name === 'shared' ? 'index' : name) + '.' + ext);
      doCopy(dst, src, 'packages/' + name);
    }
  }
}

function copyScriptTemplates() {
  const dir = fs.opendirSync(
    basePath('..', 'reflect-server', 'out', 'script-templates'),
  );
  for (let file = dir.readSync(); file !== null; file = dir.readSync()) {
    const src = basePath(
      '..',
      'reflect-server',
      'out',
      'script-templates',
      file.name,
    );

    const dst = basePath('script-templates', file.name);
    doCopy(dst, src, 'packages/reflect-server');
  }
}

/**
 * @param {string} dst
 * @param {string} src
 * @param {string} name
 */
function doCopy(dst, src, name) {
  if (!fs.existsSync(src)) {
    console.error(
      `File does not exist: ${src}. Make sure to build ${name} first`,
    );
    process.exit(1);
  }
  const dstDir = path.dirname(dst);
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, {recursive: true});
  }
  fs.copyFileSync(src, dst);
}

/**
 * @param {string} sourceDirectory
 * @param {string} targetDirectory
 */
function copyFiles(sourceDirectory, targetDirectory) {
  fs.mkdirSync(targetDirectory, {recursive: true});
  const files = fs.readdirSync(sourceDirectory);
  for (const file of files) {
    const sourceFile = path.join(sourceDirectory, file);
    const targetFile = path.join(targetDirectory, file);
    fs.copyFileSync(sourceFile, targetFile);
  }
}

function copyReflectCLI() {
  const sourceDirectory = basePath('..', '..', 'mirror', 'reflect-cli', 'out');
  if (!fs.existsSync(sourceDirectory)) {
    console.error(
      `File does not exist: ${sourceDirectory}. Make sure to build mirror/reflect-cli first`,
    );
    process.exit(1);
  }

  const targetDirectory = basePath('bin');
  fs.rmSync(targetDirectory, {recursive: true, force: true});

  copyFiles(sourceDirectory, targetDirectory);

  const templateSrc = basePath(
    '..',
    '..',
    'mirror',
    'reflect-cli',
    'templates',
  );
  const templateDst = basePath('bin', 'templates');
  fs.cpSync(templateSrc, templateDst, {recursive: true});
}

/**
 * @return {string}
 */
function getReflectVersion() {
  const pkg = fs.readFileSync(basePath('package.json'), 'utf-8');
  return JSON.parse(pkg).version;
}

/**
 * @param {any[]} names
 * @returns {Promise<string[]>}
 */
async function getExternalForPackages(...names) {
  const externals = new Set();
  for (const name of names) {
    for (const dep of await getExternalFromPackageJSON(basePath('..', name))) {
      externals.add(dep);
    }
  }
  return [...externals];
}

async function buildPackages() {
  // let's just never minify for now, it's constantly getting in our and our
  // user's way. When we have an automated way to do both minified and non-
  // minified builds we can re-enable this.
  const minify = false;
  let shared = sharedOptions(minify, false);
  const define = makeDefine('unknown');

  fs.rmSync(basePath('out'), {recursive: true, force: true});

  const external = await getExternalForPackages(
    'reflect-server',
    'reflect-client',
    'reflect-shared',
  );
  external.push('replicache-react');

  await esbuild.build({
    ...shared,
    external,
    // Use neutral to remove the automatic define for process.env.NODE_ENV
    platform: 'neutral',
    define: {
      ...define,
      ['REFLECT_VERSION']: JSON.stringify(getReflectVersion()),
      ['TESTING']: 'false',
    },
    format: 'esm',
    entryPoints: [
      basePath('src', 'client.ts'),
      basePath('src', 'server.ts'),
      basePath('src', 'shared.ts'),
      basePath('src', 'react.ts'),
    ],
    bundle: true,
    outdir: 'out',
    splitting: true,
  });
}

await buildPackages();

copyDTSFilesFromPackages();

copyReflectCLI();

copyScriptTemplates();
