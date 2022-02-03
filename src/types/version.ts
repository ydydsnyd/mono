import { z } from "zod";
import type { Storage } from "../storage/storage.js";

export const versionSchema = z.number();
export const nullableVersionSchema = z.union([versionSchema, z.null()]);

export type Version = z.infer<typeof versionSchema>;
export type NullableVersion = z.infer<typeof nullableVersionSchema>;

export const versionKey = "version";

export async function putVersion(
  version: Version,
  storage: Storage
): Promise<void> {
  await storage.put(versionKey, version);
}

export async function getVersion(
  storage: Storage
): Promise<Version | undefined> {
  return await storage.get(versionKey, versionSchema);
}
