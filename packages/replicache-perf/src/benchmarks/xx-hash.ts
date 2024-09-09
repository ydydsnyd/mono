import {h32, h64} from 'zero-cache/src/types/xxhash.js';
import {makeRandomStrings} from '../data.js';
import type {Benchmark} from '../perf.js';

export function benchmarks(): Array<Benchmark> {
  return [json(), xxhash32(), xxhash64()];
}

const NUM_STRINGS = 1000;
const STRING_LENGTH = 1_000;

function xxhash32(): Benchmark {
  let randomStrings: string[];
  let results = 0;

  return {
    name: `h32 from string`,
    group: 'xxhash',
    setup() {
      randomStrings = makeRandomStrings(NUM_STRINGS, STRING_LENGTH);
    },
    run() {
      for (let i = 0; i < randomStrings.length; i++) {
        const n = h32(randomStrings[i]);
        results += n;
      }
      console.log(results);
    },
  };
}

function xxhash64(): Benchmark {
  let randomStrings: string[];
  let results = 0n;

  return {
    name: `h64 from string`,
    group: 'xxhash',
    setup() {
      randomStrings = makeRandomStrings(NUM_STRINGS, STRING_LENGTH);
    },
    run() {
      for (let i = 0; i < randomStrings.length; i++) {
        const n = h64(randomStrings[i]);
        results += n;
      }
      console.log(results);
    },
  };
}

function json(): Benchmark {
  let randomStrings: string[];
  let results = 0;

  return {
    name: `json from string`,
    group: 'xxhash',
    setup() {
      randomStrings = makeRandomStrings(NUM_STRINGS, STRING_LENGTH);
    },
    run() {
      for (let i = 0; i < randomStrings.length; i++) {
        const s = JSON.stringify(randomStrings[i]);
        results += s.length;
      }
      console.log(results);
    },
  };
}
