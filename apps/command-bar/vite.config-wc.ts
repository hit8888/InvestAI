import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? process.env.VITE_COMMAND_BAR_BASE_URL : '/',
  plugins: [
    react(),
    ...(process.env.VITE_SENTRY_AUTH_TOKEN
      ? [
          sentryVitePlugin({
            org: 'breakout',
            project: 'command-bar',
            authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
            sourcemaps: {
              assets: './dist/wc/**',
              filesToDeleteAfterUpload: ['./dist/wc/**/*.map'],
            },
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      '@meaku/saral': path.resolve(__dirname, '../../packages/saral/src'),
      '@meaku/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@meaku/core': path.resolve(__dirname, '../../packages/core/src'),
    },
  },

  publicDir: false,
  build: {
    outDir: 'dist/wc',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main-wc.tsx'),
      output: {
        entryFileNames: `${process.env.VITE_WC_TAG_NAME}.js`,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return `${process.env.VITE_WC_TAG_NAME}.css`;
          }
          return assetInfo.name || 'assets/[name][extname]';
        },
        manualChunks: undefined,
      },
    },
  },
});
