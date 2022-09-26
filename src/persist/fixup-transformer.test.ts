import {assert} from '@esm-bundle/chai';
import * as dag from '../dag/mod';
import * as db from '../db/mod';
import {fakeHash, makeNewTempHashFunction, parse as parseHash} from '../hash';
import {BTreeWrite} from '../btree/write';
import {FixupTransformer} from './fixup-transformer';
import type {JSONObject, ReadonlyJSONValue} from '../json';
import {toInternalValue, ToInternalValueReason} from '../internal-value.js';

test('fixup of a single snapshot commit with empty btree', async () => {
  const clientID = 'client-id';

  const memdag = new dag.TestStore(
    undefined,
    makeNewTempHashFunction(),
    () => undefined,
  );

  const [headHash, valueHash] = await memdag.withWrite(async dagWrite => {
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
    return [c.chunk.hash, valueHash];
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

  const mappings = new Map([
    [headHash, fakeHash('ead')],
    [valueHash, fakeHash('ae')],
  ]);

  const newHeadHash = await memdag.withWrite(async dagWrite => {
    const transformer = new FixupTransformer(dagWrite, mappings);
    const newHeadHash = await transformer.transformCommit(headHash);

    await dagWrite.setHead('test', newHeadHash);
    await dagWrite.commit();
    return newHeadHash;
  });

  assert.equal(newHeadHash, fakeHash('ead'));

  assert.deepEqual(memdag.kvStore.snapshot(), {
    'h/test': 'face0000-0000-4000-8000-000000000ead',
    'c/face0000-0000-4000-8000-0000000000ae/d': [0, []],
    'c/face0000-0000-4000-8000-000000000ead/d': {
      meta: makeSnapshotMetaForTesting(clientID),
      valueHash: 'face0000-0000-4000-8000-0000000000ae',
      indexes: [],
    },
    'c/face0000-0000-4000-8000-000000000ead/m': [
      'face0000-0000-4000-8000-0000000000ae',
    ],
    'c/face0000-0000-4000-8000-0000000000ae/r': 1,
    'c/face0000-0000-4000-8000-000000000ead/r': 1,
  });

  // Now add a local commit on top of the snapshot commit.
  {
    const headHash = await memdag.withWrite(async dagWrite => {
      const c = db.newLocal(
        dagWrite.createChunk,
        newHeadHash,
        1,
        'test',
        toInternalValue({v: 42}, ToInternalValueReason.Test),
        null,
        fakeHash('ae'),
        [],
        42,
        clientID,
      );
      await dagWrite.putChunk(c.chunk);
      await dagWrite.setHead('test', c.chunk.hash);
      await dagWrite.commit();
      return c.chunk.hash;
    });

    const meta: JSONObject = {
      basisHash: 'face0000-0000-4000-8000-000000000ead',
      mutationID: 1,
      mutatorArgsJSON: {
        v: 42,
      },
      mutatorName: 'test',
      originalHash: null,
      timestamp: 42,
      type: 2,
    };
    if (DD31) {
      meta.clientID = clientID;
    }
    assert.deepEqual(memdag.kvStore.snapshot(), {
      'c/face0000-0000-4000-8000-000000000ead/d': {
        indexes: [],
        meta: makeSnapshotMetaForTesting(clientID),
        valueHash: 'face0000-0000-4000-8000-0000000000ae',
      },
      'c/face0000-0000-4000-8000-000000000ead/m': [
        'face0000-0000-4000-8000-0000000000ae',
      ],
      'c/face0000-0000-4000-8000-000000000ead/r': 1,
      'c/face0000-0000-4000-8000-0000000000ae/d': [0, []],
      'c/face0000-0000-4000-8000-0000000000ae/r': 2,
      'c/t/0000000000000000000000000000000002/d': {
        indexes: [],
        meta,
        valueHash: 'face0000-0000-4000-8000-0000000000ae',
      },
      'c/t/0000000000000000000000000000000002/m': [
        'face0000-0000-4000-8000-0000000000ae',
        'face0000-0000-4000-8000-000000000ead',
      ],
      'c/t/0000000000000000000000000000000002/r': 1,
      'h/test': 't/0000000000000000000000000000000002',
    });

    const mappings = new Map([[headHash, fakeHash('ead2')]]);

    const newHeadHash2 = await memdag.withWrite(async dagWrite => {
      const transformer = new FixupTransformer(dagWrite, mappings);
      const newHeadHash = await transformer.transformCommit(headHash);

      await dagWrite.setHead('test', newHeadHash);
      await dagWrite.commit();
      return newHeadHash;
    });

    {
      const meta: JSONObject = {
        basisHash: 'face0000-0000-4000-8000-000000000ead',
        mutationID: 1,
        mutatorArgsJSON: {
          v: 42,
        },
        mutatorName: 'test',
        originalHash: null,
        timestamp: 42,
        type: 2,
      };
      if (DD31) {
        meta.clientID = clientID;
      }
      assert.deepEqual(memdag.kvStore.snapshot(), {
        'c/face0000-0000-4000-8000-000000000ead/d': {
          indexes: [],
          meta: DD31
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
              },
          valueHash: 'face0000-0000-4000-8000-0000000000ae',
        },
        'c/face0000-0000-4000-8000-000000000ead/m': [
          'face0000-0000-4000-8000-0000000000ae',
        ],
        'c/face0000-0000-4000-8000-000000000ead/r': 1,
        'c/face0000-0000-4000-8000-00000000ead2/d': {
          indexes: [],
          meta,
          valueHash: 'face0000-0000-4000-8000-0000000000ae',
        },
        'c/face0000-0000-4000-8000-00000000ead2/m': [
          'face0000-0000-4000-8000-0000000000ae',
          'face0000-0000-4000-8000-000000000ead',
        ],
        'c/face0000-0000-4000-8000-00000000ead2/r': 1,
        'c/face0000-0000-4000-8000-0000000000ae/d': [0, []],
        'c/face0000-0000-4000-8000-0000000000ae/r': 2,
        'h/test': 'face0000-0000-4000-8000-00000000ead2',
      });
      assert.equal(newHeadHash2, fakeHash('ead2'));
    }
  }
});

test('fixup base snapshot when there is a local commit on top of it', async () => {
  const clientID = 'client-id';
  const memdag = new dag.TestStore(
    undefined,
    makeNewTempHashFunction(),
    () => undefined,
  );

  const [snapshotCommit, localCommit, valueHash] = await memdag.withWrite(
    async dagWrite => {
      const tree = new BTreeWrite(dagWrite);
      const valueHash = await tree.flush();
      const snapshotCommit = DD31
        ? db.newSnapshotDD31(
            dagWrite.createChunk,
            null,
            {[clientID]: 0},
            null,
            valueHash,
            [],
          )
        : db.newSnapshot(dagWrite.createChunk, null, 0, null, valueHash, []);
      await dagWrite.putChunk(snapshotCommit.chunk);

      const localCommit = db.newLocal(
        dagWrite.createChunk,
        snapshotCommit.chunk.hash,
        1,
        'test',
        toInternalValue({v: 42}, ToInternalValueReason.Test),
        null,
        fakeHash('ae'),
        [],
        42,
        clientID,
      );
      await dagWrite.putChunk(localCommit.chunk);

      await dagWrite.setHead('test', localCommit.chunk.hash);
      await dagWrite.commit();
      return [snapshotCommit, localCommit, valueHash];
    },
  );
  {
    const meta: JSONObject = {
      basisHash: 't/0000000000000000000000000000000001',
      mutationID: 1,
      mutatorArgsJSON: {
        v: 42,
      },
      mutatorName: 'test',
      originalHash: null,
      timestamp: 42,
      type: 2,
    };
    if (DD31) {
      meta.clientID = clientID;
    }
    assert.deepEqual(memdag.kvStore.snapshot(), {
      'c/face0000-0000-4000-8000-0000000000ae/r': 1,
      'c/t/0000000000000000000000000000000000/d': [0, []],
      'c/t/0000000000000000000000000000000000/r': 1,
      'c/t/0000000000000000000000000000000001/d': {
        indexes: [],
        meta: DD31
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
            },
        valueHash: 't/0000000000000000000000000000000000',
      },
      'c/t/0000000000000000000000000000000001/m': [
        't/0000000000000000000000000000000000',
      ],
      'c/t/0000000000000000000000000000000001/r': 1,
      'c/t/0000000000000000000000000000000002/d': {
        indexes: [],
        meta,
        valueHash: 'face0000-0000-4000-8000-0000000000ae',
      },
      'c/t/0000000000000000000000000000000002/m': [
        'face0000-0000-4000-8000-0000000000ae',
        't/0000000000000000000000000000000001',
      ],
      'c/t/0000000000000000000000000000000002/r': 1,
      'h/test': 't/0000000000000000000000000000000002',
    });
  }

  // These mappings do not contain the local commit. This is simulating that a
  // local commit happened after we got the result back from the perdag persist
  // part.
  const mappings = new Map([
    [snapshotCommit.chunk.hash, fakeHash('a11')],
    [valueHash, fakeHash('ae')],
  ]);

  const newLocalCommitHash = await memdag.withWrite(async dagWrite => {
    const transformer = new FixupTransformer(dagWrite, mappings);
    const newLocalCommitHash = await transformer.transformCommit(
      localCommit.chunk.hash,
    );

    await dagWrite.setHead('test', newLocalCommitHash);
    await dagWrite.commit();
    return newLocalCommitHash;
  });

  assert.notEqual(newLocalCommitHash, localCommit.chunk.hash);

  {
    const meta: JSONObject = {
      basisHash: 'face0000-0000-4000-8000-000000000a11',
      mutationID: 1,
      mutatorArgsJSON: {
        v: 42,
      },
      mutatorName: 'test',
      originalHash: null,
      timestamp: 42,
      type: 2,
    };
    if (DD31) {
      meta.clientID = clientID;
    }
    assert.deepEqual(memdag.kvStore.snapshot(), {
      'c/face0000-0000-4000-8000-0000000000ae/d': [0, []],
      'c/face0000-0000-4000-8000-0000000000ae/r': 2,
      'c/face0000-0000-4000-8000-000000000a11/d': {
        indexes: [],
        meta: makeSnapshotMetaForTesting(clientID),
        valueHash: 'face0000-0000-4000-8000-0000000000ae',
      },
      'c/face0000-0000-4000-8000-000000000a11/m': [
        'face0000-0000-4000-8000-0000000000ae',
      ],
      'c/face0000-0000-4000-8000-000000000a11/r': 1,
      'c/t/0000000000000000000000000000000003/d': {
        indexes: [],
        meta,
        valueHash: 'face0000-0000-4000-8000-0000000000ae',
      },
      'c/t/0000000000000000000000000000000003/m': [
        'face0000-0000-4000-8000-0000000000ae',
        'face0000-0000-4000-8000-000000000a11',
      ],
      'c/t/0000000000000000000000000000000003/r': 1,
      'h/test': 't/0000000000000000000000000000000003',
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

async function makeBTree(
  dagWrite: dag.Write,
  entries: [string, ReadonlyJSONValue][],
): Promise<BTreeWrite> {
  const tree = new BTreeWrite(dagWrite, undefined, 2, 4, () => 1, 0);
  for (const [k, v] of entries) {
    await tree.put(k, toInternalValue(v, ToInternalValueReason.Test));
  }
  return tree;
}

test('fixup of a single snapshot commit with a btree with internal nodes', async () => {
  const clientID = 'client-id';
  const memdag = new dag.TestStore(
    undefined,
    makeNewTempHashFunction(),
    () => undefined,
  );

  const entries = Object.entries({
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
  });

  const [headHash, valueHash] = await memdag.withWrite(async dagWrite => {
    const tree = await makeBTree(dagWrite, entries);

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
    return [c.chunk.hash, valueHash];
  });

  assert.deepEqual(
    memdag.kvStore.snapshot(),

    {
      'c/t/0000000000000000000000000000000000/d': [
        0,
        [
          ['a', 0],
          ['b', 1],
        ],
      ],
      'c/t/0000000000000000000000000000000001/d': [
        0,
        [
          ['c', 2],
          ['d', 3],
          ['e', 4],
          ['f', 5],
        ],
      ],
      'c/t/0000000000000000000000000000000002/d': [
        1,
        [
          ['b', 't/0000000000000000000000000000000000'],
          ['f', 't/0000000000000000000000000000000001'],
        ],
      ],
      'c/t/0000000000000000000000000000000002/m': [
        't/0000000000000000000000000000000000',
        't/0000000000000000000000000000000001',
      ],
      'c/t/0000000000000000000000000000000003/d': {
        meta: makeSnapshotMetaForTesting(clientID),
        valueHash: 't/0000000000000000000000000000000002',
        indexes: [],
      },
      'c/t/0000000000000000000000000000000003/m': [
        't/0000000000000000000000000000000002',
      ],
      'h/test': 't/0000000000000000000000000000000003',
      'c/t/0000000000000000000000000000000000/r': 1,
      'c/t/0000000000000000000000000000000001/r': 1,
      'c/t/0000000000000000000000000000000002/r': 1,
      'c/t/0000000000000000000000000000000003/r': 1,
    },
  );

  const mappings = new Map([
    [headHash, fakeHash('ead')],
    [valueHash, fakeHash('ae')],
    [parseHash('t/0000000000000000000000000000000000'), fakeHash('daa0')],
    [parseHash('t/0000000000000000000000000000000001'), fakeHash('daa1')],
  ]);

  const newHeadHash = await memdag.withWrite(async dagWrite => {
    const transformer = new FixupTransformer(dagWrite, mappings);
    const newHeadHash = await transformer.transformCommit(headHash);

    await dagWrite.setHead('test', newHeadHash);
    await dagWrite.commit();
    return newHeadHash;
  });

  assert.equal(newHeadHash, fakeHash('ead'));

  assert.deepEqual(
    memdag.kvStore.snapshot(),

    {
      'h/test': 'face0000-0000-4000-8000-000000000ead',
      'c/face0000-0000-4000-8000-00000000daa0/d': [
        0,
        [
          ['a', 0],
          ['b', 1],
        ],
      ],
      'c/face0000-0000-4000-8000-00000000daa1/d': [
        0,
        [
          ['c', 2],
          ['d', 3],
          ['e', 4],
          ['f', 5],
        ],
      ],
      'c/face0000-0000-4000-8000-0000000000ae/d': [
        1,
        [
          ['b', 'face0000-0000-4000-8000-00000000daa0'],
          ['f', 'face0000-0000-4000-8000-00000000daa1'],
        ],
      ],
      'c/face0000-0000-4000-8000-0000000000ae/m': [
        'face0000-0000-4000-8000-00000000daa0',
        'face0000-0000-4000-8000-00000000daa1',
      ],
      'c/face0000-0000-4000-8000-000000000ead/d': {
        meta: makeSnapshotMetaForTesting(clientID),
        valueHash: 'face0000-0000-4000-8000-0000000000ae',
        indexes: [],
      },
      'c/face0000-0000-4000-8000-000000000ead/m': [
        'face0000-0000-4000-8000-0000000000ae',
      ],
      'c/face0000-0000-4000-8000-00000000daa0/r': 1,
      'c/face0000-0000-4000-8000-00000000daa1/r': 1,
      'c/face0000-0000-4000-8000-0000000000ae/r': 1,
      'c/face0000-0000-4000-8000-000000000ead/r': 1,
    },
  );
});

test('fixup of a base snapshot with an index', async () => {
  const clientID = 'client-id';
  const memdag = new dag.TestStore(
    undefined,
    makeNewTempHashFunction(),
    () => undefined,
  );

  const entries = Object.entries({
    a: {a: '0'},
    b: {a: '1'},
    c: {a: '2'},
    d: {a: '3'},
    e: {a: '4'},
    f: {b: '5'},
  });

  const indexEntries: [string, ReadonlyJSONValue][] = [
    [db.encodeIndexKey(['0', 'a']), {a: '0'}],
    [db.encodeIndexKey(['1', 'b']), {a: '1'}],
    [db.encodeIndexKey(['2', 'c']), {a: '2'}],
    [db.encodeIndexKey(['3', 'd']), {a: '3'}],
    [db.encodeIndexKey(['4', 'e']), {a: '4'}],
  ];

  const [headHash, valueHash, indexHash] = await memdag.withWrite(
    async dagWrite => {
      const tree = await makeBTree(dagWrite, entries);
      const valueHash = await tree.flush();

      const indexTree = await makeBTree(dagWrite, indexEntries);
      const indexHash = await indexTree.flush();

      const indexes: db.IndexRecord = {
        definition: {
          name: 'idx',
          jsonPointer: '/a',
          prefix: '',
          allowEmpty: false,
        },
        valueHash: indexHash,
      };
      const c = DD31
        ? db.newSnapshotDD31(
            dagWrite.createChunk,
            null,
            {[clientID]: 0},
            null,
            valueHash,
            [indexes],
          )
        : db.newSnapshot(dagWrite.createChunk, null, 0, null, valueHash, [
            indexes,
          ]);
      await dagWrite.putChunk(c.chunk);
      await dagWrite.setHead('test', c.chunk.hash);
      await dagWrite.commit();
      return [c.chunk.hash, valueHash, indexHash];
    },
  );

  const snapshot = memdag.kvStore.snapshot();

  assert.deepEqual(snapshot, {
    'c/t/0000000000000000000000000000000000/d': [
      0,
      [
        ['a', {a: '0'}],
        ['b', {a: '1'}],
      ],
    ],
    'c/t/0000000000000000000000000000000001/d': [
      0,
      [
        ['c', {a: '2'}],
        ['d', {a: '3'}],
        ['e', {a: '4'}],
        ['f', {b: '5'}],
      ],
    ],
    'c/t/0000000000000000000000000000000002/d': [
      1,
      [
        ['b', 't/0000000000000000000000000000000000'],
        ['f', 't/0000000000000000000000000000000001'],
      ],
    ],
    'c/t/0000000000000000000000000000000002/m': [
      't/0000000000000000000000000000000000',
      't/0000000000000000000000000000000001',
    ],
    'c/t/0000000000000000000000000000000003/d': [
      0,
      [
        ['\u00000\u0000a', {a: '0'}],
        ['\u00001\u0000b', {a: '1'}],
      ],
    ],
    'c/t/0000000000000000000000000000000004/d': [
      0,
      [
        ['\u00002\u0000c', {a: '2'}],
        ['\u00003\u0000d', {a: '3'}],
        ['\u00004\u0000e', {a: '4'}],
      ],
    ],
    'c/t/0000000000000000000000000000000005/d': [
      1,
      [
        ['\u00001\u0000b', 't/0000000000000000000000000000000003'],
        ['\u00004\u0000e', 't/0000000000000000000000000000000004'],
      ],
    ],
    'c/t/0000000000000000000000000000000005/m': [
      't/0000000000000000000000000000000003',
      't/0000000000000000000000000000000004',
    ],
    'c/t/0000000000000000000000000000000006/d': {
      meta: makeSnapshotMetaForTesting(clientID),
      valueHash: 't/0000000000000000000000000000000002',
      indexes: [
        {
          definition: {
            allowEmpty: false,
            jsonPointer: '/a',
            prefix: '',
            name: 'idx',
          },
          valueHash: 't/0000000000000000000000000000000005',
        },
      ],
    },
    'c/t/0000000000000000000000000000000006/m': [
      't/0000000000000000000000000000000002',
      't/0000000000000000000000000000000005',
    ],
    'h/test': 't/0000000000000000000000000000000006',
    'c/t/0000000000000000000000000000000000/r': 1,
    'c/t/0000000000000000000000000000000001/r': 1,
    'c/t/0000000000000000000000000000000003/r': 1,
    'c/t/0000000000000000000000000000000004/r': 1,
    'c/t/0000000000000000000000000000000002/r': 1,
    'c/t/0000000000000000000000000000000005/r': 1,
    'c/t/0000000000000000000000000000000006/r': 1,
  });

  const mappings = new Map([
    [headHash, fakeHash('ead')],
    [valueHash, fakeHash('ae')],
    [indexHash, fakeHash('dec')],
    [parseHash('t/0000000000000000000000000000000000'), fakeHash('daa0')],
    [parseHash('t/0000000000000000000000000000000001'), fakeHash('daa1')],
    [parseHash('t/0000000000000000000000000000000003'), fakeHash('daa3')],
    [parseHash('t/0000000000000000000000000000000004'), fakeHash('daa4')],
  ]);

  const newHeadHash = await memdag.withWrite(async dagWrite => {
    const transformer = new FixupTransformer(dagWrite, mappings);
    const newHeadHash = await transformer.transformCommit(headHash);

    await dagWrite.setHead('test', newHeadHash);
    await dagWrite.commit();
    return newHeadHash;
  });

  assert.equal(newHeadHash, fakeHash('ead'));

  assert.deepEqual(memdag.kvStore.snapshot(), {
    'c/face0000-0000-4000-8000-000000000ead/d': {
      indexes: [
        {
          definition: {
            name: 'idx',
            jsonPointer: '/a',
            prefix: '',
            allowEmpty: false,
          },
          valueHash: 'face0000-0000-4000-8000-000000000dec',
        },
      ],
      meta: makeSnapshotMetaForTesting(clientID),
      valueHash: 'face0000-0000-4000-8000-0000000000ae',
    },
    'c/face0000-0000-4000-8000-000000000ead/m': [
      'face0000-0000-4000-8000-0000000000ae',
      'face0000-0000-4000-8000-000000000dec',
    ],
    'c/face0000-0000-4000-8000-000000000ead/r': 1,
    'c/face0000-0000-4000-8000-00000000daa0/d': [
      0,
      [
        [
          'a',
          {
            a: '0',
          },
        ],
        [
          'b',
          {
            a: '1',
          },
        ],
      ],
    ],
    'c/face0000-0000-4000-8000-00000000daa0/r': 1,
    'c/face0000-0000-4000-8000-00000000daa1/d': [
      0,
      [
        [
          'c',
          {
            a: '2',
          },
        ],
        [
          'd',
          {
            a: '3',
          },
        ],
        [
          'e',
          {
            a: '4',
          },
        ],
        [
          'f',
          {
            b: '5',
          },
        ],
      ],
    ],
    'c/face0000-0000-4000-8000-00000000daa1/r': 1,
    'c/face0000-0000-4000-8000-00000000daa3/d': [
      0,
      [
        [
          '\u00000\u0000a',
          {
            a: '0',
          },
        ],
        [
          '\u00001\u0000b',
          {
            a: '1',
          },
        ],
      ],
    ],
    'c/face0000-0000-4000-8000-00000000daa3/r': 1,
    'c/face0000-0000-4000-8000-00000000daa4/d': [
      0,
      [
        [
          '\u00002\u0000c',
          {
            a: '2',
          },
        ],
        [
          '\u00003\u0000d',
          {
            a: '3',
          },
        ],
        [
          '\u00004\u0000e',
          {
            a: '4',
          },
        ],
      ],
    ],
    'c/face0000-0000-4000-8000-00000000daa4/r': 1,
    'c/face0000-0000-4000-8000-000000000dec/d': [
      1,
      [
        ['\u00001\u0000b', 'face0000-0000-4000-8000-00000000daa3'],
        ['\u00004\u0000e', 'face0000-0000-4000-8000-00000000daa4'],
      ],
    ],
    'c/face0000-0000-4000-8000-000000000dec/m': [
      'face0000-0000-4000-8000-00000000daa3',
      'face0000-0000-4000-8000-00000000daa4',
    ],
    'c/face0000-0000-4000-8000-000000000dec/r': 1,
    'c/face0000-0000-4000-8000-0000000000ae/d': [
      1,
      [
        ['b', 'face0000-0000-4000-8000-00000000daa0'],
        ['f', 'face0000-0000-4000-8000-00000000daa1'],
      ],
    ],
    'c/face0000-0000-4000-8000-0000000000ae/m': [
      'face0000-0000-4000-8000-00000000daa0',
      'face0000-0000-4000-8000-00000000daa1',
    ],
    'c/face0000-0000-4000-8000-0000000000ae/r': 1,
    'h/test': 'face0000-0000-4000-8000-000000000ead',
  });
});
