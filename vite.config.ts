import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Ideagram',
        short_name: 'Ideagram',
        description: 'Industry standard mobile-first PWA',
        theme_color: '#0265DC',
        background_color: '#0265DC',
        icons: [
          {
            src: 'pwa-192192.png',
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
    })
  ],
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
