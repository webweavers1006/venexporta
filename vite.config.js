import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from "vite-plugin-pwa";
import { manifest } from './manifest';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const appVersion = env.VITE_APP_VERSION;

  return {
    plugins: [react(), tailwindcss(), VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
            handler: 'NetworkFirst',
            options: {
              cacheName: `dynamic-cache-v${appVersion}`,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 24 * 60 * 60, // 1 día
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
          },
        },
      },
    })],
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
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

