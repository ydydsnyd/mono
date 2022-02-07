import { EntryCache } from "../storage/entry-cache.js";
import { unwrapPatch } from "../storage/replicache-transaction.js";
import type { Storage } from "../storage/storage.js";
import type { ClientMutation } from "../types/client-mutation.js";
import type { ClientPokeBody } from "../types/client-poke-body.js";
import { getClientRecord, putClientRecord } from "../types/client-record.js";
import type { ClientID } from "../types/client-state.js";
import { getVersion } from "../types/version.js";
import type { LogContext } from "../util/logger.js";
import { must } from "../util/must.js";
import { MutatorMap, processMutation } from "./process-mutation.js";
//import { GapTracker } from "../util/gap-tracker.js";

//const tracker = new GapTracker("processFrame", new LogContext("debug"));

// Processes zero or more mutations as a single "frame", returning pokes.
// Pokes are returned if the version changes, even if there is no patch,
// because we need clients to be in sync with server version so that pokes
// can continue to apply.
export async function processFrame(
  lc: LogContext,
  mutations: Iterable<ClientMutation>,
  mutators: MutatorMap,
  clients: ClientID[],
  storage: Storage,
  timestamp: number
): Promise<ClientPokeBody[]> {
  lc.debug?.("processing frame - clients", clients);

  const cache = new EntryCache(storage);
  const prevVersion = must(await getVersion(cache));
  const nextVersion = (prevVersion ?? 0) + 1;

  lc.debug?.("prevVersion", prevVersion, "nextVersion", nextVersion);

  for (const mutation of mutations) {
    await processMutation(lc, mutation, mutators, cache, nextVersion);
  }

  if (must(await getVersion(cache)) === prevVersion) {
    lc.debug?.("no change in frame, skipping poke");
    return [];
  }

  //tracker.push(startTime);

  const patch = unwrapPatch(cache.pending());
  const ret: ClientPokeBody[] = [];
  for (const clientID of clients) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const clientRecord = (await getClientRecord(clientID, cache))!;
    clientRecord.baseCookie = nextVersion;
    await putClientRecord(clientID, clientRecord, cache);

    const poke: ClientPokeBody = {
      clientID,
      poke: {
        baseCookie: prevVersion,
        cookie: nextVersion,
        lastMutationID: clientRecord.lastMutationID,
        patch,
        timestamp,
      },
    };
    ret.push(poke);
  }

  await cache.flush();
  return ret;
}
