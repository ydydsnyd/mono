import xxhash, {type XXHashAPI} from 'xxhash-wasm';
import {assert} from './asserts.js';

export let xxHashAPI = undefined as XXHashAPI | undefined;

console.log('Loading XXHash API...');
const apiPromise: Promise<XXHashAPI> = xxhash();
apiPromise
  .then(apiInstance => {
    console.log('XXHash loaded.');
    xxHashAPI = apiInstance;
  })
  .catch(err => {
    console.error('Failed to load XXHash API:', err);
  });

export async function xxHashReady(): Promise<void> {
  await apiPromise;
}

const msg = 'XXHash API not ready yet.';

export const create64: XXHashAPI['create64'] = (seed?: bigint) => {
  assert(xxHashAPI, msg);
  return xxHashAPI.create64(seed);
};

export const h32: XXHashAPI['h32'] = (input, seed) => {
  assert(xxHashAPI, msg);
  return xxHashAPI.h32(input, seed);
};

export const h64: XXHashAPI['h64'] = (input, seed) => {
  console.log('h64', xxHashAPI);
  assert(xxHashAPI, msg);
  return xxHashAPI.h64(input, seed);
};
