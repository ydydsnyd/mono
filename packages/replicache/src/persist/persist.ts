import type {LogContext} from '@rocicorp/logger';
import {assert} from 'shared/asserts.js';
import * as dag from '../dag/mod.js';
import {
  assertAllPresent,
  assertNoMissingChunks,
  assertNoneMemOnly,
  assertNonePresent,
  containsHash,
} from '../dag/util.js';
import {assertSnapshotCommitDD31} from '../db/commit.js';
import * as db from '../db/mod.js';
import type {Hash} from '../hash.js';
import type {MutatorDefs} from '../replicache.js';
import type * as sync from '../sync/mod.js';
import {withRead, withWrite} from '../with-transactions.js';
import {
  CLIENT_GROUPS_HEAD_NAME,
  getClientGroup,
  setClientGroup,
} from './client-groups.js';
import {assertHasClientState, getClientGroupIDForClient} from './clients.js';

/**
 * Persists the client's memdag state to the client's perdag client group.
 *
 * Persists the base snapshot from memdag to the client's perdag client group,
 * but only if it’s newer than the client's perdag client group’s base snapshot.
 * The base snapshot is persisted by gathering all memory-only chunks in the dag
 * subgraph rooted at the base snapshot's commit and writing them to the perdag.
 * Once the base snapshot is persisted, rebases onto this new base snapshot all
 * local commits from the client's perdag client group that are not already
 * reflected in the base snapshot.
 *
 * Whether or not the base snapshot is persisted, rebases onto the client's
 * perdag client group all memdag local commits not already in the client's
 * perdag client group's history.
 *
 * Also updates the `lastMutationIDs` and `lastServerAckdMutationIDs` properties
 * of the client's client group's entry in the `ClientGroupMap`.
 */
export function persistDD31(
  lc: LogContext,
  clientID: sync.ClientID,
  memdag: dag.LazyStore,
  perdag: dag.Store,
  mutators: MutatorDefs,
  closed: () => boolean,
  onGatherMemOnlyChunksForTest = () => Promise.resolve(),
): Promise<void> {
  return navigator.locks.request('replicache-persist-refresh', () =>
    persistInternal(
      lc,
      clientID,
      memdag,
      perdag,
      mutators,
      closed,
      onGatherMemOnlyChunksForTest,
    ),
  );
}

