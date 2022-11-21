import {expect} from '@esm-bundle/chai';
import * as dag from '../dag/mod.js';
import * as db from '../db/mod.js';
import {assertHash, makeNewFakeHashFunction} from '../hash.js';
import {GatherMemoryOnlyVisitor} from './gather-mem-only-visitor.js';
import {ChainBuilder} from '../db/test-helpers.js';
import {MetaType} from '../db/commit.js';
import {TestLazyStore} from '../dag/test-lazy-store.js';

test('dag with no memory-only hashes gathers nothing', async () => {
  const clientID = 'client-id';
  const hashFunction = makeNewFakeHashFunction();
  const perdag = new dag.TestStore(undefined, hashFunction);
  const memdag = new TestLazyStore(
    perdag,
    100 * 2 ** 20, // 100 MB,
    hashFunction,
    assertHash,
  );

  const pb = new ChainBuilder(perdag);
  await pb.addGenesis(clientID);
  await pb.addLocal(clientID);
  if (!DD31) {
    await pb.addIndexChange(clientID);
  }
  await pb.addLocal(clientID);

  await memdag.withRead(async dagRead => {
    for (const commit of pb.chain) {
      const visitor = new GatherMemoryOnlyVisitor(dagRead);
      await visitor.visitCommit(commit.chunk.hash);
      expect(visitor.gatheredChunks).to.be.empty;
    }
  });

  await pb.addSnapshot(undefined, clientID);

  await memdag.withRead(async dagRead => {
    const visitor = new GatherMemoryOnlyVisitor(dagRead);
    await visitor.visitCommit(pb.headHash);
    expect(visitor.gatheredChunks).to.be.empty;
  });
});

test('dag with only memory-only hashes gathers everything', async () => {
  const clientID = 'client-id';
  const hashFunction = makeNewFakeHashFunction();
  const perdag = new dag.TestStore(undefined, hashFunction);
  const memdag = new TestLazyStore(
    perdag,
    100 * 2 ** 20, // 100 MB,
    hashFunction,
    assertHash,
  );

  const mb = new ChainBuilder(memdag);

  const testGatheredChunks = async () => {
    await memdag.withRead(async dagRead => {
      const visitor = new GatherMemoryOnlyVisitor(dagRead);
      await visitor.visitCommit(mb.headHash);
      expect(memdag.getMemOnlyChunksSnapshot()).to.deep.equal(
        Object.fromEntries(visitor.gatheredChunks),
      );
    });
  };

  await mb.addGenesis(clientID);
  await mb.addLocal(clientID);
  await testGatheredChunks();

  if (!DD31) {
    await mb.addIndexChange(clientID);
  }
  await mb.addLocal(clientID);
  await testGatheredChunks();

  await mb.addSnapshot(undefined, clientID);
  await testGatheredChunks();
});

test('dag with some persisted hashes and some memory-only hashes on top', async () => {
  const clientID = 'client-id';
  const hashFunction = makeNewFakeHashFunction();
  const perdag = new dag.TestStore(undefined, hashFunction);
  const memdag = new dag.LazyStore(
    perdag,
    100 * 2 ** 20, // 100 MB,
    hashFunction,
    assertHash,
  );

  const pb = new ChainBuilder(perdag);
  const mb = new ChainBuilder(memdag);

  await pb.addGenesis(clientID);
  await pb.addLocal(clientID);

  await memdag.withWrite(async memdagWrite => {
    await memdagWrite.setHead(db.DEFAULT_HEAD_NAME, pb.headHash);
    await memdagWrite.commit();
  });
  mb.chain = pb.chain.slice();
  await mb.addLocal(clientID);

  await memdag.withRead(async dagRead => {
    const visitor = new GatherMemoryOnlyVisitor(dagRead);
    await visitor.visitCommit(mb.headHash);
    const metaBase = {
      basisHash: 'face0000000040008000000000000000' + '000000000003',
      mutationID: 2,
      mutatorArgsJSON: [2],
      mutatorName: 'mutator_name_2',
      originalHash: null,
      timestamp: 42,
    };
    const meta = DD31
      ? {type: MetaType.LocalDD31, ...metaBase, clientID}
      : {type: MetaType.LocalSDD, ...metaBase};
    expect(Object.fromEntries(visitor.gatheredChunks)).to.deep.equal({
      ['face0000000040008000000000000000' + '000000000004']: {
        data: [0, [['local', '2']]],
        hash: 'face0000000040008000000000000000' + '000000000004',
        meta: [],
      },
      ['face0000000040008000000000000000' + '000000000005']: {
        data: {
          indexes: [],
          meta,
          valueHash: 'face0000000040008000000000000000' + '000000000004',
        },
        hash: 'face0000000040008000000000000000' + '000000000005',
        meta: [
          'face0000000040008000000000000000' + '000000000004',
          'face0000000040008000000000000000' + '000000000003',
        ],
      },
    });
  });
});

