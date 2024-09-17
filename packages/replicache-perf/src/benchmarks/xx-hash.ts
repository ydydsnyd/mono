import {h32, h64} from 'zero-cache/src/types/xxhash.js';
import {makeRandomStrings} from '../data.js';
import type {Benchmark} from '../perf.js';

export function benchmarks(): Array<Benchmark> {
  return [
    json({stringLength: 100}),
    xxhash32({stringLength: 100}),
    xxhash64({stringLength: 100}),
    json({stringLength: 1000}),
    xxhash32({stringLength: 1000}),
    xxhash64({stringLength: 1000}),
    json({stringLength: 10000}),
    xxhash32({stringLength: 10000}),
    xxhash64({stringLength: 10000}),
  ];
}

const NUM_STRINGS = 1000;

function xxhash32({stringLength}: {stringLength: number}): Benchmark {
  let randomStrings: string[];
  let results = 0;

  return {
    name: `h32 from string (${stringLength})`,
    group: 'xxhash',
    setup() {
      randomStrings = makeRandomStrings(NUM_STRINGS, stringLength);
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

function xxhash64({stringLength}: {stringLength: number}): Benchmark {
  let randomStrings: string[];
  let results = 0n;

  return {
    name: `h64 from string (${stringLength})`,
    group: 'xxhash',
    setup() {
      randomStrings = makeRandomStrings(NUM_STRINGS, stringLength);
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

function json({stringLength}: {stringLength: number}): Benchmark {
  let randomStrings: string[];
  let results = 0;

  return {
    name: `json from string (${stringLength})`,
    group: 'xxhash',
    setup() {
      randomStrings = makeRandomStrings(NUM_STRINGS, stringLength);
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
