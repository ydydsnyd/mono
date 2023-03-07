import type {WriteTransaction} from '@rocicorp/reflect';
import {chunk, unchunk} from '../../demo/shared/chunks';
import {CACHE_CHUNK_STRING_SIZE} from '../../demo/shared/constants';
import {strict as assert} from 'assert';

const fakeTx = (): WriteTransaction => {
  const data: Record<string, string> = {};
  const tx = {
    put: async (k: string, v: string) => (data[k] = v),
    del: async (k: string) => delete data[k],
    has: async (k: string) => !!data[k],
    get: async (k: string) => data[k],
    scan: ({prefix}: {prefix: string}) => ({
      keys: () => ({
        async *[Symbol.asyncIterator]() {
          for (const d in data) {
            if (d.startsWith(prefix)) {
              yield d;
            }
          }
        },
      }),
    }),
  };
  return tx as unknown as WriteTransaction;
};

const chunkable = (size: number) => {
  let v = '';
  for (let i = 0; i < CACHE_CHUNK_STRING_SIZE * size; i++) {
    v += '☃';
  }
  return v;
};

describe('chunks', () => {
  it('stores a single value properly', async () => {
    const tx = fakeTx();
    await chunk(tx, 'test', 'testing');
    const val = await tx.get('test/0');
    assert.equal('testing', val);
  });
  it('splits up and re-joins chunks properly', async () => {
    const tx = fakeTx();
    const val = chunkable(2);
    await chunk(tx, 'chunked', val);
    assert.ok(await tx.has('chunked/0'));
    assert.ok(await tx.has('chunked/1'));
    const sval = await unchunk(tx, 'chunked');
    assert.ok(sval);
    assert.equal(val.length, sval?.length);
    assert.equal(val, sval);
  });
  it('cleans up old values', async () => {
    const tx = fakeTx();
    await chunk(tx, 'chunked', chunkable(20));
    assert.ok(await tx.has('chunked/19'));
    const nval = chunkable(2);
    await chunk(tx, 'chunked', nval);
    assert.equal(await tx.has('chunked/19'), false);
    const fval = await tx.get('chunked/1');
    assert.ok(fval);
  });
});
