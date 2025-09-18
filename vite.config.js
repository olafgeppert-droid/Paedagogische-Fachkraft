import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/paedagogische-fachkraft/', // Name deines GitHub Repo
  build: {
    outDir: 'dist', // fertiger Bundle
  },
})
