import {strict as assert} from 'assert';
import {encode, decode} from '../../demo/shared/uint82b64';
import {b64Data} from './png-data/b64';
import {uintData} from './png-data/uint';

describe('png data', () => {
  it('encoding and decoding', () => {
    const encoded = encode(uintData);
    assert.equal(encoded, b64Data);
    assert.deepEqual(decode(encoded), uintData);
  });
});
