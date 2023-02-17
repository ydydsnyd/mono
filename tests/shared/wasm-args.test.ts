import {strict as assert} from 'assert';
import {letterMap} from '../../demo/shared/util';
import {splatters2RenderBatch} from '../../demo/shared/wasm-args';
import {LETTERS} from '../../demo/shared/letters';
import type {Splatter} from '@/demo/shared/types';

type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array;

const sliceVal = <T extends TypedArray>(val: T, fn: (slice: T) => number) => {
  let index = 0;
  while (index < val.length) {
    index += fn(val.slice(index) as T);
  }
};

describe('splatters2render', () => {
  it('correctly indexes things', () => {
    const ts = new Date().getTime();
    const splatters = letterMap<Splatter[]>(_ => {
      return [
        {
          u: 'aNab513kIcd39j4Sc11-y',
          t: ts,
          c: 0,
          x: 0.1,
          y: 0.1,
          a: 0,
          r: 0,
        },
        {
          u: 'mjJzpZ0Gxmdanf7e4iO_N',
          t: ts,
          c: 1,
          x: 0.2,
          y: 0.2,
          a: 1,
          r: 1,
        },
      ];
    });
    const args = splatters2RenderBatch(splatters);
    console.log(args);
    assert.equal(args[0].length, 5, 'one splatter count per letter');
    LETTERS.forEach((letter, idx) => {
      assert.equal(args[0][idx], 2, `correct splatter count for ${letter}`);
    });
    assert.equal(args[1].length, 10, 'correct ts count');
    sliceVal(args[1], arr => {
      assert.equal(arr[0], ts, 'correct ts 1');
      assert.equal(arr[1], ts, 'correct ts 2');
      return 2;
    });
    sliceVal(args[2], arr => {
      assert.equal(arr[0], 0, 'correct u 1');
      assert.equal(arr[1], 1, 'correct u 2');
      return 2;
    });
    assert.equal(args[3][0], 0, 'correct color 1');
    assert.equal(args[3][1], 1, 'correct color 2');
    assert.equal(args[4].length, 2, 'correct x count');
    cmpFloat(args[4][0], 0.1, 'correct x 1');
    cmpFloat(args[4][1], 0.2, 'correct x 2');
    cmpFloat(args[5].length, 2, 'correct y count');
    cmpFloat(args[5][0], 0.1, 'correct y 1');
    cmpFloat(args[5][1], 0.2, 'correct y 2');
    assert.equal(args[6].length, 2, 'correct splatter animation count');
    assert.equal(args[6][0], 1, 'correct splatter animation 1');
    assert.equal(args[6][1], 1, 'correct splatter animation 2');
    assert.equal(args[7].length, 2, 'correct splatter rotation count');
    assert.equal(args[7][0], 0, 'correct splatter rotation 1');
    assert.equal(args[7][1], 1, 'correct splatter rotation 2');
  });
});

const EPSILON = 0.0000001;
const cmpFloat = (val: number, expect: number, msg: string) => {
  assert(
    Math.abs(val - expect) < EPSILON,
    `(${msg}) expected ${val} to not be more than ${EPSILON} different than ${expect}.`,
  );
};
