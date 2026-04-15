import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const apiProxy = {
    '/api/v1': {
      target: env.VITE_API_BASE_URL || 'https://ideagram.ideamakr.com/backend/api/v1/',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/api\/v1/, ''),
    }
  };

  return {
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
      },
    },
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
          prefer_related_applications: true,
          related_applications: [
            {
              platform: 'webapp',
              url: 'https://ideamakr.com/manifest.webmanifest',
            }
          ],
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
      proxy: apiProxy,
    },
    preview: {
      port: 4173,
      host: true,
      allowedHosts: true,
      proxy: apiProxy,
    }
  };
});
