import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite Konfiguration für GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/paedagogische-fachkraft/', // genau Repo-Name
  build: {
    outDir: 'dist', // Build Ausgabe
  },
})
