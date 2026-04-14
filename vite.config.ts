import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Ideagram',
        short_name: 'Ideagram',
        description: 'Industry standard mobile-first PWA',
        theme_color: '#0265DC',
        background_color: '#F2F4F7',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    checker({
      typescript: true,
    }),
  ],
  build: {
    target: 'esnext',
    cssMinify: 'lightningcss',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-vendor': ['framer-motion'],
          'ui-vendor': ['react-feather', 'react-toastify', 'formik', 'yup'],
          'query-vendor': ['@tanstack/react-query', 'axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api/v1': {
        target: 'https://ideagram.ideamakr.com/backend/api/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      }
    }
  },
  preview: {
    port: 4173,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api/v1': {
        target: 'https://ideagram.ideamakr.com/backend/api/v1/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      }
    }
  }
})
