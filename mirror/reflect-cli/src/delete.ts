import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  Firestore,
  query,
  where,
} from 'firebase/firestore';
import {deleteApp} from 'mirror-protocol/src/app.js';
import {
  APP_COLLECTION,
  appViewDataConverter,
  appPath,
} from 'mirror-schema/src/external/app.js';
import {deploymentViewDataConverter} from 'mirror-schema/src/external/deployment.js';
import {
  userViewDataConverter,
  userPath,
} from 'mirror-schema/src/external/user.js';
import {watchDoc} from 'mirror-schema/src/external/watch.js';
import {must} from 'shared/src/must.js';
import {readAppConfig, writeAppConfig} from './app-config.js';
import {authenticate} from './auth-config.js';
import {checkbox} from './inquirer.js';
import {logErrorAndExit} from './log-error-and-exit.js';
import {makeRequester} from './requester.js';
import type {CommonYargsArgv, YargvToInterface} from './yarg-types.js';

export function deleteOptions(yargs: CommonYargsArgv) {
  return yargs
    .option('name', {
      describe: 'Name of the app to delete',
      type: 'string',
      conflicts: ['appID', 'all'],
    })
    .option('appID', {
      describe: 'Internal ID of the app',
      type: 'string',
      conflicts: ['all', 'name'],
      hidden: true,
    })
    .option('all', {
      describe:
        'Delete all of your apps, confirming for each one (unless --force is specified)',
      type: 'boolean',
      conflicts: ['name', 'appID'],
    })
    .option('force', {
      describe: 'Suppress the confirmation prompt',
      type: 'boolean',
      alias: 'f',
      default: false,
    });
}

type DeleteHandlerArgs = YargvToInterface<ReturnType<typeof deleteOptions>>;

export async function deleteHandler(yargs: DeleteHandlerArgs) {
  const firestore = getFirestore();
  const {userID} = await authenticate(yargs);
  const apps = await getAppsToDelete(firestore, userID, yargs);
  let selectedApps = [];
  if (apps.length > 1) {
    selectedApps = await checkbox({
      message: `Select the apps and associated data to delete:`,
      choices: apps.map(app => ({name: app.name, value: app})),
    });
  } else {
    selectedApps = apps;
  }
  for (const app of selectedApps) {
    console.info(`Requesting delete of "${app.name}"`);
    const {deploymentPath} = await deleteApp({
      requester: makeRequester(userID),
      appID: app.id,
    });

    const deploymentDoc = doc(firestore, deploymentPath).withConverter(
      deploymentViewDataConverter,
    );

    try {
      for await (const snapshot of watchDoc(deploymentDoc)) {
        const deployment = snapshot.data();
        if (!deployment) {
          // Happens if requested by a superAdmin that has permission to read any doc.
          console.info(`"${app.name}" successfully deleted`);
          break;
        }
        const {status, statusMessage: msg} = deployment;
        console.info(
          `Status: ${status === 'DEPLOYING' ? 'DELETING' : status}${
            msg ? ': ' + msg : ''
          }`,
        );
        if (deployment.status === 'FAILED' || deployment.status === 'STOPPED') {
          break;
        }
      }
    } catch (e) {
      // Once the App doc is deleted, security rules bar the user from accessing the
      // deployment doc, which results in a 'permission-denied' error. Assume this to
      // mean that the App was successfully deleted.
      if ((e as unknown as {code?: unknown}).code === 'permission-denied') {
        console.info(`"${app.name}" successfully deleted`);
      } else {
        throw e;
      }
    }
    if (app.fromAppConfig) {
      const config = readAppConfig();
      if (config?.apps?.default) {
        delete config.apps.default;
        writeAppConfig(config);
      }
    }
  }
}

type AppInfo = {
  id: string;
  name: string;
  fromAppConfig?: boolean | undefined;
};

async function getAppsToDelete(
  firestore: Firestore,
  userID: string,
  yargs: DeleteHandlerArgs,
): Promise<AppInfo[]> {
  const {appID, name, all} = yargs;
  if (appID) {
    return getApp(firestore, appID);
  }
  if (all || name) {
    const teamID = await getSingleAdminTeam(firestore, userID);
    let q = query(
      collection(firestore, APP_COLLECTION).withConverter(appViewDataConverter),
      where('teamID', '==', teamID),
    );
    if (name) {
      q = query(q, where('name', '==', name));
    }
    const apps = await getDocs(q);
    return apps.docs.map(doc => ({id: doc.id, name: doc.data().name}));
  }
  const config = readAppConfig();
  const defaultAppID = config?.apps?.default?.appID;
  if (defaultAppID) {
    return getApp(firestore, defaultAppID, true);
  }
  logErrorAndExit(
    'Missing reflect.config.json Could not determine App to delete.',
  );
}

async function getApp(
  firestore: Firestore,
  id: string,
  fromAppConfig?: boolean,
): Promise<AppInfo[]> {
  const appDoc = await getDoc(
    doc(firestore, appPath(id)).withConverter(appViewDataConverter),
  );
  if (!appDoc.exists()) {
    throw new Error(`App is already deleted`);
  }
  const {name} = must(appDoc.data());
  return [{id, name, fromAppConfig}];
}

async function getSingleAdminTeam(
  firestore: Firestore,
  userID: string,
): Promise<string> {
  const userDoc = await getDoc(
    doc(firestore, userPath(userID)).withConverter(userViewDataConverter),
  );
  if (!userDoc.exists()) {
    throw new Error('UserDoc does not exist.');
  }
  const {roles} = must(userDoc.data());
  const adminTeams = Object.entries(roles)
    .filter(([_, role]) => role === 'admin')
    .map(([teamID]) => teamID);
  switch (adminTeams.length) {
    case 0:
      throw new Error('You are not an admin of any teams');
    case 1:
      return adminTeams[0];
    default:
      throw new Error(
        'This version of @rocicorp/reflect does not support multiple teams. Please update to the latest version.',
      );
  }
}
