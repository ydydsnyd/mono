import {definePreset} from 'unbuild';

// @see https://github.com/unjs/unbuild
export default definePreset({
  clean: true,
  declaration: true,
  rollup: {
    externals: [
      'cors',
      'firebase-functions',
      'firebase-admin',
      'body-parser',
      'busboy',
      'mirror-protocol',
      'shared',
    ],
    inlineDependencies: true,
    esbuild: {
      minify: false,
    },
  },
});
