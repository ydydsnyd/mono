import {LogContext} from '@rocicorp/logger';
import {expect} from '@esm-bundle/chai';
import type * as dag from '../dag/mod';
import {
  Commit,
  DEFAULT_HEAD_NAME,
  fromHead,
  IndexRecord,
  Meta,
  MetaType,
} from './commit';
import {readCommit, whenceHead} from './read';
import {
  Write,
  readIndexesForWrite,
  newWriteSnapshot,
  newWriteSnapshotDD31,
  newWriteLocal,
  newWriteIndexChange,
  createIndexBTree,
} from './write';
import type {JSONValue} from '../json';
import {toInternalValue, ToInternalValueReason} from '../internal-value.js';
import type {ClientID} from '../sync/client-id.js';
import {emptyHash, Hash} from '../hash.js';
import {BTreeRead, BTreeWrite} from '../btree/mod.js';
import type {IndexDefinition, IndexDefinitions} from '../index-defs.js';
import {IndexWrite} from './index.js';

export type Chain = Commit<Meta>[];

export async function addGenesis(
  chain: Chain,
  store: dag.Store,
  clientID: ClientID,
): Promise<Chain> {
  expect(chain).to.have.length(0);
  const commit = await createGenesis(store, clientID);
  chain.push(commit);
  return chain;
}

export async function createGenesis(
  store: dag.Store,
  clientID: ClientID,
): Promise<Commit<Meta>> {
  await store.withWrite(async w => {
    await initDB(w, DEFAULT_HEAD_NAME, clientID);
  });
  return await store.withRead(async read => {
    const [, commit] = await readCommit(whenceHead(DEFAULT_HEAD_NAME), read);
    return commit;
  });
}

// Local commit has mutator name and args according to its index in the
// chain.
export async function addLocal(
  chain: Chain,
  store: dag.Store,
  clientID: ClientID,
  entries?: [string, JSONValue][],
): Promise<Chain> {
  expect(chain).to.have.length.greaterThan(0);
  const i = chain.length;
  const commit = await createLocal(
    entries ?? [[`local`, `${i}`]],
    store,
    i,
    clientID,
  );

  chain.push(commit);
  return chain;
}

export async function createLocal(
  entries: [string, JSONValue][],
  store: dag.Store,
  i: number,
  clientID: ClientID,
): Promise<Commit<Meta>> {
  const lc = new LogContext();
  await store.withWrite(async dagWrite => {
    const w = await newWriteLocal(
      whenceHead(DEFAULT_HEAD_NAME),
      `mutator_name_${i}`,
      toInternalValue([i], ToInternalValueReason.Test),
      null,
      dagWrite,
      42,
      clientID,
    );
    for (const [key, val] of entries) {
      await w.put(lc, key, toInternalValue(val, ToInternalValueReason.Test));
    }
    await w.commit(DEFAULT_HEAD_NAME);
  });
  return store.withRead(dagRead => fromHead(DEFAULT_HEAD_NAME, dagRead));
}

export async function addIndexChange(
  chain: Chain,
  store: dag.Store,
  clientID: ClientID,
  indexName?: string,
  indexDefinition?: IndexDefinition,
): Promise<Chain> {
  expect(chain).to.have.length.greaterThan(0);
  const i = chain.length;
  const name = indexName ?? `${i}`;
  const {
    prefix = 'local',
    jsonPointer = '',
    allowEmpty = false,
  } = indexDefinition ?? {};

  const commit = await createIndex(
    name,
    prefix,
    jsonPointer,
    store,
    allowEmpty,
    clientID,
  );
  chain.push(commit);
  return chain;
}

export async function createIndex(
  name: string,
  prefix: string,
  jsonPointer: string,
  store: dag.Store,
  allowEmpty: boolean,
  clientID: ClientID,
): Promise<Commit<Meta>> {
  const lc = new LogContext();
  await store.withWrite(async dagWrite => {
    const w = await newWriteIndexChange(
      whenceHead(DEFAULT_HEAD_NAME),
      dagWrite,
      clientID,
    );
    await w.createIndex(lc, name, prefix, jsonPointer, allowEmpty);
    await w.commit(DEFAULT_HEAD_NAME);
  });
  return store.withRead(async dagRead => {
    const [, commit] = await readCommit(whenceHead(DEFAULT_HEAD_NAME), dagRead);
    return commit;
  });
}

