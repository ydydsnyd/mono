import {doc, getDoc, getFirestore} from 'firebase/firestore';
import {ensureUser} from 'mirror-protocol/src/user.js';
import color from 'picocolors';
import {
  appPath,
  AppView,
  appViewDataConverter,
} from 'mirror-schema/src/external/app.js';
import type {DeploymentView} from 'mirror-schema/src/external/deployment.js';
import {readAppConfig} from './app-config.js';
import type {CommonYargsArgv, YargvToInterface} from './yarg-types.js';
import type {AuthContext} from './handler.js';

export async function statusHandler(
  _yargs: YargvToInterface<CommonYargsArgv>,
  authContext: AuthContext,
): Promise<void> {
  await ensureUser({requester: authContext.requester});

  const firestore = getFirestore();
  const config = readAppConfig();
  const appID = config?.apps?.default?.appID;

  if (!appID) {
    return displayStatus();
  }

  const appView = (
    await getDoc(
      doc(firestore, appPath(appID)).withConverter(appViewDataConverter),
    )
  ).data();

  displayStatus(appID, appView);
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
