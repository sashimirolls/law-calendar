import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  envPrefix: ['VITE_', 'ACUITY_', 'API_'],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Only use proxy in development
  server: {
    proxy: process.env.NODE_ENV === 'development' ? {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    } : undefined
  },
});