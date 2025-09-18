import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Paedagogische-Fachkraft/',  // exakt Repo-Name
  build: {
    outDir: 'dist',
  },
})