async function persistInternal(
  lc: LogContext,
  clientID: sync.ClientID,
  memdag: dag.LazyStore,
  perdag: dag.Store,
  mutators: MutatorDefs,
  closed: () => boolean,
  onGatherMemOnlyChunksForTest = () => Promise.resolve(),
): Promise<void> {
  lc = lc.addContext('persist', clientID);

  if (closed()) {
    return;
  }

  const [
    perdagLMID,
    perdagBaseSnapshot,
    mainClientGroupID,
    headsFromBefore,
    perdagMainClientGroupHeadHash,
  ] = await withRead(perdag, async perdagRead => {
    await assertHasClientState(clientID, perdagRead);
    const mainClientGroupID = await getClientGroupIDForClient(
      clientID,
      perdagRead,
    );
    assert(mainClientGroupID, `No main client group for clientID: ${clientID}`);
    const clientGroup = await getClientGroup(mainClientGroupID, perdagRead);
    assert(clientGroup);
    const perdagMainClientGroupHeadHash = clientGroup.headHash;
    const perdagMainClientGroupHeadCommit = await db.commitFromHash(
      perdagMainClientGroupHeadHash,
      perdagRead,
    );

    const perdagLMID = await perdagMainClientGroupHeadCommit.getMutationID(
      clientID,
      perdagRead,
    );
    const perdagBaseSnapshot = await db.baseSnapshotFromCommit(
      perdagMainClientGroupHeadCommit,
      perdagRead,
    );
    assertSnapshotCommitDD31(perdagBaseSnapshot);

    const headsFromBefore: Record<string, Hash | undefined> = {
      // [CLIENTS_HEAD_NAME]: await perdagRead.getHead(CLIENTS_HEAD_NAME),
      [CLIENT_GROUPS_HEAD_NAME]: await perdagRead.getHead(
        CLIENT_GROUPS_HEAD_NAME,
      ),
    };

    return [
      perdagLMID,
      perdagBaseSnapshot,
      mainClientGroupID,
      headsFromBefore,
      perdagMainClientGroupHeadHash,
    ];
  });

  await validateMemDag(memdag, clientID, mainClientGroupID);

  if (closed()) {
    return;
  }

  const [
    newMemdagMutations,
    memdagBaseSnapshot,
    gatheredChunksX,
    // gatheredChunksY,
    // gatheredChunksUsingMemOnly,
    // memdagHeadCommitHash,
  ] = await withRead(memdag, async memdagRead => {
    const memdagHeadCommit = await db.commitFromHead(
      db.DEFAULT_HEAD_NAME,
      memdagRead,
    );
    // const memdagHeadCommitHash = memdagHeadCommit.chunk.hash;
    const newMemdagMutations = await db.localMutationsGreaterThan(
      memdagHeadCommit,
      {[clientID]: perdagLMID || 0},
      memdagRead,
    );
    const memdagBaseSnapshot = await db.baseSnapshotFromCommit(
      memdagHeadCommit,
      memdagRead,
    );
    assertSnapshotCommitDD31(memdagBaseSnapshot);

    const gatheredChunksX: ReadonlyMap<Hash, dag.Chunk> = await gatherChunksX(
      memdagRead,
      memdagBaseSnapshot.chunk.hash,
      perdagMainClientGroupHeadHash,
    );

    // const gatheredChunksY: ReadonlyMap<Hash, dag.Chunk> = await gatherChunksY(
    //   memdagRead,
    //   memdagBaseSnapshot.chunk.hash,
    //   perdagMainClientGroupHeadHash,
    // );

    // const gatheredChunksUsingMemOnly: ReadonlyMap<Hash, dag.Chunk> =
    //   await gatherChunksUsingMemOnly(
    //     memdagRead,
    //     memdagBaseSnapshot.chunk.hash,
    //     perdagMainClientGroupHeadHash,
    //   );

    // assertAllMemOnly(memdagRead, gatheredChunks.keys());

    return [
      newMemdagMutations,
      memdagBaseSnapshot,
      gatheredChunksX,
      // gatheredChunksY,
      // gatheredChunksUsingMemOnly,
      // memdagHeadCommitHash,
    ];
  });

  if (closed()) {
    return;
  }

  const gatheredChunksX2 = await withRead(perdag, perdagRead =>
    restrictGatherChunks(
      perdagRead,
      gatheredChunksX,
      memdagBaseSnapshot.chunk.hash,
    ),
  );

  const gatheredChunks = await withRead(perdag, perdagRead =>
    restrictGatherChunks(
      perdagRead,
      gatheredChunksX2,
      memdagBaseSnapshot.chunk.hash,
    ),
  );

  // if (gatheredChunks.size !== gatheredChunksY2.size) {
  //   debugger;
  // }

  await validateMemDag(memdag, clientID, mainClientGroupID);

  await withRead(perdag, perdagRead =>
    assertNonePresent(perdagRead, gatheredChunks.keys()),
  );

  if (
    db.compareCookiesForSnapshots(memdagBaseSnapshot, perdagBaseSnapshot) > 0
  ) {
    await onGatherMemOnlyChunksForTest();
    // Might need to persist snapshot, we will have to double check
    // after gathering the snapshot chunks from memdag
    const memdagBaseSnapshotHash = memdagBaseSnapshot.chunk.hash;
    // Gather all memory only chunks from base snapshot on the memdag.

    // await withRead(perdag, perdagRead =>
    //   assertNonePresent(perdagRead, gatheredChunks.keys()),
    // );

    // await withRead(memdag, memdagRead =>
    //   assertAllMemOnly(memdagRead, gatheredChunks.keys()),
    // );

    let memdagBaseSnapshotPersisted = false;
    if (closed()) {
      return;
    }

    await withWrite(perdag, async perdagWrite => {
      for (const headName of [
        //CLIENTS_HEAD_NAME,
        CLIENT_GROUPS_HEAD_NAME,
      ]) {
        const head = await perdagWrite.getHead(headName);

        if (headsFromBefore[headName] !== head) {
          lc.debug?.(`Head ${headName} changed, aborting persist`);
          return;
        }
      }

      await assertNonePresent(perdagWrite, gatheredChunks.keys());

      // check if memdag snapshot still newer than perdag snapshot
      const mainClientGroup = await getClientGroup(
        mainClientGroupID,
        perdagWrite,
      );
      assert(mainClientGroup);
      await assertNoMissingChunks(perdagWrite, mainClientGroup.headHash);

      const latestPerdagMainClientGroupHeadCommit = await db.commitFromHash(
        mainClientGroup.headHash,
        perdagWrite,
      );
      let mutationIDs;
      let {lastServerAckdMutationIDs} = mainClientGroup;
      const latestPerdagBaseSnapshot = await db.baseSnapshotFromCommit(
        latestPerdagMainClientGroupHeadCommit,
        perdagWrite,
      );
      assertSnapshotCommitDD31(latestPerdagBaseSnapshot);

      // We may have local mutations and these references a valueHash which
      // needs to be persisted if we are going to be able to do a rebase in the
      // perdag.
      await Promise.all(
        Array.from(gatheredChunks.values(), c => perdagWrite.putChunk(c)),
      );
      memdagBaseSnapshotPersisted = true;
      await assertNoMissingChunks(perdagWrite, memdagBaseSnapshot.chunk.hash);

      let newMainClientGroupHeadHash: Hash;
      // check if memdag snapshot still newer than perdag snapshot
      if (
        db.compareCookiesForSnapshots(
          memdagBaseSnapshot,
          latestPerdagBaseSnapshot,
        ) > 0
      ) {
        lc.debug?.('still newer, persist memdag snapshot by writing chunks');
        // still newer, persist memdag snapshot by writing chunks
        // await Promise.all(
        //   Array.from(gatheredChunks.values(), c => perdagWrite.putChunk(c)),
        // );
        // memdagBaseSnapshotPersisted = true;
        // Rebase local mutations from perdag main client group onto new
        // snapshot
        newMainClientGroupHeadHash = memdagBaseSnapshotHash;
        const mainClientGroupLocalMutations = await db.localMutationsDD31(
          mainClientGroup.headHash,
          perdagWrite,
        );

        for (const mutation of mainClientGroupLocalMutations) {
          await assertNoMissingChunks(perdagWrite, mutation.chunk.hash);
        }

        assertSnapshotCommitDD31(memdagBaseSnapshot);
        lastServerAckdMutationIDs = memdagBaseSnapshot.meta.lastMutationIDs;
        mutationIDs = {...lastServerAckdMutationIDs};

        lc.debug?.(
          'rebase perdag mutations on top of client group headHash',
          newMainClientGroupHeadHash,
        );
        try {
          newMainClientGroupHeadHash = await rebase(
            mainClientGroupLocalMutations,
            newMainClientGroupHeadHash,
            perdagWrite,
            mutators,
            mutationIDs,
            lc,
          );
          lc.debug?.(
            'Rebased perdag mutations. New client group headHash:',
            newMainClientGroupHeadHash,
          );
        } catch (e) {
          if (e instanceof dag.ChunkNotFoundError) {
            const missingHash = e.hash;
            for (const h of gatheredChunks.keys()) {
              if (await containsHash(perdagWrite, missingHash, h)) {
                lc.error?.(`The gathered chunks references the missing chunk`);
              }
            }
          }
          throw e;
        }
      } else {
        lc.debug?.('not newer, no perdag mutations to rebase');
        newMainClientGroupHeadHash = mainClientGroup.headHash;
        mutationIDs = {...mainClientGroup.mutationIDs};
      }
      // persist new memdag mutations
      lc.debug?.(
        'rebase memdag mutations on top of client group headHash',
        newMainClientGroupHeadHash,
      );
      try {
        newMainClientGroupHeadHash = await rebase(
          newMemdagMutations,
          newMainClientGroupHeadHash,
          perdagWrite,
          mutators,
          mutationIDs,
          lc,
        );
        lc.debug?.(
          'Rebased perdag mutations. New client group headHash:',
          newMainClientGroupHeadHash,
        );
      } catch (e) {
        if (e instanceof dag.ChunkNotFoundError) {
          const missingHash = e.hash;
          for (const h of gatheredChunks.keys()) {
            if (await containsHash(perdagWrite, missingHash, h)) {
              lc.error?.(`The gathered chunks references the missing chunk`);
            }
          }
        }
        throw e;
      }
      await setClientGroup(
        lc,
        mainClientGroupID,
        {
          ...mainClientGroup,
          headHash: newMainClientGroupHeadHash,
          mutationIDs,
          lastServerAckdMutationIDs,
        },
        perdagWrite,
      );
      await perdagWrite.commit();
    });

    await validateMemDag(memdag, clientID, mainClientGroupID);

    if (memdagBaseSnapshotPersisted) {
      lc.debug?.(
        'memdagBaseSnapshotPersisted. Telling memdag about persisted chunks',
      );

      // TODO(arv: We currently gather too much. We gather the Local commits
      // which gets rebased and thus should not be part of the perdag after
      // persist. We can change this by not gathering the Local commits.

      const chunksThatWerePersisted = await withRead(
        perdag,
        async perdagRead => {
          const chunksThatWerePersisted = new Set<Hash>();
          for (const h of gatheredChunks.keys()) {
            if (await perdagRead.hasChunk(h)) {
              chunksThatWerePersisted.add(h);
            } else {
              lc.debug?.('chunk was not persisted', h, gatheredChunks.get(h));
            }
          }
          return chunksThatWerePersisted;
        },
      );

      await memdag.chunksPersisted(chunksThatWerePersisted);
      await withRead(perdag, perdagRead =>
        assertAllPresent(perdagRead, chunksThatWerePersisted),
      );
      await withRead(memdag, memdagRead =>
        assertNoneMemOnly(memdagRead, chunksThatWerePersisted),
      );
    }

    await validateMemDag(memdag, clientID, mainClientGroupID);
  } else {
    if (lc.debug) {
      if (
        db.compareCookiesForSnapshots(
          memdagBaseSnapshot,
          perdagBaseSnapshot,
        ) === 0
      ) {
        lc.debug(
          'memdag base snapshot is same as perdag base snapshot',
          memdagBaseSnapshot.meta.cookieJSON,
        );
      } else {
        lc.debug(
          'memdag base snapshot is older than perdag base snapshot',
          memdagBaseSnapshot.meta.cookieJSON,
          perdagBaseSnapshot.meta.cookieJSON,
        );
      }
    }

    // no need to persist snapshot, persist new memdag mutations
    await withWrite(perdag, async perdagWrite => {
      const mainClientGroup = await getClientGroup(
        mainClientGroupID,
        perdagWrite,
      );
      assert(mainClientGroup);

      await assertNoMissingChunks(perdagWrite, mainClientGroup.headHash);

      // TODO(arv): We did this before...
      await Promise.all(
        Array.from(gatheredChunks.values(), c => perdagWrite.putChunk(c)),
      );

      await assertNoMissingChunks(perdagWrite, memdagBaseSnapshot.chunk.hash);

      const mutationIDs = {...mainClientGroup.mutationIDs};
      lc.debug?.(
        'rebase memdag mutations onto perdag snapshot on top of client group headHash',
        mainClientGroup.headHash,
      );

      const newMainClientGroupHeadHash = await rebase(
        newMemdagMutations,
        mainClientGroup.headHash,
        perdagWrite,
        mutators,
        mutationIDs,
        lc,
      );

      await setClientGroup(
        lc,
        mainClientGroupID,
        {
          ...mainClientGroup,
          headHash: newMainClientGroupHeadHash,
          mutationIDs,
        },
        perdagWrite,
      );
      await perdagWrite.commit();
    });
  }

  await validateMemDag(memdag, clientID, mainClientGroupID);
}

