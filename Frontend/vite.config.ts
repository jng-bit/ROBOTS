import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  assetsInclude: ['**/*.glb'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom')) return 'vendor-dom';
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('three')) return 'vendor-three';
            if (id.includes('framer-motion')) return 'vendor-animation';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('leaflet')) return 'vendor-maps';
            return 'vendor-libs';
          }
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
})
