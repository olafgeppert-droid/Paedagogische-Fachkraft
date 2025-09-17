import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Pfad zu deinem Repository auf GitHub Pages
const repoName = 'paedagogische-fachkraft';

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    open: true,
  },
});
