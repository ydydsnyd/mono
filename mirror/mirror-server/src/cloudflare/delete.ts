import {logger} from 'firebase-functions';
import {NamespacedScript, type Script} from 'cloudflare-api/src/scripts.js';
import {Errors, FetchResultError} from 'cloudflare-api/src/fetch.js';
import {deleteCustomHostnames} from './publish-custom-hostnames.js';
import type {ZoneConfig} from './config.js';

export async function deleteScript(
  script: Script,
  zone: ZoneConfig,
): Promise<void> {
  try {
    await script.delete(new URLSearchParams({force: 'true'}));
  } catch (e) {
    FetchResultError.throwIfCodeIsNot(
      e,
      Errors.ScriptNotFound,
      Errors.CouldNotRouteToScript,
    );
  }
  // For GlobalScripts, Custom Domains are automatically cleaned up when deleting
  // the worker. For WFP NamespacedScripts, Custom Hostnames are not explicitly
  // coupled to the worker, and instead must be cleaned up with our own bookkeeping.
  if (script instanceof NamespacedScript) {
    await deleteCustomHostnames(zone, script);
  }
  logger.info(`Deleted script ${script.id}`);
}