// See also sync.test_helpers for addSyncSnapshot, which can't go here because
// it depends on details of sync and sync depends on db.

// The optional map for the commit is treated as key, value pairs.
export async function addSnapshot(
  chain: Chain,
  store: dag.Store,
  map: [string, JSONValue][] | undefined,
  clientID: ClientID,
  cookie: JSONValue = `cookie_${chain.length}`,
  lastMutationIDs?: Record<ClientID, number>,
  indexDefinitions?: IndexDefinitions,
): Promise<Chain> {
  expect(chain).to.have.length.greaterThan(0);
  const lc = new LogContext();
  await store.withWrite(async dagWrite => {
    let w;
    let indexes: Map<string, IndexWrite>;
    if (DD31) {
      if (indexDefinitions) {
        indexes = new Map();
        for (const [name, indexDefinition] of Object.entries(
          indexDefinitions,
        )) {
          const valueMap = new BTreeRead(
            dagWrite,
            chain[chain.length - 1].valueHash,
          );
          const indexMap = await createIndexBTree(
            new LogContext(),
            dagWrite,
            valueMap,
            indexDefinition,
          );
          const indexMapHash = await indexMap.flush();
          const indexRecord: IndexRecord = {
            definition: {
              name,
              prefix: indexDefinition.prefix ?? '',
              jsonPointer: indexDefinition.jsonPointer,
              allowEmpty: indexDefinition.allowEmpty ?? false,
            },
            valueHash: indexMapHash,
          };
          indexes.set(name, new IndexWrite(indexRecord, indexMap));
        }
      } else {
        indexes = readIndexesForWrite(chain[chain.length - 1], dagWrite);
      }
      w = await newWriteSnapshotDD31(
        whenceHead(DEFAULT_HEAD_NAME),
        lastMutationIDs ?? {
          [clientID]: await chain[chain.length - 1].getNextMutationID(
            clientID,
            dagWrite,
          ),
        },
        toInternalValue(cookie, ToInternalValueReason.Test),
        dagWrite,
        indexes,
        clientID,
      );
    } else {
      w = await newWriteSnapshot(
        whenceHead(DEFAULT_HEAD_NAME),
        await chain[chain.length - 1].getNextMutationID(clientID, dagWrite),
        toInternalValue(cookie, ToInternalValueReason.Test),
        dagWrite,
        readIndexesForWrite(chain[chain.length - 1], dagWrite),
        clientID,
      );
    }

    if (map) {
      for (const [k, v] of map) {
        await w.put(lc, k, toInternalValue(v, ToInternalValueReason.Test));
      }
    }
    await w.commit(DEFAULT_HEAD_NAME);
  });
  return store.withRead(async dagRead => {
    const [, commit] = await readCommit(whenceHead(DEFAULT_HEAD_NAME), dagRead);
    chain.push(commit);
    return chain;
  });
}

export async function initDB(
  dagWrite: dag.Write,
  headName: string,
  clientID: ClientID,
): Promise<Hash> {
  const basisHash = emptyHash;
  if (DD31) {
    const w = new Write(
      dagWrite,
      new BTreeWrite(dagWrite),
      undefined,
      {
        basisHash,
        type: MetaType.Snapshot,
        lastMutationIDs: {},
        cookieJSON: null,
      },
      new Map(),
      clientID,
    );
    return await w.commit(headName);
  }
  const w = new Write(
    dagWrite,
    new BTreeWrite(dagWrite),
    undefined,
    {basisHash, type: MetaType.Snapshot, lastMutationID: 0, cookieJSON: null},
    new Map(),
    clientID,
  );
  return await w.commit(headName);
}
