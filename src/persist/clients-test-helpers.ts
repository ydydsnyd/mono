import {
  ClientMap,
  ClientDD31,
  ClientSDD,
  setClients,
  getClients,
  initClientDD31,
  Client,
} from './clients.js';
import * as dag from '../dag/mod.js';
import type * as sync from '../sync/mod.js';
import {LogContext} from '@rocicorp/logger';
import type {IndexDefinitions} from '../index-defs.js';
import {newUUIDHash} from '../hash.js';
import * as btree from '../btree/mod.js';
import * as db from '../db/mod.js';
import {uuid as makeUuid} from '../uuid.js';
import {getRefs, newSnapshotCommitDataSDD} from '../db/commit.js';

export function setClientsForTesting(
  clients: ClientMap,
  dagStore: dag.Store,
): Promise<ClientMap> {
  return dagStore.withWrite(async dagWrite => {
    await setClients(clients, dagWrite);
    await dagWrite.commit();
    return clients;
  });
}

type PartialClient = Partial<Client> &
  Pick<Client, 'heartbeatTimestampMs' | 'headHash'>;

type PartialClientSDD = Partial<ClientSDD> &
  Pick<ClientSDD, 'heartbeatTimestampMs' | 'headHash'>;

type PartialClientDD31 = Partial<ClientDD31> &
  Pick<ClientDD31, 'heartbeatTimestampMs' | 'headHash'>;

export function makeClient(partialClient: PartialClient): Client {
  const p31 = partialClient as PartialClientDD31;
  if (typeof p31.clientGroupID === 'string') {
    // Forced DD31 path
    return {
      clientGroupID: p31.clientGroupID,
      headHash: p31.headHash,
      heartbeatTimestampMs: p31.heartbeatTimestampMs,
      tempRefreshHash: p31.tempRefreshHash ?? null,
    };
  }

  const pSDD = partialClient as PartialClientSDD;
  if (
    typeof pSDD.mutationID === 'number' ||
    typeof pSDD.lastServerAckdMutationID === 'number'
  ) {
    // Forced SDD path
    return {
      mutationID: 0,
      lastServerAckdMutationID: 0,
      ...partialClient,
    };
  }

  if (DD31) {
    return {
      clientGroupID: 'make-client-group-id',
      headHash: partialClient.headHash,
      heartbeatTimestampMs: partialClient.heartbeatTimestampMs,
      tempRefreshHash: null,
    };
  }

  // SDD
  return {
    mutationID: 0,
    lastServerAckdMutationID: 0,
    ...partialClient,
  };
}

export function makeClientMap(
  obj: Record<sync.ClientID, PartialClient>,
): ClientMap {
  return new Map(
    Object.entries(obj).map(
      ([id, client]) => [id, makeClient(client)] as const,
    ),
  );
}

export async function deleteClientForTesting(
  clientID: sync.ClientID,
  dagStore: dag.Store,
): Promise<void> {
  await dagStore.withWrite(async dagWrite => {
    const clients = new Map(await getClients(dagWrite));
    clients.delete(clientID);
    await setClients(clients, dagWrite);
    await dagWrite.commit();
  });
}

export async function initClientWithClientID(
  clientID: sync.ClientID,
  dagStore: dag.Store,
  mutatorNames: string[],
  indexes: IndexDefinitions,
  dd31: boolean,
): Promise<void> {
  let generatedClientID, client, clientMap;
  if (dd31) {
    [generatedClientID, client, clientMap] = await initClientDD31(
      new LogContext(),
      dagStore,
      mutatorNames,
      indexes,
    );
  } else {
    [generatedClientID, client, clientMap] = await initClientSDD(dagStore);
  }
  const newMap = new Map(clientMap);
  newMap.delete(generatedClientID);
  newMap.set(clientID, client);
  await setClientsForTesting(newMap, dagStore);
}

// We only keep this around for testing purposes.
function initClientSDD(
  perdag: dag.Store,
): Promise<
  [
    clientID: sync.ClientID,
    client: Client,
    clientMap: ClientMap,
    newClientGroup: boolean,
  ]
> {
  return perdag.withWrite(async dagWrite => {
    const newClientID = makeUuid();
    const clients = await getClients(dagWrite);

    let bootstrapClient: Client | undefined;
    for (const client of clients.values()) {
      if (
        !bootstrapClient ||
        bootstrapClient.heartbeatTimestampMs < client.heartbeatTimestampMs
      ) {
        bootstrapClient = client;
      }
    }

    let newClientCommitData: db.CommitData<db.SnapshotMetaSDD>;
    const chunksToPut: dag.Chunk[] = [];
    if (bootstrapClient) {
      const constBootstrapClient = bootstrapClient;
      const bootstrapCommit = await db.baseSnapshotFromHash(
        constBootstrapClient.headHash,
        dagWrite,
      );
      // Copy the snapshot with one change: set last mutation id to 0.  Replicache
      // server implementations expect new client ids to start with last mutation id 0.
      // If a server sees a new client id with a non-0 last mutation id, it may conclude
      // this is a very old client whose state has been garbage collected on the server.
      newClientCommitData = newSnapshotCommitDataSDD(
        bootstrapCommit.meta.basisHash,
        0 /* lastMutationID */,
        bootstrapCommit.meta.cookieJSON,
        bootstrapCommit.valueHash,
        bootstrapCommit.indexes,
      );
    } else {
      // No existing snapshot to bootstrap from. Create empty snapshot.
      const emptyBTreeChunk = new dag.Chunk(
        newUUIDHash(),
        btree.emptyDataNode,
        [],
      );
      chunksToPut.push(emptyBTreeChunk);
      newClientCommitData = newSnapshotCommitDataSDD(
        null /* basisHash */,
        0 /* lastMutationID */,
        null /* cookie */,
        emptyBTreeChunk.hash,
        [] /* indexes */,
      );
    }

    const newClientCommitChunk = new dag.Chunk(
      newUUIDHash(),
      newClientCommitData,
      getRefs(newClientCommitData),
    );
    chunksToPut.push(newClientCommitChunk);

    const newClient: Client = {
      heartbeatTimestampMs: Date.now(),
      headHash: newClientCommitChunk.hash,
      mutationID: 0,
      lastServerAckdMutationID: 0,
    };
    const updatedClients = new Map(clients).set(newClientID, newClient);
    await setClients(updatedClients, dagWrite);

    await Promise.all(chunksToPut.map(c => dagWrite.putChunk(c)));

    await dagWrite.commit();

    return [newClientID, newClient, updatedClients, false];
  });
}
