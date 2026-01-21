import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from 'rollup-plugin-visualizer';
import { manifest } from './manifest';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appVersion = env.VITE_APP_VERSION;

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        // Excluimos index.html del precache para que siempre se pida a la red (NetworkFirst)
        globIgnores: ['**/index.html', '**/.htaccess'], 
        runtimeCaching: [
          {
            // Estrategia NetworkFirst para el documento principal (HTML)
            // Esto asegura que siempre busquemos la última versión en el servidor
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 24 * 60 * 60, // 1 día
              },
            },
          },
          {
            // Estrategia para JS y CSS (Assets con hash)
            // Como tienen hash, si cambian, la URL cambia. Podemos cachearlos agresivamente.
            urlPattern: ({ request }) => request.destination === 'script' || request.destination === 'style',
            handler: 'StaleWhileRevalidate', // O CacheFirst si confiamos plenamente en el hash
            options: {
              cacheName: `assets-cache-v${appVersion}`,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
        ],
      },
      manifest: {
        ...manifest,
        version: appVersion,
      },
      build: {
        rollupOptions: {
          output: {
            assetFileNames: 'assets/[name]-[hash][extname]',
            manualChunks(id) {
              if (id.includes('node_modules/exceljs')) {
                return 'exceljs';
              }
              if (id.includes('node_modules')) {
                // Agrupa cada dependencia principal en su propio chunk
                return id.toString().split('node_modules/')[1].split('/')[0].toString();
              }
            },
          },
        },
        chunkSizeWarningLimit: 1000, // Opcional: sube el límite de advertencia
      },
      }),
      visualizer({ open: true }),
    ],
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@routes': path.resolve(__dirname, './src/routes'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@helpers': path.resolve(__dirname, './src/helpers'),
        '@css': path.resolve(__dirname, './src/css'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@src': path.resolve(__dirname, './src'),
        '@context': path.resolve(__dirname, './src/context'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@store': path.resolve(__dirname, './src/store'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@config': path.resolve(__dirname, './src/config'),
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

