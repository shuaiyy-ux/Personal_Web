import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: '.',
  appType: 'mpa',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        "blog-nvidia-research": resolve(rootDir, "blog/nvidia-research/index.html"),
        "blog-sniperbot-zero-to-one": resolve(rootDir, "blog/sniperbot-zero-to-one/index.html"),
        main: resolve(rootDir, 'index.html'),
        blog: resolve(rootDir, 'blog/index.html'),
        'blog-sniperbot-zero-to-one': resolve(rootDir, 'blog/sniperbot-zero-to-one/index.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
