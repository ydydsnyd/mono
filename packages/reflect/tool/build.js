// @ts-check

import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';

/** @param {string[]} parts */
function basePath(...parts) {
  return path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    ...parts,
  );
}

function copyPackages() {
  for (const name of ['client', 'server', 'shared']) {
    for (const ext of ['js', 'd.ts', 'js.map']) {
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

function copyReflectCLI() {
  const binDir = basePath('bin');
  fs.rmSync(binDir, {recursive: true, force: true});
  const src = basePath('..', '..', 'mirror', 'reflect-cli', 'out', 'index.mjs');
  const dst = basePath('bin/cli.js');
  doCopy(dst, src, 'mirror/reflect-cli');
  const templateSrc = basePath('..', '..', 'mirror', 'reflect-cli', 'template');
  const templateDst = basePath('bin', 'template');
  fs.cpSync(templateSrc, templateDst, {recursive: true});
}

copyPackages();

copyReflectCLI();

copyScriptTemplates();
