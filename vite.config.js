import { defineConfig } from 'vite';

export default defineConfig({
  // The GLB library is intentionally the public asset directory: runtime models
  // keep their canonical filenames and can be replaced without code changes.
  publicDir: 'models',
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
});
