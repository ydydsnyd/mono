import {makeDefine} from 'shared/src/build.js';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  define: makeDefine(),
  build: {
    target: 'esnext',
  },
  server: {hmr: false},
});
