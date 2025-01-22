/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/setup.ts', '**/*.d.ts', '**/*.config.*', '**/mocks/**'],
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    testTimeout: 20000,
    hookTimeout: 20000,
    environmentOptions: {
      jsdom: {
        resources: 'usable',
        features: {
          canvas: true,
          audio: true,
          webgl: true,
        },
      },
    },
    deps: {
      inline: ['@meaku/core', '@breakout/design-system'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@breakout/design-system': path.resolve(__dirname, '../../packages/design-system/src'),
      'apps/agent/src': path.resolve(__dirname, './src'),
    },
  },
});
