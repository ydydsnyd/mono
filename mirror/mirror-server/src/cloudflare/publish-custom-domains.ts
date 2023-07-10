// Original file was here:
// https://github.com/cloudflare/workers-sdk/blob/a728876e607635081cd1ed00d06b7af86e7efd49/packages/wrangler/src/deploy/deploy.ts#L170

import {cfFetch} from './cf-fetch.js';

// publishing to custom domains involves a few more steps than just updating
// the routing table, and thus the api implementing it is fairly defensive -
// it will error eagerly on conflicts against existing domains or existing
// managed DNS records

// however, you can pass params to override the errors. to know if we should
// override the current state, we generate a "changeset" of required actions
// to get to the state we want (specified by the list of custom domains). the
// changeset returns an "updated" collection (existing custom domains
// connected to other scripts) and a "conflicting" collection (the requested
// custom domains that have a managed, conflicting DNS record preventing the
// host's use as a custom domain). with this information, we can prompt to
// the user what will occur if we create the custom domains requested, and
// add the override param if they confirm the action
//
// if a user does not confirm that they want to override, we skip publishing
// to these custom domains, but continue on through the rest of the
// deploy stage
export async function publishCustomDomains(
  {
    apiToken,
    scriptName,
    accountID,
  }: {apiToken: string; scriptName: string; accountID: string},

  hostname: string,
): Promise<void> {
  // NOTE: The original file allowed an interactive mode if the terminal was a TTY.
  // We remove that to simplify the code.

  // running in non-interactive mode.
  // existing origins / dns records are not indicative of errors,
  // so we aggressively update rather than aggressively fail

  /* eslint-disable @typescript-eslint/naming-convention */
  const config = {
    override_scope: true,
    override_existing_origin: true,
    override_existing_dns_record: true,
    origins: [{hostname}],
  };
  /* eslint-enable @typescript-eslint/naming-convention */

  // deploy to domains
  await cfFetch(
    apiToken,
    `/accounts/${accountID}/workers/scripts/${scriptName}/domains/records`,
    {
      method: 'PUT',
      body: JSON.stringify(config),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}
