// vite.config.js — Build configuration for FlashCart Main (Customer Portal)
// Configures React plugin, code-splitting for performance, and clean output.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Enable React Fast Refresh + JSX transform.
  plugins: [react()],

  build: {
    rollupOptions: {
      output: {
        // Manual chunking keeps the initial bundle small and improves Core Web Vitals.
        // Heavy/independent libraries are split so the browser can cache them separately.
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/database'],
          maps: ['leaflet', 'react-leaflet'],
        },
      },
    },
    assetsDir: 'assets',
    sourcemap: false,
    // Terser produces the smallest production bundles.
    minify: 'terser',
  },

  // Local preview server port (used by `vite preview`).
  preview: {
    port: 4173,
  },

  // Local dev server.
  server: {
    port: 5173,
    host: true,
  },
})
