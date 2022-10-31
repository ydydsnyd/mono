import {assert, assertObject, assertString} from './asserts';
import type {BranchID, ClientID} from './sync/ids';

function makeChannelName(replicacheName: string): string {
  return `replicache-on-persist:${replicacheName}`;
}

export type PersistInfo = {
  branchID: BranchID;
  clientID: ClientID;
};

export type OnPersist = (persistInfo: PersistInfo) => void;
export type HandlePersist = OnPersist;

function assertPersistInfo(value: unknown): asserts value is PersistInfo {
  assertObject(value);
  assertString(value.branchID);
  assertString(value.clientID);
}

export function initOnPersistChannel(
  replicacheName: string,
  signal: AbortSignal,
  handlePersist: HandlePersist,
): OnPersist {
  assert(DD31);
  if (signal.aborted) {
    return () => undefined;
  }
  const channel = new BroadcastChannel(makeChannelName(replicacheName));

  channel.onmessage = e => {
    const {data} = e;
    assertPersistInfo(data);
    handlePersist({
      branchID: data.branchID,
      clientID: data.clientID,
    });
  };

  signal.addEventListener('abort', () => {
    channel.close();
  });

  return (persistInfo: PersistInfo) => {
    if (signal.aborted) {
      return;
    }
    channel.postMessage(persistInfo);
    handlePersist(persistInfo);
  };
}
