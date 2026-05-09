import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        profile: resolve(__dirname, 'profile.html'),
        stats: resolve(__dirname, 'stats.html'),
        sync: resolve(__dirname, 'sync.html'),
        callback: resolve(__dirname, 'callback.html'),
        'favorite-removal-modal': resolve(__dirname, 'favorite-removal-modal.html'),
        discover: resolve(__dirname, 'discover.html'),
      },
    },
  },
});