async function validateMemDag(
  _memdag: dag.LazyStore,
  _clientID: string,
  _mainClientGroupID: string,
) {
  // await withRead(memdag, async memdagRead => {
  //   const perdagRead = await memdagRead.getSourceRead();
  //   const client = await getClient(clientID, perdagRead);
  //   const clientGroup = await getClientGroup(mainClientGroupID, perdagRead);
  //   assert(client);
  //   assert(clientGroup);
  //   await memdagRead.validateDag(
  //     new Set([client.headHash, clientGroup.headHash]),
  //   );
  // });
}

// async function getClientGroupInfo(
//   perdagRead: dag.Read,
//   clientGroupID: sync.ClientGroupID,
// ): Promise<[ClientGroup, db.Commit<db.Meta>]> {
//   const clientGroup = await getClientGroup(clientGroupID, perdagRead);
//   assert(clientGroup, `No client group for clientGroupID: ${clientGroupID}`);
//   return [
//     clientGroup,
//     await db.commitFromHash(clientGroup.headHash, perdagRead),
//   ];
// }

class GatherVisitorX extends dag.Visitor {
  readonly endAt: Hash;
  readonly gatheredChunks = new Map<Hash, dag.Chunk>();

  constructor(dagRead: dag.Read, endAt: Hash) {
    super(dagRead);
    this.endAt = endAt;
  }

