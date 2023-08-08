import type {Patch, NullableVersion} from 'reflect-protocol';
import type {DurableStorage} from '../storage/durable-storage.js';
import {
  decodeUserValueVersionKey,
  userValueKey,
  userValueSchema,
  userValueVersionIndexPrefix,
  userValueVersionInfoSchema,
  userValueVersionKey,
} from '../types/user-value.js';
import {compareVersions} from '../types/version.js';
import type {ListOptions} from '../storage/storage.js';
import {MAX_ENTRIES_TO_GET} from '../db/data.js';
import {must} from 'shared/src/must.js';
import type {LogContext} from '@rocicorp/logger';

export async function getPatches(
  lc: LogContext,
  storage: DurableStorage,
  versions: Set<NullableVersion>,
): Promise<Map<NullableVersion, Patch>> {
  if (versions.size === 0) {
    return new Map();
  }
  const sortedVersions = [...versions].sort(compareVersions);
  const earliestVersion = sortedVersions[0];
  const scanOptions: ListOptions = {prefix: userValueVersionIndexPrefix};
  if (earliestVersion !== null) {
    scanOptions.start = {key: userValueVersionKey('', earliestVersion + 1)};
  }

  const superPatch: Patch = [];
  const startingIndexes = new Map<NullableVersion, number>();

  // Compute the superPatch (the Patch starting after the earliest Version)
  // and starting indexes into the superPatch for each Version.
  for await (const batch of storage.batchScan(
    scanOptions,
    userValueVersionInfoSchema,
    MAX_ENTRIES_TO_GET,
  )) {
    // Fetch the values of all objects that were put().
    const putValues = await storage.getEntries(
      [...batch]
        .filter(([_, value]) => !value.deleted)
        .map(([key]) => userValueKey(decodeUserValueVersionKey(key).userKey)),
      userValueSchema,
    );
    for (const [indexKey, value] of batch) {
      const {userKey, version} = decodeUserValueVersionKey(indexKey);
      while (
        sortedVersions.length > 0 &&
        compareVersions(sortedVersions[0], version) < 0
      ) {
        // Note: sortedVersions.shift() will not return undefined because length > 0
        startingIndexes.set(sortedVersions.shift() ?? null, superPatch.length);
      }
      superPatch.push(
        value.deleted
          ? {
              op: 'del',
              key: userKey,
            }
          : {
              op: 'put',
              key: userKey,
              value: must(putValues.get(userValueKey(userKey))).value,
            },
      );
    }
  }
  lc.info?.(
    `Scanned ${superPatch.length} entries since version ${earliestVersion}`,
  );
  const patches = new Map(
    [...startingIndexes].map(([key, index]) => [key, superPatch.slice(index)]),
  );
  // For the null Version (i.e. starting from scratch), remove any 'del' PatchOps.
  const nullPatch = patches.get(null);
  if (nullPatch) {
    patches.set(
      null,
      nullPatch.filter(val => val.op === 'put'),
    );
  }
  // For any remaining versions, there are no patch ops.
  for (const v of sortedVersions) {
    patches.set(v, []);
  }
  return patches;
}
