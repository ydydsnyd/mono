import {strict as assert} from 'assert';
import {randomWithSeed, closest} from '../../demo/shared/util';

describe('randomWithSeed', () => {
  it('generates stable, pseudorandom numbers', () => {
    assert.equal(randomWithSeed(1, 72382, 100), 72.382);
    assert.equal(randomWithSeed(2897, 72382, 100), 90.654);
    assert.equal(
      randomWithSeed(2897, 72382, 100),
      randomWithSeed(2897, 72382, 100),
    );
  });
  it('generates unique numbers within a range', () => {
    let pn = new Set();
    for (var i = 3278; i < 24794; i++) {
      const v = randomWithSeed(i, 72382, 100, 50);
      assert.equal(pn.has(v), false, `number is unique`);
      pn.add(v);
      assert.equal(v >= 50, true, `${v} is greater than 50`);
      assert.equal(v < 100, true, `${v} is less than 50`);
    }
  });
  it('works with floats', () => {
    assert.equal(randomWithSeed(23892, 72382, 1), 0.744);
  });
});

describe('closest', () => {
  it('works in most trivial case', () => {
    assert.equal(
      closest(999, [1, 100, 1000, 10000, 100000], v => v),
      1,
    );
  });
  it('returns values that match exactly', () => {
    assert.equal(
      closest(1000, [1, 100, 1000, 10000, 100000], v => v),
      2,
    );
  });
  it('returns -1 if the array is empty', () => {
    assert.equal(
      closest(10, [], v => v),
      -1,
    );
  });
  it('returns the last index if the value is bigger than all values', () => {
    assert.equal(
      closest(100001, [1, 100, 1000, 10000, 100000], v => v),
      4,
    );
  });
  it('returns a middle value for identical values', () => {
    assert.equal(
      closest(10, [10, 10, 10, 10], v => v),
      2,
    );
  });
  it('handles first value correctly', () => {
    assert.equal(
      closest(1.5, [1, 2, 4, 8, 16, 32, 64, 128, 256], v => v),
      0,
    );
  });
  it('handles second-to-last value correctly', () => {
    assert.equal(
      closest(130, [1, 2, 4, 8, 16, 32, 64, 128, 256], v => v),
      7,
    );
  });
});
