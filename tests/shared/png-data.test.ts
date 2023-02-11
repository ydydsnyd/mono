import {strict as assert} from 'assert';
import {encodePngData, decodePngData} from '../../demo/shared/png-data';
import {b64Data} from './png-data/b64';
import {uintData} from './png-data/uint';

describe('png data', () => {
  it('encoding and decoding', () => {
    const encoded = encodePngData(uintData);
    assert.equal(encoded, b64Data);
    assert.deepEqual(decodePngData(encoded), uintData);
  });
});
