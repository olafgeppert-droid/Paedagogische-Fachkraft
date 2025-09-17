import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages Base Path
// Setze hier den Repository-Namen, falls die Seite nicht unter root läuft
// z.B. repo-name -> '/repo-name/'
const base = '/root/'; // ändere 'root' auf deinen Repo-Pfad, falls nötig

export default defineConfig({
  base: base,
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: '/index.html'
    }
  }
});
