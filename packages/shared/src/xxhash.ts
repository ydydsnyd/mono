import xxhash, {type XXHashAPI} from 'xxhash-wasm';

export let maybeXXHashAPI = undefined as XXHashAPI | undefined;

// console.log('Loading XXHash API...');

export const xxHashAPI: Promise<XXHashAPI> = xxhash();

xxHashAPI
  .then(apiInstance => {
    // console.log('XXHash loaded.');
    maybeXXHashAPI = apiInstance;
  })
  .catch(err => {
    console.error('Failed to load XXHash API:', err);
  });

// export async function xxHashReady(): Promise<void> {
//   await apiPromise;
// }

// const msg = 'XXHash API not ready yet.';

// export const create64: XXHashAPI['create64'] = (seed?: bigint) => {
//   assert(maybeXXHashAPI, msg);
//   return maybeXXHashAPI.create64(seed);
// };

// export const h32: XXHashAPI['h32'] = (input, seed) => {
//   assert(maybeXXHashAPI, msg);
//   return maybeXXHashAPI.h32(input, seed);
// };

// export const h64: Promise<XXHashAPI['h64']> = xxHashAPI.then(api => api.h64);

export type H32 = XXHashAPI['h32'];
export type H64 = XXHashAPI['h64'];
export type Create64 = XXHashAPI['create64'];
