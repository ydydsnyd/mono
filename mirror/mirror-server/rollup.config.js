import dts from 'rollup-plugin-dts';
import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';

/**
 * Add here external dependencies that actually you use.
 */
const externals = [
  'cors',
  'helmet',
  'firebase-functions',
  'firebase-admin',
  'mirror-protocol',
  'express',
  'body-parser',
  'busboy',
];

export default {
  input: 'src/index.ts',
  external: externals,
  plugins: [
    typescript(),
    nodeResolve(),
    dts({
      // respectExternal: true,
    })
  ],
  onwarn: () => {
    return;
  },
  output: {
    file: 'lib/index.js',
    format: 'es',
    sourcemap: false,
  },
};
