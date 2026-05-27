/**
 * =============================================================================
 * FLASHCART MAIN — Vite Configuration
 * =============================================================================
 * 
 * Purpose: Configure Vite bundler for the FlashCart customer portal.
 * 
 * Key decisions:
 * - React plugin for JSX/Fast Refresh support
 * - Path alias '@' maps to 'src/' for clean imports
 * - Build output to 'dist/' for Cloudflare Pages
 * - Manual chunk splitting for optimal loading performance
 * - Base URL set to '/' for clean URL routing
 * 
 * Developer: Rizwan Rahim Chowdhury
 * Powered by: Bangladesh Software Development Community (BSDC)
 * =============================================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  /* --- Plugins --- */
  plugins: [
    react() /* Enable React JSX transform and Fast Refresh for development */
  ],

  /* --- Path Resolution --- */
  resolve: {
    alias: {
      /* '@' alias allows imports like: import Component from '@/components/Component' */
      '@': resolve(__dirname, 'src')
    }
  },

  /* --- Development Server --- */
  server: {
    port: 3000, /* Local dev server port */
    open: true, /* Auto-open browser on dev server start */
    host: true  /* Allow access from local network (useful for mobile testing) */
  },

  /* --- Build Configuration --- */
  build: {
    /* Output directory — Cloudflare Pages reads from 'dist' */
    outDir: 'dist',

    /* Generate source maps for debugging production issues */
    sourcemap: false,

    /* Target modern browsers for smaller bundle size */
    target: 'es2020',

    /* Chunk size warning limit in KB */
    chunkSizeWarningLimit: 1000,

    /* Manual chunk splitting for optimal caching and loading */
    rollupOptions: {
      output: {
        manualChunks: {
          /* Vendor chunk: React core libraries (cached long-term) */
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          /* Firebase chunk: Firebase SDK (loaded when auth/data needed) */
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/database'],

          /* Helmet chunk: SEO library (loaded with first page render) */
          'vendor-seo': ['react-helmet-async'],

          /* Maps chunk: Leaflet mapping library (lazy loaded) */
          'vendor-maps': ['leaflet', 'react-leaflet'],

          /* PDF chunk: Invoice generation (lazy loaded on demand) */
          'vendor-pdf': ['jspdf', 'jspdf-autotable']
        }
      }
    },

    /* Minification using esbuild (fastest) */
    minify: 'esbuild',

    /* CSS code splitting for optimal loading */
    cssCodeSplit: true
  },

  /* --- CSS Configuration --- */
  css: {
    /* Enable CSS modules for scoped styling if needed */
    modules: {
      localsConvention: 'camelCase'
    }
  },

  /* --- Preview Server (for testing production build locally) --- */
  preview: {
    port: 4173,
    host: true
  }
});
