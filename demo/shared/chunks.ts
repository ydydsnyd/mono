// Utilities for chunking data when writing/reading

import type {ReadTransaction, WriteTransaction} from '@rocicorp/reflect';
import {CACHE_CHUNK_STRING_SIZE} from './constants';

export const deleteChunked = async (tx: WriteTransaction, prefix: string) => {
  const chunkKeys = await tx.scan({prefix: `${prefix}/`}).keys();
  for await (const k of chunkKeys) {
    await tx.del(k);
  }
};

export const chunk = async (
  tx: WriteTransaction,
  prefix: string,
  value: string,
) => {
  await deleteChunked(tx, prefix);
  let lastIndex = 0;
  let chunkIdx = 0;
  const promises: Promise<void>[] = [];
  while (lastIndex < value.length) {
    promises.push(
      tx.put(
        `${prefix}/${chunkIdx}`,
        value.slice(lastIndex, lastIndex + CACHE_CHUNK_STRING_SIZE),
      ),
    );
    lastIndex += CACHE_CHUNK_STRING_SIZE;
    chunkIdx++;
  }
  await Promise.all(promises);
};

export const unchunk = async (
  tx: ReadTransaction,
  prefix: string,
): Promise<string | undefined> => {
  const chunkKeys = await tx.scan({prefix: `${prefix}/`}).keys();
  const chunks: string[] = [];
  for await (const k of chunkKeys) {
    chunks.push((await tx.get(k)) as string);
  }
  return chunks.join('');
};
