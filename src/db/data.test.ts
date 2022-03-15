import { test, expect } from "@jest/globals";
import * as s from "superstruct";
import { delEntry, getEntry, putEntry } from "./data.js";

const { roomDO } = getMiniflareBindings();
const id = roomDO.newUniqueId();

test("getEntry", async () => {
  type Case = {
    name: string;
    exists: boolean;
    validSchema: boolean;
  };
  const cases: Case[] = [
    {
      name: "does not exist",
      exists: false,
      validSchema: true,
    },
    // {
    //   name: "exists, invalid schema",
    //   exists: true,
    //   validSchema: false,
    // },
    {
      name: "exists, valid JSON, valid schema",
      exists: true,
      validSchema: true,
    },
  ];

  const storage = await getMiniflareDurableObjectStorage(id);

  for (const c of cases) {
    await storage.delete("foo");
    if (c.exists) {
      await storage.put("foo", c.validSchema ? 42 : {});
    }

    const promise = getEntry(storage, "foo", s.number());
    let result: number | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any | undefined;
    await promise.then(
      (r) => (result = r),
      (e) => (error = String(e))
    );
    if (!c.exists) {
      expect(result).toBeUndefined;
      expect(result).toBeUndefined;
      expect(error).toBeUndefined;
    } else if (!c.validSchema) {
      expect(result).toBeUndefined;
      expect(error).toContain("Expected number, received object");
    } else {
      expect(result).toEqual(42);
      expect(error).toBeUndefined;
    }
  }
});

test("getEntry RoundTrip types", async () => {
  const storage = await getMiniflareDurableObjectStorage(id);

  await putEntry(storage, "boolean", true);
  await putEntry(storage, "number", 42);
  await putEntry(storage, "string", "foo");
  await putEntry(storage, "array", [1, 2, 3]);
  await putEntry(storage, "object", { a: 1, b: 2 });

  expect(await getEntry(storage, "boolean", s.boolean())).toEqual(true);
  expect(await getEntry(storage, "number", s.number())).toEqual(42);
  expect(await getEntry(storage, "string", s.string())).toEqual("foo");
  expect(await getEntry(storage, "array", s.array(s.number()))).toEqual([
    1, 2, 3,
  ]);
  expect(
    await getEntry(
      storage,
      "object",
      s.object({ a: s.number(), b: s.number() })
    )
  ).toEqual({ a: 1, b: 2 });
});

test("putEntry", async () => {
  const storage = await getMiniflareDurableObjectStorage(id);

  type Case = {
    name: string;
    duplicate: boolean;
  };

  const cases: Case[] = [
    {
      name: "not duplicate",
      duplicate: false,
    },
    {
      name: "duplicate",
      duplicate: true,
    },
  ];

  for (const c of cases) {
    await storage.delete("foo");

    let res: Promise<void>;
    if (c.duplicate) {
      await putEntry(storage, "foo", 41);
      res = putEntry(storage, "foo", 42);
    } else {
      res = putEntry(storage, "foo", 42);
    }

    await res.catch(() => ({}));

    const value = await storage.get("foo");
    expect(value).toEqual(42);
  }
});

test("delEntry", async () => {
  const storage = await getMiniflareDurableObjectStorage(id);

  type Case = {
    name: string;
    exists: boolean;
  };
  const cases: Case[] = [
    {
      name: "does not exist",
      exists: false,
    },
    {
      name: "exists",
      exists: true,
    },
  ];

  for (const c of cases) {
    await storage.delete("foo");
    if (c.exists) {
      await storage.put("foo", 42);
    }

    await delEntry(storage, "foo");
    const value = storage.get("foo");
    expect(value).toBeUndefined;
  }
});
