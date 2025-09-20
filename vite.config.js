import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Paedagogische-Fachkraft/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [] // Stellen Sie sicher, dass keine wichtigen Imports externalisiert werden
    }
  },
  server: {
    host: true,
    port: 3000
  }
})
