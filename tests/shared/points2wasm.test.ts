import {strict as assert} from 'assert';
import {letterMap} from '../../demo/shared/util';
import {points2RenderBatch} from '../../demo/shared/points2wasm';
import {LETTERS} from '../../demo/shared/letters';
import type {Point} from '@/demo/shared/types';

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

describe('points2render', () => {
  it('correctly indexes things', () => {
    const ts = new Date().getTime();
    const points = letterMap<Point[]>(_ => {
      return [
        {
          u: 'aNab513kIcd39j4Sc11-y',
          t: ts,
          g: 1,
          c: 0,
          s: 0.2,
          p: [
            {x: 0.1, y: 0.1, s: 1},
            {x: 0.1, y: 0.2, s: 2},
            {x: 0.1, y: 0.3, s: 3},
          ],
          x: 0.1,
          y: 0.1,
        },
        {
          u: 'mjJzpZ0Gxmdanf7e4iO_N',
          t: ts,
          g: 2,
          c: 1,
          s: 0.1,
          p: [
            {x: 0.2, y: 0.1, s: 4},
            {x: 0.2, y: 0.2, s: 5},
          ],
          x: 0.2,
          y: 0.2,
        },
      ];
    });
    const args = points2RenderBatch(points);
    console.log(args);
    assert.equal(args[0].length, 5, 'one point count per letter');
    LETTERS.forEach((letter, idx) => {
      assert.equal(args[0][idx], 2, `correct point count for ${letter}`);
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
    assert.equal(args[3].length, 2, 'correct group count');
    assert.equal(args[3][0], 1, 'correct group 1');
    assert.equal(args[3][1], 2, 'correct group 2');
    assert.equal(args[4].length, 2, 'correct color count');
    assert.equal(args[4][0], 0, 'correct color 1');
    assert.equal(args[4][1], 1, 'correct color 2');
    assert.equal(args[5].length, 2, 'correct x count');
    cmpFloat(args[5][0], 0.1, 'correct x 1');
    cmpFloat(args[5][1], 0.2, 'correct x 2');
    cmpFloat(args[6].length, 2, 'correct y count');
    cmpFloat(args[6][0], 0.1, 'correct y 1');
    cmpFloat(args[6][1], 0.2, 'correct y 2');
    assert.equal(args[7].length, 2, 'correct splatter counts count');
    assert.equal(args[7][0], 3, 'correct splatter count 1');
    assert.equal(args[7][1], 3, 'correct splatter count 2');
    assert.equal(
      args[8].length,
      args[7][0] + args[7][1],
      'correct number of splatters',
    );
    assert.equal(args[8][0], 1, 'correct splatter 1 size');
    assert.equal(args[8][1], 2, 'correct splatter 2 size');
    assert.equal(args[8][2], 3, 'correct splatter 3 size');
    assert.equal(args[8][3], 4, 'correct splatter 4 size');
    assert.equal(args[8][4], 5, 'correct splatter 5 size');
    assert.equal(args[8][5], 6, 'correct splatter 6 size');
    cmpFloat(args[9][0], 0.1, 'correct splatter 1 x');
    cmpFloat(args[9][1], 0.1, 'correct splatter 2 x');
    cmpFloat(args[9][2], 0.1, 'correct splatter 3 x');
    cmpFloat(args[9][3], 0.2, 'correct splatter 4 x');
    cmpFloat(args[9][4], 0.2, 'correct splatter 5 x');
    cmpFloat(args[9][5], 0.2, 'correct splatter 6 x');
    cmpFloat(args[10][0], 0.1, 'correct splatter 1 y');
    cmpFloat(args[10][1], 0.2, 'correct splatter 2 y');
    cmpFloat(args[10][2], 0.3, 'correct splatter 3 y');
    cmpFloat(args[10][3], 0.1, 'correct splatter 4 y');
    cmpFloat(args[10][4], 0.2, 'correct splatter 5 y');
    cmpFloat(args[10][5], 0.3, 'correct splatter 6 y');
  });
});

const EPSILON = 0.0000001;
const cmpFloat = (val: number, expect: number, msg: string) => {
  assert(
    Math.abs(val - expect) < EPSILON,
    `(${msg}) expected ${val} to not be more than ${EPSILON} different than ${expect}.`,
  );
};
