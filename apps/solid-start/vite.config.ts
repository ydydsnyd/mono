import {defineConfig} from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
  plugins: [solid()],
});
