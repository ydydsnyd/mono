import {expect, describe, test} from '@jest/globals';
import type {NullableVersion} from 'reflect-protocol';
import type {PatchOperation} from 'replicache';
import {getPatches} from '../../src/ff/get-patch.js';
import {DurableStorage} from '../../src/storage/durable-storage.js';
import {ReplicacheTransaction} from '../../src/storage/replicache-transaction.js';
import {createSilentLogContext} from '../util/test-utils.js';

const {roomDO} = getMiniflareBindings();
const id = roomDO.newUniqueId();

describe('getPatches', () => {
  type Case = {
    name: string;
    // undefined value means delete
    muts: {key: string; value?: string; mutationID: number; version: number}[];
    expected: [NullableVersion, PatchOperation[]][];
  };

  const cases: Case[] = [
    {
      name: 'add a+b',
      muts: [
        {key: 'a', mutationID: 1, value: 'a1', version: 2},
        {key: 'b', mutationID: 1, value: 'b1', version: 2},
      ],
      expected: [
        [2, []], // Nothing for a client that's up to date.
        [
          null,
          [
            {
              op: 'put',
              key: 'a',
              value: 'a1',
            },
            {
              op: 'put',
              key: 'b',
              value: 'b1',
            },
          ],
        ],
      ],
    },
    {
      name: 'del b, diff from null',
      muts: [{key: 'b', mutationID: 2, version: 3}],
      expected: [
        [
          null,
          [
            {
              op: 'put',
              key: 'a',
              value: 'a1',
            },
            // no delete for b because diff is from null
          ],
        ],
        [
          1, // diff from 1
          [
            {
              op: 'put',
              key: 'a',
              value: 'a1',
            },
            {
              op: 'del',
              key: 'b',
            },
          ],
        ],
        [
          2, // diff from 2
          [
            {
              op: 'del',
              key: 'b',
            },
          ],
        ],
      ],
    },
    {
      name: 'add b',
      muts: [{key: 'b', mutationID: 3, value: 'b2', version: 4}],
      expected: [
        [
          0, // diff from 0
          [
            {
              op: 'put',
              key: 'a',
              value: 'a1',
            },
            {
              op: 'put',
              key: 'b',
              value: 'b2',
            },
          ],
        ],
        [
          2, // diff from 2 after b re-added'
          [
            {
              op: 'put',
              key: 'b',
              value: 'b2',
            },
          ],
        ],
        [
          3, // diff from 3
          [
            {
              op: 'put',
              key: 'b',
              value: 'b2',
            },
          ],
        ],
        [4, []], // diff from 4
      ],
    },
    {
      name: 'del a',
      muts: [{key: 'a', mutationID: 4, version: 5}],
      expected: [
        [5, []], // diff from 5
        [
          4, // diff from 4
          [
            {
              op: 'del',
              key: 'a',
            },
          ],
        ],
      ],
    },
  ];

  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    test(c.name, async () => {
      const durable = await getMiniflareDurableObjectStorage(id);
      await durable.deleteAll();
      const storage = new DurableStorage(durable);
      // The cases build on each other, apply mutations from
      // all previous cases, and this case.
      for (const p of cases.slice(0, i + 1).flatMap(c => c.muts || [])) {
        const tx = new ReplicacheTransaction(
          storage,
          'c1',
          p.mutationID,
          p.version,
          undefined,
        );
        if (p.value !== undefined) {
          await tx.put(p.key, p.value);
        } else {
          await tx.del(p.key);
        }
      }
      const patches = await getPatches(
        createSilentLogContext(),
        storage,
        new Set(c.expected.map(([version]) => version)),
      );
      console.log(patches);
      expect(patches).toEqual(new Map(c.expected));
    });
  }
});
