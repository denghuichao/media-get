import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    hmr: {
      overlay: false
    }
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Support for SPA routing in production
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
});
