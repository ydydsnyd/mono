import type {LogContext} from '@rocicorp/logger';
import {assert} from 'shared/asserts.js';
import type * as dag from '../dag/mod.js';
import {assertNoMissingChunks} from '../dag/util.js';
import {assertSnapshotCommitDD31} from '../db/commit.js';
import * as db from '../db/mod.js';
import type {Hash} from '../hash.js';
import type {MutatorDefs} from '../replicache.js';
import {sleep} from '../sleep.js';
import * as sync from '../sync/mod.js';
import {withRead, withWrite} from '../with-transactions.js';
import {
  ClientStateNotFoundError,
  assertClientV5,
  getClient,
  getClientGroupForClient,
  setClient,
} from './clients.js';
import {
  ChunkWithSize,
  GatherNotCachedVisitor,
} from './gather-not-cached-visitor.js';

const GATHER_SIZE_LIMIT = 5 * 2 ** 20; // 5 MB
const DELAY_MS = 300;

/**
 * This returns the diff between the state of the btree before and after
 * refresh. It returns `undefined` if the refresh was aborted.
 */
export function refresh(
  lc: LogContext,
  memdag: dag.LazyStore,
  perdag: dag.Store,
  clientID: sync.ClientID,
  mutators: MutatorDefs,
  diffConfig: sync.DiffComputationConfig,
  closed: () => boolean,
): Promise<[Hash, sync.DiffsMap] | undefined> {
  return navigator.locks.request('replicache-persist-refresh', () =>
    refreshInternal(lc, memdag, perdag, clientID, mutators, diffConfig, closed),
  );
}

