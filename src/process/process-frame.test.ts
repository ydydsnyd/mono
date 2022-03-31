import { test, expect } from "@jest/globals";
import * as s from "superstruct";
import type { WriteTransaction } from "replicache";
import type { JSONType } from "../../src/protocol/json.js";
import { DurableStorage } from "../../src/storage/durable-storage.js";
import type { ClientMutation } from "../../src/types/client-mutation.js";
import type { ClientPokeBody } from "../../src/types/client-poke-body.js";
import {
  ClientRecord,
  clientRecordKey,
} from "../../src/types/client-record.js";
import type { ClientID } from "../../src/types/client-state.js";
import { UserValue, userValueKey } from "../../src/types/user-value.js";
import { Version, versionKey } from "../../src/types/version.js";
import {
  clientMutation,
  clientRecord,
  createSilentLogContext,
  userValue,
} from "../util/test-utils.js";
import { processFrame } from "../../src/process/process-frame.js";

const { roomDO } = getMiniflareBindings();
const id = roomDO.newUniqueId();

test("processFrame", async () => {
  const records = new Map([
    [clientRecordKey("c1"), clientRecord(null, 1)],
    [clientRecordKey("c2"), clientRecord(1, 7)],
  ]);
  const startTime = 100;
  const startVersion = 1;
  const endVersion = 2;

  type Case = {
    name: string;
    mutations: ClientMutation[];
    clients: ClientID[];
    expectedPokes: ClientPokeBody[];
    expectedUserValues: Map<string, UserValue>;
    expectedClientRecords: Map<string, ClientRecord>;
    expectedVersion: Version;
  };

  const mutators = new Map(
    Object.entries({
      put: async (
        tx: WriteTransaction,
        { key, value }: { key: string; value: JSONType }
      ) => {
        await tx.put(key, value);
      },
      del: async (tx: WriteTransaction, { key }: { key: string }) => {
        await tx.del(key);
      },
    })
  );

  const cases: Case[] = [
    {
      name: "no mutations, no clients",
      mutations: [],
      clients: [],
      expectedPokes: [],
      expectedUserValues: new Map(),
      expectedClientRecords: records,
      expectedVersion: startVersion,
    },
    {
      name: "no mutations, one client",
      mutations: [],
      clients: ["c1"],
      expectedPokes: [],
      expectedUserValues: new Map(),
      expectedClientRecords: records,
      expectedVersion: startVersion,
    },
    {
      name: "one mutation, one client",
      mutations: [clientMutation("c1", 2, "put", { key: "foo", value: "bar" })],
      clients: ["c1"],
      expectedPokes: [
        {
          clientID: "c1",
          poke: {
            baseCookie: startVersion,
            cookie: endVersion,
            lastMutationID: 2,
            patch: [
              {
                op: "put",
                key: "foo",
                value: "bar",
              },
            ],
            timestamp: startTime,
          },
        },
      ],
      expectedUserValues: new Map([
        [userValueKey("foo"), userValue("bar", endVersion)],
      ]),
      expectedClientRecords: new Map([
        ...records,
        [clientRecordKey("c1"), clientRecord(endVersion, 2)],
      ]),
      expectedVersion: endVersion,
    },
    {
      name: "one mutation, two clients",
      mutations: [clientMutation("c1", 2, "put", { key: "foo", value: "bar" })],
      clients: ["c1", "c2"],
      expectedPokes: [
        {
          clientID: "c1",
          poke: {
            baseCookie: startVersion,
            cookie: endVersion,
            lastMutationID: 2,
            patch: [
              {
                op: "put",
                key: "foo",
                value: "bar",
              },
            ],
            timestamp: startTime,
          },
        },
        {
          clientID: "c2",
          poke: {
            baseCookie: startVersion,
            cookie: endVersion,
            lastMutationID: 7,
            patch: [
              {
                op: "put",
                key: "foo",
                value: "bar",
              },
            ],
            timestamp: startTime,
          },
        },
      ],
      expectedUserValues: new Map([
        [userValueKey("foo"), userValue("bar", endVersion)],
      ]),
      expectedClientRecords: new Map([
        [clientRecordKey("c1"), clientRecord(endVersion, 2)],
        [clientRecordKey("c2"), clientRecord(endVersion, 7)],
      ]),
      expectedVersion: endVersion,
    },
    {
      name: "two mutations, one client, one key",
      mutations: [
        clientMutation("c1", 2, "put", { key: "foo", value: "bar" }),
        clientMutation("c1", 3, "put", { key: "foo", value: "baz" }),
      ],
      clients: ["c1"],
      expectedPokes: [
        {
          clientID: "c1",
          poke: {
            baseCookie: startVersion,
            cookie: endVersion,
            lastMutationID: 3,
            patch: [
              {
                op: "put",
                key: "foo",
                value: "baz",
              },
            ],
            timestamp: startTime,
          },
        },
      ],
      expectedUserValues: new Map([
        [userValueKey("foo"), userValue("baz", endVersion)],
      ]),
      expectedClientRecords: new Map([
        ...records,
        [clientRecordKey("c1"), clientRecord(endVersion, 3)],
      ]),
      expectedVersion: endVersion,
    },
  ];

  const durable = await getMiniflareDurableObjectStorage(id);

  for (const c of cases) {
    const storage = new DurableStorage(durable);

    await storage.put(versionKey, startVersion);
    for (const [key, value] of records) {
      await storage.put(key, value);
    }

    const result = await processFrame(
      createSilentLogContext(),
      c.mutations,
      mutators,
      c.clients,
      storage,
      startTime
    );

    expect(result).toEqual(c.expectedPokes);

    const expectedState = new Map([
      ...(c.expectedUserValues as Map<string, JSONType>),
      ...(c.expectedClientRecords as Map<string, JSONType>),
      [versionKey, c.expectedVersion],
    ]);
    expect((await durable.list()).size).toEqual(expectedState.size);
    for (const [key, value] of expectedState) {
      expect(await storage.get(key, s.any())).toEqual(value);
    }
  }
});
