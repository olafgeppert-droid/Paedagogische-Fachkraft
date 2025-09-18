import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/paedagogische-fachkraft/', // GitHub Pages Pfad
  build: {
    outDir: 'dist', // Output für gh-pages
  },
});
