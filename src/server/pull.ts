import {compareVersions, getVersion} from '../types/version';
import type {PullRequest, PullResponse} from '../protocol/pull';
import {listClientRecords} from '../types/client-record';
import type {DurableStorage} from '../storage/durable-storage';
import type {ClientID} from '../types/client-state';

export async function handlePull(
  storage: DurableStorage,
  pullRequest: PullRequest,
): Promise<PullResponse> {
  const {clientGroupID, cookie} = pullRequest;
  const records = await listClientRecords(storage);
  const lastMutationIDChanges: Record<ClientID, number> = {};
  for (const [clientID, record] of records) {
    if (
      record.clientGroupID === clientGroupID &&
      record.lastMutationIDVersion !== null &&
      compareVersions(cookie, record.lastMutationIDVersion) < 0
    ) {
      lastMutationIDChanges[clientID] = record.lastMutationID;
    }
  }
  const version = await getVersion(storage);
  const pullResponse: PullResponse = {
    cookie: version || 0,
    lastMutationIDChanges,
    // Pull is only used for mutation recovery which does not use
    // the patch so we save work by not computing the patch.
    patch: [],
  };
  return pullResponse;
}
