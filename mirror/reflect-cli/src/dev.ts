import isPortReachable from 'is-port-reachable';
import assert from 'node:assert';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import {mustReadAppConfig} from './app-config.js';
import {watch} from './compile.js';
import type {DevHandlerArgs} from './dev-options.js';
import {startDevServer} from './dev/start-dev-server.js';
import {logErrorAndExit} from './log-error-and-exit.js';

async function exists(path: string) {
  try {
    await fs.stat(path);
    return true;
  } catch {
    return false;
  }
}

export async function devHandler(yargs: DevHandlerArgs) {
  const {server: script} = mustReadAppConfig();

  const absPath = path.resolve(script);
  if (!(await exists(absPath))) {
    logErrorAndExit(`File not found: ${absPath}`);
  }

  const {port, silenceStartupMessage} = yargs;
  if (await isPortReachable(port, {host: '0.0.0.0'})) {
    logErrorAndExit(`Port ${port} is already in use`);
  }

  let first = true;
  const ac = new AbortController();
  let mfAc: AbortController | undefined;
  const mode = 'development';
  for await (const {code, sourcemap} of watch(
    absPath,
    'linked',
    mode,
    ac.signal,
  )) {
    assert(sourcemap);
    const start = Date.now();
    process.stdout.write(
      (first ? 'Starting' : 'Restarting') + ' dev server...',
    );

    mfAc?.abort();
    mfAc = new AbortController();

    const {href} = await startDevServer(
      code,
      sourcemap,
      port,
      mode,
      mfAc.signal,
    );
    process.stdout.write(` Done in ${Date.now() - start}ms.\n`);
    if (first && !silenceStartupMessage) {
      console.log(`
Dev server running at:
  ${href}
`);

      first = false;
    }
  }

  mfAc?.abort();
}
