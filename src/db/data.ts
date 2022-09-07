import type { JSONValue } from "replicache";
import type * as s from "superstruct";
import {
  superstructAssert,
  superstructAssertMapValues,
} from "../util/superstruct";

export async function getEntry<T extends JSONValue>(
  durable: DurableObjectStorage,
  key: string,
  schema: s.Struct<T>,
  options: DurableObjectGetOptions
): Promise<T | undefined> {
  const value = await durable.get(key, options);
  if (value === undefined) {
    return undefined;
  }
  superstructAssert(value, schema);
  return value;
}

export async function listEntries<T extends JSONValue>(
  durable: DurableObjectStorage,
  prefix: string,
  schema: s.Struct<T>,
  options: DurableObjectGetOptions
): Promise<Map<string, T>> {
  const result = await durable.list({
    ...options,
    prefix,
  });
  superstructAssertMapValues(result, schema);
  return result;
}

export async function putEntry<T extends JSONValue>(
  durable: DurableObjectStorage,
  key: string,
  value: T,
  options: DurableObjectPutOptions
): Promise<void> {
  await durable.put(key, value, options);
}

export async function delEntry(
  durable: DurableObjectStorage,
  key: string,
  options: DurableObjectPutOptions
): Promise<void> {
  await durable.delete(key, options);
}
