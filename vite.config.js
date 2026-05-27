// ============================================================
// FlashCart — Main Customer Portal
// Vite Configuration File
// Developer: Rizwan Rahim Chowdhury
// Powered by: Bangladesh Software Development Community (bsdc.info.bd)
// ============================================================

// Import the Vite core defineConfig helper for type-safe config
import { defineConfig } from 'vite';

// Import the official React plugin for Vite (JSX transform + Fast Refresh)
import react from '@vitejs/plugin-react';

// Import Node.js path module for resolving directory aliases
import { resolve } from 'path';

// Export the Vite configuration object
export default defineConfig({

  // ── PLUGINS ─────────────────────────────────────────────
  plugins: [
    // Enable React JSX transform and Hot Module Replacement
    react({
      // Use the automatic JSX runtime (no need to import React in every file)
      jsxRuntime: 'automatic',
    }),
  ],

  // ── PATH ALIASES ────────────────────────────────────────
  // Allows importing with @ instead of relative paths
  // Example: import Button from '@/components/common/Button/Button'
  resolve: {
    alias: {
      // Map @ to the src directory
      '@': resolve(__dirname, './src'),

      // Map @components to the components directory
      '@components': resolve(__dirname, './src/components'),

      // Map @pages to the pages directory
      '@pages': resolve(__dirname, './src/pages'),

      // Map @hooks to the hooks directory
      '@hooks': resolve(__dirname, './src/hooks'),

      // Map @context to the context directory
      '@context': resolve(__dirname, './src/context'),

      // Map @services to the services directory
      '@services': resolve(__dirname, './src/services'),

      // Map @utils to the utils directory
      '@utils': resolve(__dirname, './src/utils'),

      // Map @styles to the styles directory
      '@styles': resolve(__dirname, './src/styles'),

      // Map @i18n to the i18n directory
      '@i18n': resolve(__dirname, './src/i18n'),

      // Map @data to the data directory
      '@data': resolve(__dirname, './src/data'),

      // Map @assets to the assets directory
      '@assets': resolve(__dirname, './src/assets'),
    },
  },

  // ── BUILD CONFIGURATION ─────────────────────────────────
  build: {
    // Output directory — Cloudflare Pages reads from 'dist' by default
    outDir: 'dist',

    // Generate source maps for debugging in production
    sourcemap: false,

    // Target modern browsers — reduces bundle size
    target: 'es2020',

    // Minimum file size before assets are inlined as base64 (4KB)
    assetsInlineLimit: 4096,

    // Enable CSS code splitting for better caching
    cssCodeSplit: true,

    // ── ROLLUP OPTIONS (manual chunk splitting) ──────────
    rollupOptions: {
      output: {
        // Manual chunk splitting strategy for optimal caching
        // Each chunk is cached independently by the browser
        manualChunks: {
          // React core — changes least frequently
          'vendor-react': ['react', 'react-dom'],

          // React Router — changes with framework updates
          'vendor-router': ['react-router-dom'],

          // React Helmet — SEO library
          'vendor-helmet': ['react-helmet-async'],

          // Firebase core modules — split by service
          'vendor-firebase-app': ['firebase/app'],
          'vendor-firebase-auth': ['firebase/auth'],
          'vendor-firebase-firestore': ['firebase/firestore'],
          'vendor-firebase-rtdb': ['firebase/database'],
          'vendor-firebase-analytics': ['firebase/analytics'],
        },

        // Consistent chunk file naming with content hash for cache busting
        chunkFileNames: 'assets/js/[name]-[hash].js',

        // Entry file naming
        entryFileNames: 'assets/js/[name]-[hash].js',

        // Asset file naming (CSS, images, fonts)
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },

  // ── DEVELOPMENT SERVER ───────────────────────────────────
  server: {
    // Development port
    port: 3000,

    // Open browser automatically during development
    open: false,

    // Allow connections from network (useful for mobile testing on tablet)
    host: true,

    // History API fallback — serves index.html for all routes during dev
    // This is the SPA routing fix for development mode
    historyApiFallback: true,
  },

  // ── PREVIEW SERVER (after build) ────────────────────────
  preview: {
    // Preview port after running npm run build && npm run preview
    port: 4173,

    // History API fallback for preview mode too
    historyApiFallback: true,
  },

  // ── CSS CONFIGURATION ────────────────────────────────────
  css: {
    // Enable CSS modules for component-scoped styles (optional)
    modules: {
      // CSS modules file pattern — only files ending in .module.css
      pattern: /\.module\.css$/,
    },
    // PostCSS config inline (no separate postcss.config.js needed)
    postcss: {},
  },

  // ── ENVIRONMENT VARIABLES ────────────────────────────────
  // All env vars must be prefixed with VITE_ to be exposed to client
  // Access via import.meta.env.VITE_VARIABLE_NAME
  envPrefix: 'VITE_',

  // ── OPTIMIZATION ────────────────────────────────────────
  optimizeDeps: {
    // Pre-bundle these dependencies for faster dev server startup
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-helmet-async',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/database',
    ],
  },
});
