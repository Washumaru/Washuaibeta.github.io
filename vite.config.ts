import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Washuaibeta.github.io/', // Está correcto si este es el nombre exacto de tu repositorio
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Asegurarse de que los assets se manejen correctamente
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    // Configuración para desarrollo local
    port: 3000,
    open: true,
  },
});