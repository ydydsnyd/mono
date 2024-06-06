import {test} from 'vitest';
import {
  CB,
  CustomCallbackGenerator,
  TODO,
  filter,
  map,
} from './cb-iterable-2.js';

function countToFive(state: TODO, callback: CB) {
  if (!state.count) {
    state.count = 0;
  }
  if (state.count < 5) {
    callback(state.count++, false);
  } else {
    callback(null, true);
  }
}

test('iterating', () => {
  const customGen = new CustomCallbackGenerator(countToFive);

  const mappedGen = map(customGen, x => x * 2);
  const filteredGen = filter(mappedGen, x => x > 4);

  function handleCustomNext(value: TODO, done: boolean) {
    if (!done) {
      console.log(value);
      filteredGen.next(handleCustomNext);
    } else {
      console.log('Iteration complete');
    }
  }

  // Start the iteration
  filteredGen.next(handleCustomNext);
});

test('lazy', () => {
  const customGen = new CustomCallbackGenerator(countToFive);

  let mapCalls = 0;
  const mappedGen = map(customGen, x => {
    mapCalls++;
    return x * 2;
  });

  let filterCalls = 0;
  const filteredGen = filter(mappedGen, x => {
    filterCalls++;
    return x > 0;
  });

  let count = 0;
  function bailEarly(value: TODO, done: boolean) {
    console.log(value);
    if (done || ++count >= 2) {
      return;
    }
    filteredGen.next(bailEarly);
  }

  filteredGen.next(bailEarly);

  console.log('map calls', mapCalls);
  console.log('filter calls', filterCalls);
});
