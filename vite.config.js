import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/root/', // <-- Repository-Name anpassen
  plugins: [react()],
  build: {
    outDir: 'dist',        
    emptyOutDir: true,     
    sourcemap: true
  }
});
