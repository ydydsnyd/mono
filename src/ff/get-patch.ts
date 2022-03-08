import * as s from "superstruct";
import type { Patch } from "../protocol/poke.js";
import { userValuePrefix, userValueSchema } from "../types/user-value.js";
import type { Version } from "../types/version.js";

export async function getPatch(
  durable: DurableObjectStorage,
  fromCookie: Version
): Promise<Patch> {
  const result = await durable.list({
    prefix: userValuePrefix,
    allowConcurrency: true,
  });

  const patch: Patch = [];
  for (const [key, value] of result) {
    s.assert(value, userValueSchema);
    const validValue = value;

    // TODO: More efficient way of finding changed values.
    if (validValue.version <= fromCookie) {
      continue;
    }

    const unwrappedKey = key.substring(userValuePrefix.length);
    const unwrappedValue = validValue.value;
    if (validValue.deleted) {
      patch.push({
        op: "del",
        key: unwrappedKey,
      });
    } else {
      patch.push({
        op: "put",
        key: unwrappedKey,
        value: unwrappedValue,
      });
    }
  }
  return patch;
}
