import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages Base URL anpassen: falls Repository z. B. "https://username.github.io/paedagogische-fachkraft/"
const repoName = 'paedagogische-fachkraft';

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [react()],
  build: {
    outDir: 'dist',       // Build-Ordner
    emptyOutDir: true
  }
});
