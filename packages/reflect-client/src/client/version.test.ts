import {version as versionShared} from 'reflect-shared/out/version.js';
import {expect, test} from 'vitest';
import {version} from './version.js';

test('version', () => {
  expect(typeof version).equal('string');
  expect(version).equal(versionShared);
});
