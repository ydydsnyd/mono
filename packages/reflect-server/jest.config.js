// @ts-check

import {jestConfig} from 'shared/out/tool/jest-config.js';

/** @type {import('jest').Config} */
const config = {
  ...jestConfig,
  testEnvironment: 'miniflare',
};

export {config as default};
