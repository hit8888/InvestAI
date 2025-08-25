import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ...(process.env.VITE_APP_ENV === 'production'
      ? [
          sentryVitePlugin({
            org: 'breakout',
            project: 'react-frontend',
            authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
            sourcemaps: {
              assets: './dist/**',
              filesToDeleteAfterUpload: ['./dist/**/*.map'],
            },
          }),
        ]
      : []),
  ],

  define: {
    // Define process.env variables that Cal.com component expects
    'process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA': JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || ''),
    'process.env.NEXT_PUBLIC_CALCOM_VERSION': JSON.stringify(process.env.CALCOM_VERSION || 'v1.0.0'),
  },

  resolve: {
    alias: {
      '@breakout/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      '@meaku/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },

  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  server: {
    port: 3000,
  },
});
