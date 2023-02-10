import * as kv from '../kv/mod.js';
import * as dag from '../dag/mod.js';
import {ClientMap, getClients} from './clients.js';
import {dropStore} from '../kv/idb-util.js';
import {IDBDatabasesStore} from './idb-databases-store.js';
import type {IndexedDBDatabase} from './idb-databases-store.js';
import {initBgIntervalProcess} from '../bg-interval.js';
import type {LogContext} from '@rocicorp/logger';
import {
  REPLICACHE_FORMAT_VERSION,
  REPLICACHE_FORMAT_VERSION_DD31,
} from '../replicache.js';
import {assertHash} from '../hash.js';
import {
  clientGroupHasPendingMutations,
  getClientGroups,
} from './client-groups.js';
import {assert} from '../asserts.js';

// How frequently to try to collect
const COLLECT_INTERVAL_MS = 12 * 60 * 60 * 1000; // 12 hours

// If an IDB database is older than MAX_AGE, then it can be collected.
const MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 1 month

// If an IDB database is older than DD31_MAX_AGE **and** has no pending
// mutations, then it can be collected.
const DD31_MAX_AGE = 14 * 24 * 60 * 60 * 1000; // 2 weeks

// We delay the initial collection to prevent doing it at startup.
const COLLECT_DELAY = 5 * 60 * 1000; // 5 minutes

export function initCollectIDBDatabases(
  idbDatabasesStore: IDBDatabasesStore,
  lc: LogContext,
  signal: AbortSignal,
): void {
  let initial = true;
  initBgIntervalProcess(
    'CollectIDBDatabases',
    async () => {
      await collectIDBDatabases(
        idbDatabasesStore,
        signal,
        Date.now(),
        MAX_AGE,
        DD31_MAX_AGE,
      );
    },
    () => {
      if (initial) {
        initial = false;
        return COLLECT_DELAY;
      }
      return COLLECT_INTERVAL_MS;
    },
    lc,
    signal,
  );
}

export async function collectIDBDatabases(
  idbDatabasesStore: IDBDatabasesStore,
  signal: AbortSignal,
  now: number,
  maxAge: number,
  dd31MaxAge: number,
  newDagStore = defaultNewDagStore,
): Promise<void> {
  const databases = await idbDatabasesStore.getDatabases();

  const dbs = Object.values(databases) as IndexedDBDatabase[];
  const canCollectResults = await Promise.all(
    dbs.map(
      async db =>
        [
          db.name,
          await canCollectDatabase(db, now, maxAge, dd31MaxAge, newDagStore),
        ] as const,
    ),
  );

  const namesToRemove = canCollectResults
    .filter(result => result[1])
    .map(result => result[0]);

  const {errors} = await dropDatabases(
    idbDatabasesStore,
    namesToRemove,
    signal,
  );

  if (errors.length) {
    throw errors[0];
  }
}

async function dropDatabases(
  idbDatabasesStore: IDBDatabasesStore,
  namesToRemove: string[],
  signal?: AbortSignal,
): Promise<{dropped: string[]; errors: unknown[]}> {
  // Try to remove the databases in parallel. Don't let a single reject fail the
  // other ones. We will check for failures afterwards.
  const dropStoreResults = await Promise.allSettled(
    namesToRemove.map(async name => {
      await dropStore(name);
      return name;
    }),
  );

  const dropped: string[] = [];
  const errors: unknown[] = [];
  for (const result of dropStoreResults) {
    if (result.status === 'fulfilled') {
      dropped.push(result.value);
    } else {
      errors.push(result.reason);
    }
  }

  if (dropped.length && !signal?.aborted) {
    // Remove the database name from the meta table.
    await idbDatabasesStore.deleteDatabases(dropped);
  }

  return {dropped, errors};
}

function defaultNewDagStore(name: string): dag.Store {
  const perKvStore = new kv.IDBStore(name);
  return new dag.StoreImpl(perKvStore, dag.uuidChunkHasher, assertHash);
}

async function canCollectDatabase(
  db: IndexedDBDatabase,
  now: number,
  maxAge: number,
  dd31MaxAge: number,
  newDagStore: typeof defaultNewDagStore,
): Promise<boolean> {
  if (db.replicacheFormatVersion > REPLICACHE_FORMAT_VERSION) {
    return false;
  }

  // 0 is used in testing
  if (db.lastOpenedTimestampMS !== undefined) {
    const isDd31 = db.replicacheFormatVersion >= REPLICACHE_FORMAT_VERSION_DD31;

    // - For SDD we can delete the database if it is older than maxAge.
    // - For DD31 we can delete the database if it is older than dd31MaxAge and
    //   there are no pending mutations.
    if (now - db.lastOpenedTimestampMS < (isDd31 ? dd31MaxAge : maxAge)) {
      return false;
    }

    if (!isDd31) {
      return true;
    }

    // If increase the format version we need to decide how to deal with this
    // logic.
    assert(db.replicacheFormatVersion === REPLICACHE_FORMAT_VERSION_DD31);
    return !(await anyPendingMutationsInClientGroups(newDagStore(db.name)));
  }

  // For legacy databases we do not have a lastOpenedTimestampMS so we check the
  // time stamps of the clients
  const perdag = newDagStore(db.name);
  const clientMap = await perdag.withRead(getClients);
  await perdag.close();

  return allClientsOlderThan(clientMap, now, maxAge);
}

function allClientsOlderThan(
  clients: ClientMap,
  now: number,
  maxAge: number,
): boolean {
  for (const client of clients.values()) {
    if (now - client.heartbeatTimestampMs < maxAge) {
      return false;
    }
  }
  return true;
}

/**
 * Deletes all IndexedDB data associated with Replicache.
 *
 * Returns an object with the names of the successfully dropped databases
 * and any errors encountered while dropping.
 */
export async function deleteAllReplicacheData(
  createKVStore: kv.CreateStore,
): Promise<{
  dropped: string[];
  errors: unknown[];
}> {
  const store = new IDBDatabasesStore(createKVStore);
  const databases = await store.getDatabases();
  const dbNames = Object.values(databases).map(db => db.name);

  const result = await dropDatabases(store, dbNames);

  if (result.dropped.length) {
    await store.deleteDatabases(result.dropped);
  }

  return result;
}

async function anyPendingMutationsInClientGroups(
  perdag: dag.Store,
): Promise<boolean> {
  const clientGroups = await perdag.withRead(getClientGroups);
  for (const clientGroup of clientGroups.values()) {
    if (clientGroupHasPendingMutations(clientGroup)) {
      return true;
    }
  }
  return false;
}
