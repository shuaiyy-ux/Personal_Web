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
        "blog-my-first-post": resolve(rootDir, "blog/my-first-post/index.html"),
        "blog-sniperbot-zero-to-one": resolve(rootDir, "blog/sniperbot-zero-to-one/index.html"),
        main: resolve(rootDir, 'index.html'),
        blog: resolve(rootDir, 'blog/index.html'),
        'blog-automation-mindset': resolve(rootDir, 'blog/automation-mindset/index.html'),
        'blog-sniperbot-zero-to-one': resolve(rootDir, 'blog/sniperbot-zero-to-one/index.html'),
      },
    },
  },
  server: {
    open: true,
  },
});