  override visit(h: Hash): Promise<void> {
    if (h === this.endAt) {
      return Promise.resolve();
    }
    return super.visit(h);
  }

  override visitChunk(c: dag.Chunk): Promise<void> {
    this.gatheredChunks.set(c.hash, c);
    return super.visitChunk(c);
  }
}

// class GatherVisitorY extends dag.Visitor {
//   readonly endAt: Hash;
//   readonly gatheredChunks = new Map<Hash, dag.Chunk>();
//   readonly lazyRead: dag.LazyRead;

//   constructor(dagRead: dag.LazyRead, endAt: Hash) {
//     super(dagRead);
//     this.endAt = endAt;
//     this.lazyRead = dagRead;
//   }

//   override visit(h: Hash): Promise<void> {
//     if (h === this.endAt || !this.lazyRead.isMemOnlyChunkHash(h)) {
//       return Promise.resolve();
//     }
//     return super.visit(h);
//   }

//   override visitChunk(c: dag.Chunk): Promise<void> {
//     this.gatheredChunks.set(c.hash, c);
//     return super.visitChunk(c);
//   }
// }

// class GatherVisitorMemOnly extends dag.Visitor {
//   readonly endAt: Hash;
//   readonly gatheredChunks = new Map<Hash, dag.Chunk>();
//   readonly dagRead: dag.LazyRead;

