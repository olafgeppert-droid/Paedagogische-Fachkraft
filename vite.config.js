import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  // Wichtig: base-Pfad auf dein Repo setzen
  base: '/Paedagogische-Fachkraft/', // <-- exakt der Name deines GitHub-Repos

  build: {
    outDir: 'dist',
  },
});
