import {test} from 'vitest';
import {CbIteratorResult, newCbIterator} from './cb-iterable.js';

const countToFive = (
  ctx: {index: number},
  yld: (value: number) => void,
  rtrn: () => void,
  _thrw: (err: string) => void,
) => {
  if (ctx.index < 5) {
    // must update vars before yielding in case of synchronous re-entrance
    const i = ctx.index++;
    yld(i);
  } else {
    rtrn();
  }
};

const cbIterator = newCbIterator({index: 0}, countToFive);

function process(r: CbIteratorResult<number, string>) {
  if (r.done) {
    return;
  }
  if (r.error) {
    throw r.error;
  }

  console.log(r.value);
  cbIterator(process);
}

cbIterator(process);

test('laziness and such', () => {});
