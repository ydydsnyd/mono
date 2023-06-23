import {expect, test} from '@jest/globals';
import {version as versionShared} from 'reflect-shared';
import {version} from './version.js';

test('version', () => {
  expect(typeof version).toBe('string');
  expect(version).toBe(versionShared);
});