//   constructor(dagRead: dag.LazyRead, endAt: Hash) {
//     super(dagRead);
//     this.dagRead = dagRead;
//     this.endAt = endAt;
//   }

//   override visit(h: Hash): Promise<void> {
//     if (h === this.endAt || !this.dagRead.isMemOnlyChunkHash(h)) {
//       return promiseVoid;
//     }
//     return super.visit(h);
//   }

//   override visitChunk(c: dag.Chunk): Promise<void> {
//     this.gatheredChunks.set(c.hash, c);
//     return super.visitChunk(c);
//   }
// }

async function gatherChunksX(memdag: dag.LazyRead, beginAt: Hash, endAt: Hash) {
  const visitor = new GatherVisitorX(memdag, endAt);
  await visitor.visit(beginAt);
  return visitor.gatheredChunks;
}

// async function gatherChunksY(memdag: dag.LazyRead, beginAt: Hash, endAt: Hash) {
//   const visitor = new GatherVisitorY(memdag, endAt);
//   await visitor.visit(beginAt);
//   return visitor.gatheredChunks;
// }

// async function gatherChunksUsingMemOnly(
//   memdag: dag.LazyRead,
//   beginAt: Hash,
//   endAt: Hash,
// ) {
//   const visitor = new GatherVisitorMemOnly(memdag, endAt);
//   await visitor.visit(beginAt);
//   return visitor.gatheredChunks;
// }

