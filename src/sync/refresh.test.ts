import {expect} from '@esm-bundle/chai';
import {LogContext} from '@rocicorp/logger';
import {BTreeWrite} from '../btree/write';
import * as dag from '../dag/mod';
import {
  Commit,
  IndexRecord,
  LocalMetaDD31,
  newLocalDD31,
  newSnapshotDD31,
  SnapshotMetaDD31,
} from '../db/commit';
import {addGenesis, addLocal, addSnapshot, Chain} from '../db/test-helpers';
import * as db from '../db/mod';
import {assertHash, Hash, makeNewFakeHashFunction} from '../hash';
import {toInternalValue, ToInternalValueReason} from '../internal-value';
import type {JSONValue, ReadonlyJSONValue} from '../json';
import {BranchMap, setBranch, setBranches} from '../persist/branches';
import {ClientDD31, setClient} from '../persist/clients';
import {addData} from '../test-util';
import type {ClientID} from './ids';
import {refresh} from './refresh';
import type {Entry} from '../btree/node.js';
import type {MutatorDefs, WriteTransaction} from '../mod.js';
import {assert} from '../asserts.js';

async function makeChain(
  store: dag.Store,
  clientID: ClientID,
  cookie: number,
): Promise<Chain> {
  const chain: Chain = [];
  await addGenesis(chain, store, clientID);
  await addSnapshot(chain, store, [], clientID, cookie);
  await addLocal(chain, store, clientID, []);
  return chain;
}

function makeStores() {
  const LAZY_STORE_SOURCE_CHUNK_CACHE_SIZE_LIMIT = 10 * 2 ** 20; // 10 MB
  const chunkHasher = makeNewFakeHashFunction('fake');
  const perdag = new dag.TestStore(undefined, chunkHasher);
  const memdag = new dag.LazyStore(
    perdag,
    LAZY_STORE_SOURCE_CHUNK_CACHE_SIZE_LIMIT,
    chunkHasher,
    assertHash,
  );
  return {perdag, memdag};
}

async function setClientsAndBranches(
  perdagHeadHash: Hash,
  clientID: string,
  perdag: dag.TestStore,
) {
  const branchID = 'branch-1';
  const branches: BranchMap = new Map([
    [
      branchID,
      {
        headHash: perdagHeadHash,
        indexes: {},
        // Not used
        mutationIDs: {[clientID]: -1},
        // Not used
        lastServerAckdMutationIDs: {[clientID]: -1},
        mutatorNames: [],
      },
    ],
  ]);

  const client: ClientDD31 = {
    branchID,
    headHash: perdagHeadHash,
    // Not used
    heartbeatTimestampMs: -1,
    tempRefreshHash: null,
  };

  await perdag.withWrite(async perdagWrite => {
    await setBranches(branches, perdagWrite);
    await setClient(clientID, client, perdagWrite);
    await perdagWrite.commit();
  });
}

function mutatorsProxy(): MutatorDefs {
  return new Proxy(
    {},
    {
      get(_target, prop) {
        return async (tx: WriteTransaction, args: JSONValue) => {
          await tx.put(`from ${String(prop)}`, args);
        };
      },
    },
  );
}

