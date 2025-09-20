import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/pädagogische-dokumentation/',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    host: true,
    port: 3000
  }
})