class RestrictVisitor extends dag.Visitor {
  readonly perdagRead: dag.HasChunk;
  readonly memdagRead: RestrictVisitorGatheredChunks;
  readonly gatheredChunks = new Map<Hash, dag.Chunk>();

  constructor(
    dagRead: RestrictVisitorGatheredChunks,
    perdagRead: dag.HasChunk,
  ) {
    super(dagRead);
    this.memdagRead = dagRead;
    this.perdagRead = perdagRead;
  }

  override async visit(h: Hash): Promise<void> {
    if (!this.memdagRead.hasChunk(h) || (await this.perdagRead.hasChunk(h))) {
      return;
    }
    await super.visit(h);
  }

  override visitChunk(chunk: dag.Chunk<unknown>): Promise<void> {
    this.gatheredChunks.set(chunk.hash, chunk);
    return super.visitChunk(chunk);
  }
}

interface RestrictVisitorGatheredChunks extends dag.MustGetChunk {
  hasChunk(h: Hash): boolean;
}

async function restrictGatherChunks(
  perdagRead: dag.Read,
  gatheredChunks: ReadonlyMap<Hash, dag.Chunk>,
  headHash: Hash,
): Promise<Map<Hash, dag.Chunk<unknown>>> {
  const memdagRead: RestrictVisitorGatheredChunks = {
    // eslint-disable-next-line require-await
    async mustGetChunk(h: Hash): Promise<dag.Chunk> {
      const c = gatheredChunks.get(h);
      assert(c);
      return Promise.resolve(c);
    },
    hasChunk(h: Hash): boolean {
      return gatheredChunks.has(h);
    },
  };
  const visitor = new RestrictVisitor(memdagRead, perdagRead);
  await visitor.visit(headHash);
  return visitor.gatheredChunks;
}

// async function gatherMemOnlyChunks(
//   dagRead: dag.LazyRead,
//   headHash: Hash,
//   mutations: db.Commit<db.LocalMetaDD31>[],
//   endAt: Hash,
// ): Promise<ReadonlyMap<Hash, dag.Chunk>> {
//   const visitor = new GatherMemoryOnlyVisitor(dagRead);
//   await visitor.visit(headHash);
//   for (const mutation of mutations) {
//     const {size} = visitor.gatheredChunks;
//     await visitor.visit(mutation.chunk.hash);
//     assert(
//       size === visitor.gatheredChunks.size,
//       `Head hash should include all mutations`,
//     );
//   }
//   return visitor.gatheredChunks;
// }

async function rebase(
  mutations: db.Commit<db.LocalMetaDD31>[],
  basis: Hash,
  write: dag.Write,
  mutators: MutatorDefs,
  mutationIDs: Record<sync.ClientID, number>,
  lc: LogContext,
): Promise<Hash> {
  // Write all mutation chunks to perdag...
  // TODO(arv): We should not write all mutations to perdag, we should only

  for (let i = mutations.length - 1; i >= 0; i--) {
    const mutationCommit = mutations[i];

    // try {
    //   await assertNoMissingChunks(write, mutationCommit.chunk.hash);
    // } catch (e) {
    //   debugger;
    //   await assertNoMissingChunks(write, mutationCommit.chunk.hash);
    //   throw e;
    // }

    const {meta} = mutationCommit;
    const newMainHead = await db.commitFromHash(basis, write);
    if (
      (await mutationCommit.getMutationID(meta.clientID, write)) >
      (await newMainHead.getMutationID(meta.clientID, write))
    ) {
      mutationIDs[meta.clientID] = meta.mutationID;
      await assertNoMissingChunks(write, basis);
      basis = (
        await db.rebaseMutationAndPutCommit(
          mutationCommit,
          write,
          basis,
          mutators,
          lc,
          meta.clientID,
        )
      ).chunk.hash;
      await assertNoMissingChunks(write, basis);
    }
  }
  return basis;
}
