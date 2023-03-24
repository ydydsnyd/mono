import {assert} from 'shared/asserts.js';
import * as valita from 'shared/valita.js';
import {Hash, hashSchema, newUUIDHash} from '../hash.js';
import {assertDeepFrozen} from '../json.js';

type Refs = readonly Hash[];

export class Chunk<V = unknown> {
  readonly hash: Hash;
  readonly data: V;

  /**
   * Meta is an array of refs. If there are no refs we do not write a meta
   * chunk.
   */
  readonly meta: Refs;

  constructor(hash: Hash, data: V, meta: Refs) {
    assert(!meta.includes(hash), 'Chunk cannot reference itself');
    assertDeepFrozen(data);
    this.hash = hash;
    this.data = data;
    this.meta = meta;
  }
}

const refsSchema = valita.array(hashSchema);

export function assertMeta(v: unknown): asserts v is Refs {
  valita.assert(v, refsSchema);
}

export function createChunk<V>(
  data: V,
  refs: Refs,
  chunkHasher: ChunkHasher,
): Chunk<V> {
  const hash = chunkHasher();
  return new Chunk(hash, data, refs);
}

export type CreateChunk = <V>(data: V, refs: Refs) => Chunk<V>;

export type ChunkHasher = () => Hash;

export {newUUIDHash as uuidChunkHasher};

export function throwChunkHasher(): Hash {
  throw new Error('unexpected call to compute chunk hash');
}
