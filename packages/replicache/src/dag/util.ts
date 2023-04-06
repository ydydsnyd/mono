import {assert} from 'shared/asserts.js';
import type {Hash} from '../hash.js';
import type {Chunk} from './chunk.js';
import type {LazyRead} from './lazy-store.js';
import type {Read} from './store.js';
import {Visitor} from './visitor.js';

export async function assertNonePresent(
  dagRead: Read,
  hashes: Iterable<Hash>,
): Promise<void> {
  for (const hash of hashes) {
    const chunk = await dagRead.getChunk(hash);
    assert(!chunk, `chunk ${hash} unexpectedly present`);
  }
}

export async function assertAllPresent(
  dagRead: Read,
  hashes: Iterable<Hash>,
): Promise<void> {
  for (const hash of hashes) {
    const chunk = await dagRead.getChunk(hash);
    assert(chunk, `chunk ${hash} unexpectedly missing`);
  }
}

export function assertAllMemOnly(
  dagRead: LazyRead,
  hashes: Iterable<Hash>,
): void {
  for (const hash of hashes) {
    assert(
      dagRead.isMemOnlyChunkHash(hash),
      `chunk ${hash} unexpectedly not memory only`,
    );
  }
}

export function assertNoneMemOnly(
  dagRead: LazyRead,
  hashes: Iterable<Hash>,
): void {
  for (const hash of hashes) {
    assert(
      !dagRead.isMemOnlyChunkHash(hash),
      `chunk ${hash} unexpectedly memory only`,
    );
  }
}

export async function containsHash(read: Read, needle: Hash, haystack: Hash) {
  if (needle === haystack) {
    return true;
  }
  const chunk = await read.mustGetChunk(haystack);
  for (const ref of chunk.meta) {
    if (await containsHash(read, needle, ref)) {
      return true;
    }
  }
  return false;
}

export async function removeExistingChunks(
  dagRead: Read,
  chunks: ReadonlyMap<Hash, Chunk>,
): Promise<ReadonlyMap<Hash, Chunk>> {
  const ps = [];
  for (const hash of chunks.keys()) {
    ps.push(dagRead.hasChunk(hash).then(has => (has ? hash : null)));
  }

  const result = new Map(chunks);
  for (const hash of await Promise.all(ps)) {
    if (hash && result.has(hash)) {
      result.delete(hash);
    }
  }
  return result;
}

export function assertNoMissingChunks(dagRead: Read, h: Hash): Promise<void> {
  const v = new Visitor(dagRead);
  return v.visit(h);
}
