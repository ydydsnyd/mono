/* eslint-disable @typescript-eslint/naming-convention */
import {cfFetch} from './cf-fetch.js';
import {CfModule, createWorkerUploadForm} from './create-worker-upload-form.js';
import {Migration, getMigrationsToUpload} from './get-migrations-to-upload.js';

type Config = {
  accountID: string;
  scriptName: string;
  apiToken: string;
};

export async function createWorker(
  {accountID, scriptName, apiToken}: Config,
  mainModule: CfModule,
  modules: CfModule[],
  // migrations: Migration[],
) {
  const cfMigrations = await getMigrationsToUpload(scriptName, apiToken, {
    accountId: accountID,
    config: {migrations},
    legacyEnv: false,
    env: undefined,
  });

  const form = createWorkerUploadForm({
    name: scriptName,
    main: mainModule, // await createCfModule('worker.js'),
    bindings: {
      durable_objects: {
        bindings: [
          {name: 'roomDO', class_name: 'RoomDO'},
          {name: 'authDO', class_name: 'AuthDO'},
        ],
      },
    },
    modules,
    migrations: cfMigrations,
    compatibility_date: '2023-05-18',
  });

  const resource = `/accounts/${accountID}/workers/scripts/${scriptName}`;
  const searchParams = new URLSearchParams({
    include_subdomain_availability: 'true',
    // pass excludeScript so the whole body of the
    // script doesn't get included in the response
    excludeScript: 'true',
  });
  await cfFetch(
    apiToken,
    resource,
    {
      method: 'PUT',
      body: form,
    },
    searchParams,
  );
}

export async function enableSubdomain(conf: Config) {
  const {accountID, scriptName, apiToken} = conf;
  const resource = `/accounts/${accountID}/workers/scripts/${scriptName}/subdomain`;

  await cfFetch(apiToken, resource, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({enabled: true}),
  });
}

// function basePath(...parts: string[]): string {
//   return path.join(
//     path.dirname(fileURLToPath(import.meta.url)),
//     '..',
//     ...parts,
//   );
// }

// function distPath(fileName: string): string {
//   return basePath('dist', fileName);
// }

// const fileNames = [
//   'customer.js',
//   'customer.js.map',
//   'reflect-server.js',
//   'reflect-server.js.map',
//   'worker.js',
//   'worker.js.map',
// ];

const migrations: Migration[] = [
  {
    tag: 'v1',
    new_classes: ['RoomDO', 'AuthDO'],
  },
];

// async function createCfModule(fileName: string): Promise<CfModule> {
//   return {
//     name: fileName,
//     content: await fs.readFile(distPath(fileName), 'utf-8'),
//     type: fileName.endsWith('.js.map') ? 'text' : 'esm',
//   };
// }

// const modules: CfModule[] = await Promise.all(fileNames.map(createCfModule));
// await createWorker(modules, migrations);

// await enableSubdomain(config);

// console.log(`https://${scriptName}.replicache.workers.dev/`);

const mainModuleContent = `
import {createReflectServer} from './server.js';
import {default as makeOptions} from './app.js';
const {worker, RoomDO, AuthDO} = createReflectServer(makeOptions);
export {worker as default, RoomDO, AuthDO};
`;

const serverContent = `
export function createReflectServer(makeOptions) {
}
`;

export async function publish(
  config: Config,
  sourceModule: CfModule,
  sourcemapModule: CfModule,
  appName: string,
) {
  console.log('publishing', appName);
  const mainModule = {
    name: 'worker.js',
    content: mainModuleContent,
    type: 'esm',
  } as const;
  const serverModule = {
    name: 'server.js',
    content: serverContent,
    type: 'esm',
  } as const;
  const modules: CfModule[] = [sourceModule, sourcemapModule, serverModule];
  await createWorker(config, mainModule, modules);
  await enableSubdomain(config);
  console.log(`https://${appName}.replicache.workers.dev/`);
}
