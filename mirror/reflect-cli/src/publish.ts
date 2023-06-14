import type {PublishRequest} from 'mirror-protocol';
import {existsSync} from 'node:fs';
import * as path from 'node:path';
import {assert} from 'shared/asserts.js';
import {compile} from './compile.js';
import {makeRequester} from './requester.js';
import type {CommonYargsArgv, YargvToInterface} from './yarg-types.js';

export function publishOptions(yargs: CommonYargsArgv) {
  return yargs
    .option('name', {
      describe: 'Name of the worker',
      type: 'string',
    })
    .positional('script', {
      describe: 'Path to the worker script',
      type: 'string',
      demandOption: true,
      requiresArg: true,
    });
}

export async function publishHandler(
  yargs: YargvToInterface<ReturnType<typeof publishOptions>>,
) {
  const {script, name} = yargs;

  // const filename = path.basename(script);
  const absPath = path.resolve(script);

  if (!existsSync(absPath)) {
    throw new Error(`File not found: ${absPath}`);
  }

  const {code, sourcemap} = await compile(absPath);

  yargs.name ??= 'customer';

  const formData = new FormData();
  formData.append(
    'bundle',
    new Blob([code.contents]),
    path.basename(code.path),
  );
  formData.append(
    'sourcemap',
    new Blob([sourcemap.contents]),
    path.basename(sourcemap.path),
  );
  if (name !== undefined) {
    formData.append('name', name);
  }

  assert(name, 'Name is required');

  // TODO(arv): Implement userID
  const userID = 'USERID';

  const data: PublishRequest = {
    name,
    source: {
      content: code.text,
      name: path.basename(code.path),
    },
    sourcemap: {
      content: sourcemap.text,
      name: path.basename(sourcemap.path),
    },
    requester: makeRequester(userID),
  };

  const body = JSON.stringify(data);

  await fetch(
    `http://127.0.0.1:5001/reflect-mirror-staging/us-central1/publish`,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body,
    },
  );
}
