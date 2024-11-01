import xxhash, {type XXHashAPI} from 'xxhash-wasm';
import {assert} from './asserts.js';

let api = undefined as XXHashAPI | undefined;

const apiPromise: Promise<XXHashAPI> = xxhash();
apiPromise
  .then(apiInstance => {
    api = apiInstance;
  })
  .catch(err => {
    console.error('Failed to load XXHash API:', err);
  });

export async function xxHashReady(): Promise<void> {
  await apiPromise;
}

const msg = 'XXHash API not ready yet.';

export const create64: XXHashAPI['create64'] = (seed?: bigint) => {
  assert(api, msg);
  return api.create64(seed);
};

export const h32: XXHashAPI['h32'] = (input, seed) => {
  assert(api, msg);
  return api.h32(input, seed);
};

export const h64: XXHashAPI['h64'] = (input, seed) => {
  assert(api, msg);
  return api.h64(input, seed);
};
