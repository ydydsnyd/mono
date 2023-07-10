import type {Firestore} from 'firebase-admin/firestore';
import type {Storage} from 'firebase-admin/storage';
import assert from 'node:assert';
import {cfFetch} from './cf-fetch.js';
import {CfModule, createWorkerUploadForm} from './create-worker-upload-form.js';
import {Migration, getMigrationsToUpload} from './get-migrations-to-upload.js';
import {getServerModules} from './get-server-modules.js';
import {publishCustomDomains} from './publish-custom-domains.js';

type Config = {
  accountID: string;
  scriptName: string;
  apiToken: string;
};

export async function createWorker(
  {accountID, scriptName, apiToken}: Config,
  mainModule: CfModule,
  modules: CfModule[],
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
      // eslint-disable-next-line @typescript-eslint/naming-convention
      durable_objects: {
        bindings: [
          // eslint-disable-next-line @typescript-eslint/naming-convention
          {name: 'roomDO', class_name: 'RoomDO'},
          // eslint-disable-next-line @typescript-eslint/naming-convention
          {name: 'authDO', class_name: 'AuthDO'},
        ],
      },
    },
    modules,
    migrations: cfMigrations,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    compatibility_date: '2023-05-18',
  });

  const resource = `/accounts/${accountID}/workers/scripts/${scriptName}`;
  const searchParams = new URLSearchParams({
    // eslint-disable-next-line @typescript-eslint/naming-convention
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

const migrations: Migration[] = [
  {
    tag: 'v1',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    new_classes: ['RoomDO', 'AuthDO'],
  },
];

function assertAllModulesHaveUniqueNames(modules: Iterable<CfModule>) {
  const names = new Set<string>();
  for (const m of modules) {
    assert(!names.has(m.name), `Duplicate module name: ${m.name}`);
    names.add(m.name);
  }
}

export async function publish(
  firestore: Firestore,
  storage: Storage,
  config: Config,
  appModule: CfModule,
  appSourcemapModule: CfModule,
  appName: string,
  version: string,
) {
  console.log('publishing', appName);

  const [serverModule, ...otherServerModules] = await getServerModules(
    firestore,
    storage,
    version,
  );

  let workerModule: CfModule | undefined;
  const otherModules: CfModule[] = [];
  for (const m of otherServerModules) {
    if (m.name === 'worker.template.js') {
      const content = m.content
        .replaceAll('<REFLECT_SERVER>', serverModule.name)
        .replaceAll('<APP>', appModule.name);
      workerModule = {content, name: 'worker.js', type: 'esm'};
    } else {
      otherModules.push(m);
    }
  }
  assert(workerModule);

  const modules: CfModule[] = [
    appModule,
    appSourcemapModule,
    serverModule,
    ...otherModules,
  ];

  // Make sure that all the names are unique.
  assertAllModulesHaveUniqueNames([workerModule, ...modules]);

  console.log('publishing', appName);
  await createWorker(config, workerModule, modules);

  console.log('Setting up custom domain');
  await publishCustomDomains(config, `${appName}.reflect-server.net`);
}
