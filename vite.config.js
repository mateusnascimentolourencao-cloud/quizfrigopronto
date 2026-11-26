import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: fileURLToPath(new URL('./src/dev.html', import.meta.url)),
    },
  },
});
