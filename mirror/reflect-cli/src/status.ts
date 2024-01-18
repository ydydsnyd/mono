import {doc, getDoc, getFirestore} from 'firebase/firestore';
import {
  AppView,
  appPath,
  appViewDataConverter,
} from 'mirror-schema/src/external/app.js';

import type {DeploymentView} from 'mirror-schema/src/external/deployment.js';
import color from 'picocolors';
import type {CommonYargsArgv, YargvToInterface} from './yarg-types.js';
import type {AuthContext} from './handler.js';
import {getAppsByTeamAndName} from './firestore-query.js';

export async function statusHandler(
  _yargs: YargvToInterface<CommonYargsArgv>,
  authContext: AuthContext,
): Promise<void> {
  const firestore = getFirestore();
  const apps = await getAppsByTeamAndName(firestore, authContext.user.userID);

  if (apps.length === 0) {
    console.log('No apps found.');
    return;
  }

  for (const app of apps) {
    const appView = (
      await getDoc(
        doc(firestore, appPath(app.id)).withConverter(appViewDataConverter),
      )
    ).data();
    await displayStatus(app.id, appView);
  }
}

function displayStatus(appID?: string, appView?: AppView): void {
  const getStatusText = (label: string, value: string | undefined): string =>
    color.green(`${label}: `) +
    color.reset(value ? value : color.red('Unknown'));

  console.log(`-------------------------------------------------`);
  const lines: [string, string | undefined][] = appView?.name
    ? [
        ['App', appView?.name],
        ['ID', appID],
        ['Status', getDeploymentStatus(appView?.runningDeployment)],
        ['Hostname', appView?.runningDeployment?.spec.hostname],
        ['Server Version', appView?.runningDeployment?.spec.serverVersion],
      ]
    : [['App', undefined]];

  const maxLabelLen = Math.max(...lines.map(l => l[0].length));
  const pad = ' ';
  for (const [label, value] of lines) {
    console.log(
      getStatusText(label + pad.repeat(maxLabelLen - label.length), value),
    );
  }
  console.log(`-------------------------------------------------`);
}

function getDeploymentStatus(deployment?: DeploymentView): string {
  switch (deployment?.status) {
    case 'RUNNING':
      return `${deployment?.status}🏃`;
    case undefined:
      return 'Awaiting first publish';
  }
  return deployment?.statusMessage
    ? `${deployment?.status}: ${deployment?.statusMessage}`
    : `${deployment?.status}`;
}
