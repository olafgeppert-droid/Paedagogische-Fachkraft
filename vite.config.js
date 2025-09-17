import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/paedagogische-fachkraft/',  // Pfad zu deinem GitHub Pages Repository
  plugins: [react()],
  build: {
    outDir: 'dist',   // Ausgabeordner
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    open: false,
  }
});
