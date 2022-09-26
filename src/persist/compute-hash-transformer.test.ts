import {assert} from '@esm-bundle/chai';
import * as dag from '../dag/mod';
import * as db from '../db/mod';
import {
  makeNewFakeHashFunction,
  makeNewTempHashFunction,
  parse as parseHash,
} from '../hash';
import {BTreeWrite} from '../btree/write';
import {ComputeHashTransformer} from './compute-hash-transformer';
import type {ReadonlyJSONValue} from '../json';

test('fix hashes up of a single snapshot commit with empty btree', async () => {
  const clientID = 'client-id';
  const memdag = new dag.TestStore(
    undefined,
    makeNewTempHashFunction(),
    () => undefined,
  );

  const [headChunk, treeChunk] = await memdag.withWrite(async dagWrite => {
    const tree = new BTreeWrite(dagWrite);
    const valueHash = await tree.flush();
    const c = DD31
      ? db.newSnapshotDD31(
          dagWrite.createChunk,
          null,
          {[clientID]: 0},
          null,
          valueHash,
          [],
        )
      : db.newSnapshot(dagWrite.createChunk, null, 0, null, valueHash, []);
    await dagWrite.putChunk(c.chunk);
    await dagWrite.setHead('test', c.chunk.hash);
    await dagWrite.commit();
    return [c.chunk, await dagWrite.getChunk(valueHash)];
  });

  const snapshot = memdag.kvStore.snapshot();
  assert.deepEqual(snapshot, {
    'c/t/0000000000000000000000000000000000/d': [0, []],
    'c/t/0000000000000000000000000000000001/d': {
      meta: makeSnapshotMetaForTesting(clientID),
      valueHash: 't/0000000000000000000000000000000000',
      indexes: [],
    },
    'c/t/0000000000000000000000000000000001/m': [
      't/0000000000000000000000000000000000',
    ],
    'h/test': 't/0000000000000000000000000000000001',
    'c/t/0000000000000000000000000000000000/r': 1,
    'c/t/0000000000000000000000000000000001/r': 1,
  });

  if (!treeChunk) {
    assert.fail();
  }

  const gatheredChunk = new Map([
    [headChunk.hash, headChunk],
    [treeChunk.hash, treeChunk],
  ]);

  const hashFunc = makeNewFakeHashFunction('9ea');

  const transformer = new ComputeHashTransformer(gatheredChunk, hashFunc);
  const newHeadHash = await transformer.transformCommit(headChunk.hash);
  assert.equal(
    newHeadHash,
    parseHash(
      DD31
        ? '9ea00000-0000-4000-8000-000000000001'
        : '9ea00000-0000-4000-8000-000000000001',
    ),
  );

  assert.deepEqual(Object.fromEntries(transformer.fixedChunks), {
    '9ea00000-0000-4000-8000-000000000000': {
      data: [0, []],
      hash: '9ea00000-0000-4000-8000-000000000000',
      meta: [],
    },
    [DD31
      ? '9ea00000-0000-4000-8000-000000000001'
      : '9ea00000-0000-4000-8000-000000000001']: {
      data: {
        indexes: [],
        meta: makeSnapshotMetaForTesting(clientID),
        valueHash: '9ea00000-0000-4000-8000-000000000000',
      },
      hash: DD31
        ? '9ea00000-0000-4000-8000-000000000001'
        : '9ea00000-0000-4000-8000-000000000001',
      meta: ['9ea00000-0000-4000-8000-000000000000'],
    },
  });

  {
    // And again but only with the snapshot commit
    memdag.kvStore.restoreSnapshot(snapshot);

    const gatheredChunk = new Map([[headChunk.hash, headChunk]]);

    const transformer = new ComputeHashTransformer(gatheredChunk, hashFunc);
    const newHeadHash = await transformer.transformCommit(headChunk.hash);
    assert.equal(
      newHeadHash,
      parseHash('9ea00000-0000-4000-8000-000000000002'),
    );

    assert.deepEqual(Object.fromEntries(transformer.fixedChunks), {
      ['9ea00000-0000-4000-8000-000000000002']: {
        data: {
          indexes: [],
          meta: makeSnapshotMetaForTesting(clientID),
          valueHash: 't/0000000000000000000000000000000000',
        },
        hash: '9ea00000-0000-4000-8000-000000000002',
        meta: ['t/0000000000000000000000000000000000'],
      },
    });
  }
});

function makeSnapshotMetaForTesting(
  clientID: string,
): ReadonlyJSONValue | undefined {
  return DD31
    ? {
        basisHash: null,
        cookieJSON: null,
        lastMutationIDs: {[clientID]: 0},
        type: 3,
      }
    : {
        basisHash: null,
        cookieJSON: null,
        lastMutationID: 0,
        type: 3,
      };
}
