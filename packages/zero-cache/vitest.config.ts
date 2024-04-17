import {defineWorkersConfig} from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
  // https://github.com/vitest-dev/vitest/issues/5332#issuecomment-1977785593
  optimizeDeps: {
    include: ['vitest > @vitest/expect > chai'],
    exclude: ['wa-sqlite'],
  },
  test: {
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    poolOptions: {
      workers: {
        wrangler: {configPath: './wrangler.toml'},
      },
    },
  },
});
