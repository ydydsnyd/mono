import {
  initClient,
  updateClients,
  Client,
  ClientMap,
  ClientDD31,
  ClientSDD,
} from './clients';
import type * as dag from '../dag/mod';
import type * as sync from '../sync/mod';

export function setClients(
  clients: ClientMap,
  dagStore: dag.Store,
): Promise<ClientMap> {
  return updateClients(_ => {
    return Promise.resolve({
      clients,
    });
  }, dagStore);
}

type PartialClient = Partial<Client> &
  Pick<Client, 'heartbeatTimestampMs' | 'headHash'>;

type PartialClientSDD = Partial<ClientSDD> &
  Pick<ClientSDD, 'heartbeatTimestampMs' | 'headHash'>;

type PartialClientDD31 = Partial<ClientDD31> &
  Pick<ClientDD31, 'heartbeatTimestampMs' | 'headHash'>;

export function makeClient(partialClient: PartialClient): Client {
  const p31 = partialClient as PartialClientDD31;
  if (typeof p31.branchID === 'string') {
    // Forced DD31 path
    return {
      branchID: p31.branchID,
      ...partialClient,
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
      branchID: 'make-client-branch-id',
      ...partialClient,
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
  await updateClients(clients => {
    const clientsAfterGC = new Map(clients);
    clientsAfterGC.delete(clientID);
    return {
      clients: new Map(clientsAfterGC),
    };
  }, dagStore);
}

export async function initClientWithClientID(
  clientID: sync.ClientID,
  dagStore: dag.Store,
): Promise<void> {
  const [generatedClientID, client, clientMap] = await initClient(dagStore);
  const newMap = new Map(clientMap);
  newMap.delete(generatedClientID);
  newMap.set(clientID, client);
  await setClients(newMap, dagStore);
}