export async function refreshInternal(
  lc: LogContext,
  memdag: dag.LazyStore,
  perdag: dag.Store,
  clientID: sync.ClientID,
  mutators: MutatorDefs,
  diffConfig: sync.DiffComputationConfig,
  closed: () => boolean,
): Promise<[Hash, sync.DiffsMap] | undefined> {
  if (closed()) {
    return;
  }

  lc = lc.addContext('refresh', clientID);

  await withRead(memdag, async memdagRead => {
    await memdagRead.validateDag();
  });

  const memdagBaseSnapshot = await withRead(memdag, memdagRead =>
    db.baseSnapshotFromHead(db.DEFAULT_HEAD_NAME, memdagRead),
  );
  assertSnapshotCommitDD31(memdagBaseSnapshot);

  const origMemdagBaseSnapshot = memdagBaseSnapshot;
  // Suspend eviction and deletion of chunks cached by the lazy store
  // to prevent cache misses.  If eviction and deletion are not suspended
  // some chunks that are not gathered due to already being cached, may be
  // evicted or deleted by the time the write lock is acquired on the memdag,
  // which can lead to cache misses when performing the rebase and diff.
  // It is important to avoid these cache misses because they often create jank
  // because they block local mutations, pulls and queries on reading from idb.
  // Cache misses can still happen during the rebase and diff, but only
  // if the gather step hits its size limit.
  const result:
    | [
        newMemdagHeadHash: Hash,
        diffs: sync.DiffsMap,
        newPerdagClientHeadHash: Hash,
        perdagClientHeadHash: Hash,
      ]
    | undefined = await memdag.withSuspendedSourceCacheEvictsAndDeletes(
    async () => {
      type PerdagWriteResult =
        | [
            perdagClientGroupHeadHash: Hash,
            perdagClientGroupBaseSnapshot: db.Commit<db.SnapshotMetaDD31>,
            perdagLmid: number,
            gatheredChunks: ReadonlyMap<Hash, ChunkWithSize>,
            clientHeadHash: Hash,
          ]
        | undefined;
      const perdagWriteResult: PerdagWriteResult = await withWrite(
        perdag,
        async perdagWrite => {
          const clientGroup = await getClientGroupForClient(
            clientID,
            perdagWrite,
          );
          if (!clientGroup) {
            throw new ClientStateNotFoundError(clientID);
          }

          await assertNoMissingChunks(perdagWrite, clientGroup.headHash);

          const perdagClientGroupHeadHash = clientGroup.headHash;
          const perdagClientGroupHeadCommit = await db.commitFromHash(
            perdagClientGroupHeadHash,
            perdagWrite,
          );
          const perdagLmid = await perdagClientGroupHeadCommit.getMutationID(
            clientID,
            perdagWrite,
          );

          // Need to pull this head into memdag, but can't have it disappear if
          // perdag moves forward while we're rebasing in memdag. Can't change
          // client headHash until our rebase in memdag is complete, because if
          // rebase fails, then nothing is keeping client's chunks alive in
          // perdag.
          const client = await getClient(clientID, perdagWrite);
          if (!client) {
            throw new ClientStateNotFoundError(clientID);
          }
          assertClientV5(client);
          const perdagClientGroupBaseSnapshot = await db.baseSnapshotFromHash(
            perdagClientGroupHeadHash,
            perdagWrite,
          );
          assertSnapshotCommitDD31(perdagClientGroupBaseSnapshot);
          if (
            shouldAbortRefresh(
              memdagBaseSnapshot,
              perdagClientGroupBaseSnapshot,
              perdagClientGroupHeadHash,
            )
          ) {
            lc.debug?.('shouldAbort returned true for', {
              memdagBaseSnapshot,
              perdagClientGroupBaseSnapshot,
              perdagClientGroupHeadHash,
            });
            return undefined;
          }

          lc.debug?.(
            'Gathering not cached chunks starting at the client group headHash',
            perdagClientGroupHeadHash,
          );

          // To avoid pulling the entire perdag graph into the memdag
          // the amount of chunk data gathered is limited by size.
          const visitor = new GatherNotCachedVisitor(
            perdagWrite,
            memdag,
            GATHER_SIZE_LIMIT,
          );
          await visitor.visit(perdagClientGroupHeadHash);
          const {gatheredChunks} = visitor;

          const newClient = {
            ...client,
            tempRefreshHash: perdagClientGroupHeadHash,
          };
          await setClient(clientID, newClient, perdagWrite);
          await perdagWrite.commit();
          return [
            perdagClientGroupHeadHash,
            perdagClientGroupBaseSnapshot,
            perdagLmid,
            gatheredChunks,
            client.headHash,
          ];
        },
      );

      if (closed() || !perdagWriteResult) {
        return;
      }

      const [
        perdagClientGroupHeadHash,
        perdagClientGroupBaseSnapshot,
        perdagLmid,
        gatheredChunks,
        perdagClientHeadHash,
      ] = perdagWriteResult;

      await withRead(memdag, async memdagRead => {
        await memdagRead.validateDag();
      });

      // pull/poke and refresh are racing to see who gets to update
      // the memdag (the one with the newer base snapshot cookie wins)
      // pull/poke updates are preferable so delay refresh slightly to
      // make pull/poke the winner except when pull/pokes are slow.
      // This is especially important for pokes, as refresh winning
      // will result in the next poke's cookie not matching necessitating
      // a disconnect/reconnect.
      await sleep(DELAY_MS);
      if (closed()) {
        return;
      }

      return withWrite(memdag, async memdagWrite => {
        await memdagWrite.validateDag();
        const memdagHeadCommit = await db.commitFromHead(
          db.DEFAULT_HEAD_NAME,
          memdagWrite,
        );
        const memdagBaseSnapshot = await db.baseSnapshotFromCommit(
          memdagHeadCommit,
          memdagWrite,
        );
        assertSnapshotCommitDD31(memdagBaseSnapshot);

        // TODO(arv): Abort if memdag moved from step 1.
        if (
          memdagBaseSnapshot.chunk.hash !== origMemdagBaseSnapshot.chunk.hash
        ) {
          lc.debug?.(
            'memdag base snapshot moved. Was',
            origMemdagBaseSnapshot.chunk.hash,
            'now',
            memdagBaseSnapshot.chunk.hash,
          );
          return undefined;
        }

        if (
          shouldAbortRefresh(
            memdagBaseSnapshot,
            perdagClientGroupBaseSnapshot,
            perdagClientGroupHeadHash,
          )
        ) {
          return undefined;
        }

        const newMemdagMutations = await db.localMutationsGreaterThan(
          memdagHeadCommit,
          {[clientID]: perdagLmid},
          memdagWrite,
        );
        const ps = [];
        for (const {chunk, size} of gatheredChunks.values()) {
          ps.push(memdagWrite.putChunk(chunk, size));
        }
        await Promise.all(ps);

        let newMemdagHeadHash = perdagClientGroupHeadHash;
        for (let i = newMemdagMutations.length - 1; i >= 0; i--) {
          newMemdagHeadHash = (
            await db.rebaseMutationAndPutCommit(
              newMemdagMutations[i],
              memdagWrite,
              newMemdagHeadHash,
              mutators,
              lc,
              newMemdagMutations[i].meta.clientID,
            )
          ).chunk.hash;
        }

        const diffs = await sync.diffCommits(
          memdagHeadCommit,
          await db.commitFromHash(newMemdagHeadHash, memdagWrite),
          memdagWrite,
          diffConfig,
        );

        await memdagWrite.setHead(db.DEFAULT_HEAD_NAME, newMemdagHeadHash);
        await memdagWrite.commit();
        return [
          newMemdagHeadHash,
          diffs,
          perdagClientGroupHeadHash,
          perdagClientHeadHash,
        ];
      });
    },
  );

  if (closed()) {
    return;
  }

  await withWrite(perdag, async perdagWrite => {
    const client = await getClient(clientID, perdagWrite);
    if (!client) {
      throw new ClientStateNotFoundError(clientID);
    }

    // TODO(arv): Abort if perdag moved from step 2.
    if (result) {
      assert(client.headHash === result[3], 'client.headHash moved');
    }

    const newClient = {
      ...client,
      headHash: result === undefined ? client.headHash : result[2],
      tempRefreshHash: null,
    };

    // If this cleanup never happens, it's no big deal, some data will stay
    // alive longer but next refresh will fix it.
    await setClient(clientID, newClient, perdagWrite);

    await perdagWrite.commit();
  });

  return result && [result[0], result[1]];
}

function shouldAbortRefresh(
  memdagBaseSnapshot: db.Commit<db.SnapshotMetaDD31>,
  perdagClientGroupBaseSnapshot: db.Commit<db.SnapshotMetaDD31>,
  perdagClientGroupHeadHash: Hash,
): boolean {
  const baseSnapshotCookieCompareResult = db.compareCookiesForSnapshots(
    memdagBaseSnapshot,
    perdagClientGroupBaseSnapshot,
  );
  return (
    baseSnapshotCookieCompareResult > 0 ||
    (baseSnapshotCookieCompareResult === 0 &&
      perdagClientGroupHeadHash === perdagClientGroupBaseSnapshot.chunk.hash)
  );
}
