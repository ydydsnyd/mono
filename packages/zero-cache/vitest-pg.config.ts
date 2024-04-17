import {defineConfig} from 'vitest/config';

export default defineConfig({
  // https://github.com/vitest-dev/vitest/issues/5332#issuecomment-1977785593
  optimizeDeps: {
    include: ['vitest > @vitest/expect > chai'],
    exclude: ['wa-sqlite'],
  },
  test: {
    include: ['src/**/*.pg\\-test.?(c|m)[jt]s?(x)'],
  },
});
