import type { JSONValue } from "replicache";
import type * as z from "superstruct";

/**
 * Abstract storage interface used throughout the server for storing both user
 * and system data.
 */
export interface Storage {
  put<T extends JSONValue>(key: string, value: T): Promise<void>;
  del(key: string): Promise<void>;
  get<T extends JSONValue>(
    key: string,
    schema: z.Struct<T>
  ): Promise<T | undefined>;
  // TODO: support for scanning.
}
