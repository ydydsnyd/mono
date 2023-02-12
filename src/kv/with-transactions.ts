import type {Read, Store, Write} from './store.js';

export async function withRead<R>(
  store: Store,
  fn: (read: Read) => R | Promise<R>,
): Promise<R> {
  const read = await store.read();
  try {
    return await fn(read);
  } finally {
    read.release();
  }
}

export async function withWrite<R>(
  store: Store,
  fn: (write: Write) => R | Promise<R>,
): Promise<R> {
  const write = await store.write();
  try {
    return await fn(write);
  } finally {
    write.release();
  }
}
