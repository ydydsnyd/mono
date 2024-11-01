import xxhash, {type XXHashAPI} from 'xxhash-wasm';

let api = undefined as XXHashAPI | undefined;

console.log('Loading XXHash API', performance.now());
const apiPromise: Promise<XXHashAPI> = xxhash();
apiPromise
  .then(apiInstance => {
    api = apiInstance;
    console.log('XXHash API loaded', performance.now());
  })
  .catch(err => {
    console.error('Failed to load XXHash API:', err);
  });

export async function xxHashReady(): Promise<void> {
  await apiPromise;
}

function assertLoaded(api: XXHashAPI | undefined): asserts api is XXHashAPI {
  console.log('assertLoaded', !!api, performance.now());
  if (api === undefined) {
    throw new Error('XXHash API not loaded');
  }
}

export const create64: XXHashAPI['create64'] = (seed?: bigint) => {
  assertLoaded(api);
  return api.create64(seed);
};

export const h32: XXHashAPI['h32'] = (input, seed) => {
  assertLoaded(api);
  return api.h32(input, seed);
};

export const h64: XXHashAPI['h64'] = (input, seed) => {
  assertLoaded(api);
  return api.h64(input, seed);
};
