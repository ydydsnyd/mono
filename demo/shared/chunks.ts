// Utilities for chunking data when writing/reading

import type {ReadTransaction, WriteTransaction} from '@rocicorp/reflect';
import {CACHE_CHUNK_STRING_SIZE} from './constants';

const chunkCount = async (tx: ReadTransaction, prefix: string) => {
  const count = parseInt((await tx.get(`${prefix}/count`)) as string, 10);
  if (isNaN(count)) {
    return undefined;
  }
  return count;
};

const cleanup = async (tx: WriteTransaction, prefix: string) => {
  const count = await chunkCount(tx, prefix);
  if (!count) {
    return;
  }
  const promises: Promise<any>[] = [];
  for (let i = 0; i < count; i++) {
    promises.push(tx.del(`${prefix}/${i}`));
  }
  await Promise.all(promises);
};

export const chunk = async (
  tx: WriteTransaction,
  prefix: string,
  value: string,
) => {
  await cleanup(tx, prefix);
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
  await tx.put(`${prefix}/count`, chunkIdx);
};

export const unchunk = async (
  tx: ReadTransaction,
  prefix: string,
): Promise<string | undefined> => {
  const count = await chunkCount(tx, prefix);
  if (!count) {
    return;
  }
  const chunks: string[] = [];
  const promises: Promise<any>[] = [];
  for (let i = 0; i < count; i++) {
    promises.push(
      tx.get(`${prefix}/${i}`).then(chunk => (chunks[i] = chunk as string)),
    );
  }
  await Promise.all(promises);
  return chunks.join('');
};