suite('refresh', () => {
  if (!DD31) {
    return;
  }

  test('identical dags', async () => {
    // If the dags are the same then refresh is a no op.
    const {perdag, memdag} = makeStores();
    const clientID = 'client-id-1';
    const mutators = mutatorsProxy();

    const perdagChain = await makeChain(perdag, clientID, 1);
    const perdagHeadHash = perdagChain.at(-1)?.chunk.hash;
    assert(perdagHeadHash);

    await makeChain(memdag, clientID, 1);

    await setClientsAndBranches(perdagHeadHash, clientID, perdag);

    const diffs = await refresh(
      new LogContext(),
      memdag,
      perdag,
      clientID,
      mutators,
    );
    assert(diffs);
    expect(Object.fromEntries(diffs)).to.deep.equal({});
  });

  test('memdag has one more LM', async () => {
    const {perdag, memdag} = makeStores();
    const clientID = 'client-id-1';
    const mutators: MutatorDefs = mutatorsProxy();

    const perdagChain = await makeChain(perdag, clientID, 1);
    const perdagHeadHash = perdagChain.at(-1)?.chunk.hash;
    assert(perdagHeadHash);

    // Memdag has one more LM than perdag.
    const memdagChain = await makeChain(memdag, clientID, 1);
    await addLocal(memdagChain, memdag, clientID, []);

    await setClientsAndBranches(perdagHeadHash, clientID, perdag);

    const diffs = await refresh(
      new LogContext(),
      memdag,
      perdag,
      clientID,
      mutators,
    );
    assert(diffs);
    expect(Object.fromEntries(diffs)).to.deep.equal({
      '': [
        {
          key: 'from mutator_name_3',
          newValue: [3],
          op: 'add',
        },
      ],
    });
  });

  test('memdag has a newer cookie', async () => {
    const {perdag, memdag} = makeStores();
    const clientID = 'client-id-1';
    const mutators: MutatorDefs = mutatorsProxy();

    const perdagChain = await makeChain(perdag, clientID, 1);
    const perdagHeadHash = perdagChain.at(-1)?.chunk.hash;
    assert(perdagHeadHash);

    // Memdag has a newer cookie than perdag so we abort the refresh
    const memdagChain = await makeChain(memdag, clientID, 2);
    // Memdag has one more LM than perdag.
    await addLocal(memdagChain, memdag, clientID, []);

    await setClientsAndBranches(perdagHeadHash, clientID, perdag);

    const diffs = await refresh(
      new LogContext(),
      memdag,
      perdag,
      clientID,
      mutators,
    );
    expect(diffs).undefined;
  });

  test('memdag has two more LMs', async () => {
    const {perdag, memdag} = makeStores();
    const clientID = 'client-id-1';
    const mutators: MutatorDefs = mutatorsProxy();

    const perdagChain = await makeChain(perdag, clientID, 1);
    const perdagHeadHash = perdagChain.at(-1)?.chunk.hash;
    assert(perdagHeadHash);

    // Memdag has two more LM than perdag.
    const memdagChain = await makeChain(memdag, clientID, 1);
    await addLocal(memdagChain, memdag, clientID, []);
    await addLocal(memdagChain, memdag, clientID, []);

    await setClientsAndBranches(perdagHeadHash, clientID, perdag);

    const diffs = await refresh(
      new LogContext(),
      memdag,
      perdag,
      clientID,
      mutators,
    );
    assert(diffs);
    expect(Object.fromEntries(diffs)).to.deep.equal({
      '': [
        {
          key: 'from mutator_name_3',
          newValue: [3],
          op: 'add',
        },
        {
          key: 'from mutator_name_4',
          newValue: [4],
          op: 'add',
        },
      ],
    });
  });

  test('perdag has LM from different clients', async () => {
    const {perdag, memdag} = makeStores();
    const clientID1 = 'client-id-1';
    const clientID2 = 'client-id-2';

    const mutators: MutatorDefs = mutatorsProxy();

    const perdagChain: Chain = [];
    await addGenesis(perdagChain, perdag, clientID1);
    await addSnapshot(perdagChain, perdag, [], clientID1, 1, {
      [clientID1]: 0,
      [clientID2]: 0,
    });
    await addLocal(perdagChain, perdag, clientID1, []);
    await addLocal(perdagChain, perdag, clientID2, []);

    const perdagHeadHash = perdagChain.at(-1)?.chunk.hash;
    assert(perdagHeadHash);

    const memdagChain: Chain = [];
    await addGenesis(memdagChain, memdag, clientID1);
    await addSnapshot(memdagChain, memdag, [], clientID1, 1, {
      [clientID1]: 0,
      [clientID2]: 0,
    });
    await addLocal(memdagChain, memdag, clientID1, []);
    await addLocal(memdagChain, memdag, clientID1, []);

    await setClientsAndBranches(perdagHeadHash, clientID1, perdag);

    const diffs = await refresh(
      new LogContext(),
      memdag,
      perdag,
      clientID1,
      mutators,
    );
    assert(diffs);
    expect(Object.fromEntries(diffs)).to.deep.equal({
      '': [
        {
          key: 'from mutator_name_3',
          newValue: [3],
          op: 'add',
        },
      ],
    });
  });

  test('new snapshot during refresh', async () => {
    const {perdag, memdag} = makeStores();
    const clientID = 'client-id-1';
    const mutators: MutatorDefs = mutatorsProxy();

    const perdagChain = await makeChain(perdag, clientID, 2);
    const perdagHeadHash = perdagChain.at(-1)?.chunk.hash;
    assert(perdagHeadHash);

    // Memdag has one more LM than perdag.
    const memdagChain = await makeChain(memdag, clientID, 2);
    await addLocal(memdagChain, memdag, clientID, []);

    await setClientsAndBranches(perdagHeadHash, clientID, perdag);

    // Here we use a brittle way to inject a snapshot in the middle of the refresh
    // algorithm.
    let withWriteCalls = 0;
    const {withWrite} = memdag;
    // @ts-expect-error Don't care that TS is complaining about the type of the RHS.
    memdag.withWrite = async fn => {
      if (withWriteCalls++ === 1) {
        await addSnapshot(memdagChain, memdag, [], clientID, 3);
        await addLocal(memdagChain, memdag, clientID, []);
      }
      return withWrite.call(memdag, fn);
    };

    const diffs = await refresh(
      new LogContext(),
      memdag,
      perdag,
      clientID,
      mutators,
    );
    expect(diffs).undefined;
  });

  test('greg example', async () => {
    // This sample case was used by Greg to explain DD31 refresh to arv. Here is
    // an extract of that explanation (from Slack)
    //
    // We update the memdags head to the head of the perdag branch The perdag
    // branch may look like
    //
    // perdag:mainHead -> LM {clientID: 1 id: 4 } -> LM {clientID: 2 id: 3 } ->
    // Snapshot { lmids: { 1: 3, 2: 2} }
    //
    // so then lets say client 1 is refreshing and his memdag looks like
    //
    // memdag:main -> LM {clientID: 1 id: 5 }  -> LM {clientID: 1 id: 4 }  ->
    // Snapshot { lmids: { 1: 3, 2: 2} }
    //
    // we create a refresh head
    //
    // medag:refresh = perdag:mainHead, so
    //
    // memdag:refresh -> LM {clientID: 1 id: 4 } -> LM {clientID: 2 id: 3 } ->
    // Snapshot { lmids: { 1: 3, 2: 2} }
    //
    // then we rebase from memdag main any mutations not on refreshHead
    //
    // medag:refresh -> LM {clientID: 1 id: 5 } -> LM {clientID: 1 id: 4 } -> LM
    // {clientID: 2 id: 3 } -> Snapshot { lmids: { 1: 3, 2: 2} }
    //
    // then we set
    //
    // medag:main = medag:refresh
    //
    // medag:main -> LM {clientID: 1 id: 5 } -> LM {clientID: 1 id: 4 } -> LM
    // {clientID: 2 id: 3 } -> Snapshot { lmids: { 1: 3, 2: 2} }

    if (!DD31) {
      return;
    }

    const {perdag, memdag} = makeStores();

    async function makeSnapshot({
      store,
      basisHash = null,
      lastMutationIDs,
      cookieJSON,
      valueHash,
      indexes = [],
    }: {
      store: dag.Store;
      basisHash?: Hash | null;
      lastMutationIDs: Record<ClientID, number>;
      cookieJSON: JSONValue;
      valueHash?: Hash;
      indexes?: IndexRecord[];
    }): Promise<Commit<SnapshotMetaDD31>> {
      return await store.withWrite(async dagWrite => {
        if (!valueHash) {
          const map = new BTreeWrite(dagWrite);
          valueHash = await map.flush();
        }
        const c = newSnapshotDD31(
          dagWrite.createChunk,
          basisHash,
          lastMutationIDs,
          toInternalValue(cookieJSON, ToInternalValueReason.Test),
          valueHash,
          indexes,
        );

        await dagWrite.putChunk(c.chunk);
        await dagWrite.setHead('test', c.chunk.hash);
        await dagWrite.commit();

        return c;
      });
    }

    let timestampCounter = 0;

    async function makeLocalMutation({
      store,
      clientID,
      mutationID,
      basisHash,
      mutatorName,
      mutatorArgsJSON,
      originalHash = null,
      indexes = [],
      valueHash,
      timestamp = timestampCounter++,
      entries = [],
    }: {
      store: dag.Store;
      clientID: ClientID;
      mutationID: number;
      basisHash: Hash;
      mutatorName: string;
      mutatorArgsJSON: JSONValue;
      originalHash?: Hash | null;
      indexes?: readonly IndexRecord[];
      valueHash: Hash;
      timestamp?: number;
      entries?: readonly Entry<ReadonlyJSONValue>[];
    }): Promise<Commit<LocalMetaDD31>> {
      return await store.withWrite(async dagWrite => {
        const m = new BTreeWrite(dagWrite, valueHash);
        for (const [k, v] of entries) {
          await m.put(k, toInternalValue(v, ToInternalValueReason.Test));
        }
        const newValueHash = await m.flush();

        const c = newLocalDD31(
          dagWrite.createChunk,
          basisHash,
          mutationID,
          mutatorName,
          toInternalValue(mutatorArgsJSON, ToInternalValueReason.Test),
          originalHash,
          newValueHash,
          indexes,
          timestamp,
          clientID,
        );

        await dagWrite.putChunk(c.chunk);
        await dagWrite.setHead('test', c.chunk.hash);
        await dagWrite.commit();

        return c;
      });
    }

    const clientID1 = 'client-id-1';
    const clientID2 = 'client-id-2';
    const branchID = 'branch-1';

    const s1 = await makeSnapshot({
      store: perdag,
      lastMutationIDs: {[clientID1]: 3, [clientID2]: 2},
      cookieJSON: 1,
    });
    const l1 = await makeLocalMutation({
      store: perdag,
      clientID: clientID2,
      mutationID: 3,
      basisHash: s1.chunk.hash,
      mutatorName: 'addData',
      mutatorArgsJSON: {a: 1},
      valueHash: s1.chunk.data.valueHash,
      // entries: [['a', 1]],
    });
    const l2 = await makeLocalMutation({
      store: perdag,
      clientID: clientID1,
      mutationID: 4,
      basisHash: l1.chunk.hash,
      mutatorName: 'addData',
      mutatorArgsJSON: {b: 2},
      valueHash: l1.chunk.data.valueHash,
      // entries: [['b', 2]],
    });

    await perdag.withWrite(async dagWrite => {
      await setClient(
        clientID1,
        {
          branchID,
          headHash: l2.chunk.hash,
          heartbeatTimestampMs: 1,
          tempRefreshHash: null,
        },
        dagWrite,
      );
      await setClient(
        clientID2,
        {
          branchID,
          headHash: l2.chunk.hash,
          heartbeatTimestampMs: 2,
          tempRefreshHash: null,
        },
        dagWrite,
      );
      await setBranch(
        branchID,
        {
          headHash: l2.chunk.hash,
          indexes: {},
          mutationIDs: {[clientID1]: 4, [clientID2]: 3},
          lastServerAckdMutationIDs: {[clientID1]: 0, [clientID2]: 0},
          mutatorNames: ['addData'],
        },
        dagWrite,
      );

      await dagWrite.removeHead('test');
      await dagWrite.commit();
    });

    // Memdag
    {
      const s1 = await makeSnapshot({
        store: memdag,
        lastMutationIDs: {[clientID1]: 3, [clientID2]: 2},
        cookieJSON: 1,
      });
      const l1 = await makeLocalMutation({
        store: memdag,
        clientID: clientID1,
        mutationID: 4,
        basisHash: s1.chunk.hash,
        mutatorName: 'addData',
        mutatorArgsJSON: {b: 2},
        valueHash: s1.chunk.data.valueHash,
      });
      const l2 = await makeLocalMutation({
        store: memdag,
        clientID: clientID1,
        mutationID: 5,
        basisHash: l1.chunk.hash,
        mutatorName: 'addData',
        mutatorArgsJSON: {c: 3},
        valueHash: l1.chunk.data.valueHash,
      });

      await memdag.withWrite(async dagWrite => {
        await dagWrite.setHead(db.DEFAULT_HEAD_NAME, l2.chunk.hash);
        await dagWrite.removeHead('test');
        await dagWrite.commit();
      });
    }

    const diffs = await refresh(new LogContext(), memdag, perdag, clientID1, {
      addData,
    });
    assert(diffs);
    expect(Object.fromEntries(diffs)).to.deep.equal({
      '': [{key: 'c', newValue: 3, op: 'add'}],
    });
  });
});
