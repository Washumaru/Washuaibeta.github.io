import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Washuaibeta.github.io/', // Añade esta línea con el nombre de tu repositorio
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Asegura que los assets se manejen correctamente en GitHub Pages
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: true,
  }
});