test('dag with some permanent hashes and some memory-only hashes on top w index', async () => {
  const clientID = 'client-id';
  const hashFunction = makeNewFakeHashFunction();
  const perdag = new dag.TestStore(undefined, hashFunction);
  const memdag = new dag.LazyStore(
    perdag,
    100 * 2 ** 20, // 100 MB,
    hashFunction,
    assertHash,
  );

  const mb = new ChainBuilder(memdag);
  const pb = new ChainBuilder(perdag);

  await pb.addGenesis(clientID);

  await pb.addSnapshot(
    Object.entries({
      a: 1,
      b: {name: 'b-name'},
    }),
    clientID,
    undefined,
    undefined,
    {testIndex: {prefix: '', jsonPointer: '/name', allowEmpty: true}},
  );
  await memdag.withWrite(async memdagWrite => {
    await memdagWrite.setHead(db.DEFAULT_HEAD_NAME, pb.headHash);
    await memdagWrite.commit();
  });

  mb.chain = pb.chain.slice();
  if (DD31) {
    await mb.addLocal(clientID, [['c', {name: 'c-name'}]]);
  } else {
    await mb.addIndexChange(clientID, 'testIndex', {
      prefix: '',
      jsonPointer: '/name',
      allowEmpty: true,
    });
    await mb.addLocal(clientID, [['c', {name: 'c-name'}]]);
  }

  await memdag.withRead(async dagRead => {
    const visitor = new GatherMemoryOnlyVisitor(dagRead);
    await visitor.visitCommit(mb.headHash);
    expect(Object.fromEntries(visitor.gatheredChunks)).to.deep.equal(
      DD31
        ? {
            ['face0000000040008000000000000000' + '000000000008']: {
              hash: 'face0000000040008000000000000000' + '000000000008',
              data: {
                meta: {
                  type: MetaType.LocalDD31,
                  basisHash:
                    'face0000000040008000000000000000' + '000000000005',
                  mutationID: 2,
                  mutatorName: 'mutator_name_2',
                  mutatorArgsJSON: [2],
                  originalHash: null,
                  timestamp: 42,
                  clientID: 'client-id',
                },
                valueHash: 'face0000000040008000000000000000' + '000000000006',
                indexes: [
                  {
                    definition: {
                      name: 'testIndex',
                      keyPrefix: '',
                      jsonPointer: '/name',
                      allowEmpty: true,
                    },
                    valueHash:
                      'face0000000040008000000000000000' + '000000000007',
                  },
                ],
              },
              meta: [
                'face0000000040008000000000000000' + '000000000006',
                'face0000000040008000000000000000' + '000000000005',
                'face0000000040008000000000000000' + '000000000007',
              ],
            },
            ['face0000000040008000000000000000' + '000000000006']: {
              hash: 'face0000000040008000000000000000' + '000000000006',
              data: [
                0,
                [
                  ['a', 1],
                  [
                    'b',
                    {
                      name: 'b-name',
                    },
                  ],
                  [
                    'c',
                    {
                      name: 'c-name',
                    },
                  ],
                ],
              ],
              meta: [],
            },
            ['face0000000040008000000000000000' + '000000000007']: {
              hash: 'face0000000040008000000000000000' + '000000000007',
              data: [
                0,
                [
                  [
                    '\u0000b-name\u0000b',
                    {
                      name: 'b-name',
                    },
                  ],
                  [
                    '\u0000c-name\u0000c',
                    {
                      name: 'c-name',
                    },
                  ],
                ],
              ],
              meta: [],
            },
          }
        : {
            ['face0000000040008000000000000000' + '000000000008']: {
              hash: 'face0000000040008000000000000000' + '000000000008',
              data: {
                meta: {
                  type: MetaType.LocalSDD,
                  basisHash:
                    'face0000000040008000000000000000' + '000000000005',
                  mutationID: 2,
                  mutatorName: 'mutator_name_3',
                  mutatorArgsJSON: [3],
                  originalHash: null,
                  timestamp: 42,
                },
                valueHash: 'face0000000040008000000000000000' + '000000000006',
                indexes: [
                  {
                    definition: {
                      name: 'testIndex',
                      keyPrefix: '',
                      jsonPointer: '/name',
                      allowEmpty: true,
                    },
                    valueHash:
                      'face0000000040008000000000000000' + '000000000007',
                  },
                ],
              },
              meta: [
                'face0000000040008000000000000000' + '000000000006',
                'face0000000040008000000000000000' + '000000000005',
                'face0000000040008000000000000000' + '000000000007',
              ],
            },
            ['face0000000040008000000000000000' + '000000000005']: {
              hash: 'face0000000040008000000000000000' + '000000000005',
              data: {
                meta: {
                  type: 1,
                  basisHash:
                    'face0000000040008000000000000000' + '000000000003',
                  lastMutationID: 1,
                },
                valueHash: 'face0000000040008000000000000000' + '000000000002',
                indexes: [
                  {
                    definition: {
                      name: 'testIndex',
                      keyPrefix: '',
                      jsonPointer: '/name',
                      allowEmpty: true,
                    },
                    valueHash:
                      'face0000000040008000000000000000' + '000000000004',
                  },
                ],
              },
              meta: [
                'face0000000040008000000000000000' + '000000000002',
                'face0000000040008000000000000000' + '000000000003',
                'face0000000040008000000000000000' + '000000000004',
              ],
            },
            ['face0000000040008000000000000000' + '000000000006']: {
              hash: 'face0000000040008000000000000000' + '000000000006',
              data: [
                0,
                [
                  ['a', 1],
                  [
                    'b',
                    {
                      name: 'b-name',
                    },
                  ],
                  [
                    'c',
                    {
                      name: 'c-name',
                    },
                  ],
                ],
              ],
              meta: [],
            },
            ['face0000000040008000000000000000' + '000000000007']: {
              hash: 'face0000000040008000000000000000' + '000000000007',
              data: [
                0,
                [
                  [
                    '\u0000b-name\u0000b',
                    {
                      name: 'b-name',
                    },
                  ],
                  [
                    '\u0000c-name\u0000c',
                    {
                      name: 'c-name',
                    },
                  ],
                ],
              ],
              meta: [],
            },
            ['face0000000040008000000000000000' + '000000000004']: {
              hash: 'face0000000040008000000000000000' + '000000000004',
              data: [
                0,
                [
                  [
                    '\u0000b-name\u0000b',
                    {
                      name: 'b-name',
                    },
                  ],
                ],
              ],
              meta: [],
            },
          },
    );
  });
});
