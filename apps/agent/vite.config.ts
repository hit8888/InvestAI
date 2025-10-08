// import { sentryVitePlugin } from '@sentry/vite-plugin';
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
    // Agent is deprecated, so we don't need to use Sentry
    // sentryVitePlugin({
    //   org: 'breakout',
    //   project: 'react-frontend',
    //   authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
    //   sourcemaps: {
    //     assets: './dist/**',
    //     filesToDeleteAfterUpload: ['./dist/**/*.map'],
    //   },
    // }),
  ],

  resolve: {
    alias: [
      {
        find: '@breakout/design-system',
        replacement: path.resolve(__dirname, '../../packages/design-system/src'),
      },
    ],
  },

  build: {
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
