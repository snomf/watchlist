import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'profile.html'),
        stats: resolve(__dirname, 'stats.html'),
        sync: resolve(__dirname, 'sync.html'),
        callback: resolve(__dirname, 'callback.html'),
        'favorite-removal-modal': resolve(__dirname, 'favorite-removal-modal.html'),
      },
    },
  },
});
