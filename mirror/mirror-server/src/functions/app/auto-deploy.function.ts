import {Timestamp, type Firestore} from 'firebase-admin/firestore';
import {logger} from 'firebase-functions';
import {onDocumentUpdated} from 'firebase-functions/v2/firestore';
import {HttpsError} from 'firebase-functions/v2/https';
import _ from 'lodash';
import {App, appDataConverter} from 'mirror-schema/src/app.js';
import {
  DeploymentSpec,
  DeploymentType,
  deploymentsCollection,
} from 'mirror-schema/src/deployment.js';
import {
  SecretsCache,
  type Secrets,
  type SecretsClient,
} from '../../secrets/index.js';
import {requestDeployment} from './deploy.function.js';
import {computeDeploymentSpec} from './publish.function.js';
import {DEPLOYMENT_SECRETS_NAMES} from './secrets.js';

export const autoDeploy = (
  firestore: Firestore,
  secretsClient: SecretsClient,
) =>
  onDocumentUpdated(
    {
      document: 'apps/{appID}',
      secrets: [...DEPLOYMENT_SECRETS_NAMES],
    },
    async event => {
      const secrets = new SecretsCache(secretsClient);
      if (!event.data) {
        throw new Error(
          `Missing event.data for ${JSON.stringify(event.params)}`,
        );
      }
      const {appID} = event.params;
      const app = appDataConverter.fromFirestore(event.data.after);

      await checkForAutoDeployment(
        firestore,
        secrets,
        appID,
        app,
        event.data.after.updateTime,
      );
    },
  );

export const MIRROR_SERVER_REQUESTER_ID = 'mirror-server';
export const MAX_AUTO_DEPLOYMENTS_PER_MINUTE = 4;

export async function checkForAutoDeployment(
  firestore: Firestore,
  secrets: Secrets,
  appID: string,
  app: App,
  lastAppUpdateTime: Timestamp,
): Promise<void> {
  if (!app.runningDeployment || app.queuedDeploymentIDs?.length) {
    // If deployments are queued, there's nothing to check. Once all of the deployments
    // finish, the resulting update will trigger a check with the final runningDeployment.
    return;
  }
  const desiredSpec = await computeDeploymentSpec(
    firestore,
    secrets,
    app,
    app.runningDeployment.spec.serverVersionRange,
  );
  const autoDeploymentType = getAutoDeploymentType(
    app.runningDeployment.spec,
    desiredSpec,
    app.forceRedeployment,
  );
  if (!autoDeploymentType) {
    return;
  }

  // Sanity check: Protect against pathological auto-deploy loops by short-circuiting
  // if there are too many auto-deploy's in the last minute.
  const recentAutoDeploys = await firestore
    .collection(deploymentsCollection(appID))
    .where('requesterID', '==', MIRROR_SERVER_REQUESTER_ID)
    .where('requestTime', '>=', Timestamp.fromMillis(Date.now() - 1000 * 60))
    .count()
    .get();
  if (recentAutoDeploys.data().count > MAX_AUTO_DEPLOYMENTS_PER_MINUTE) {
    throw new HttpsError(
      'resource-exhausted',
      `Already reached ${MAX_AUTO_DEPLOYMENTS_PER_MINUTE} deployments per minute. Check for a redeployment loop!`,
    );
  }

  logger.info(`Requesting ${autoDeploymentType}`, desiredSpec);
  await requestDeployment(
    firestore,
    appID,
    {
      requesterID: MIRROR_SERVER_REQUESTER_ID,
      type: autoDeploymentType,
      spec: {
        ...app.runningDeployment.spec,
        ...desiredSpec,
      },
    },
    undefined,
    lastAppUpdateTime,
  );
}

export function getAutoDeploymentType(
  current: Pick<
    DeploymentSpec,
    'serverVersion' | 'options' | 'hashesOfSecrets' | 'hostname'
  >,
  desired: Pick<
    DeploymentSpec,
    'serverVersion' | 'options' | 'hashesOfSecrets' | 'hostname'
  >,
  forceRedeployment: boolean | undefined,
): DeploymentType | undefined {
  if (current.serverVersion !== desired.serverVersion) {
    return 'SERVER_UPDATE';
  }
  if (!_.isEqual(current.options, desired.options)) {
    return 'OPTIONS_UPDATE';
  }
  if (!_.isEqual(current.hashesOfSecrets, desired.hashesOfSecrets)) {
    return 'SECRETS_UPDATE';
  }
  if (!_.isEqual(current.hostname, desired.hostname)) {
    return 'HOSTNAME_UPDATE';
  }
  if (forceRedeployment) {
    return 'MAINTENANCE_UPDATE';
  }
  return undefined;
}
