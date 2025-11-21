import sharedConfig from '@meaku/tailwind-config';
import uiTwConfig from '@breakout/design-system/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.tsx',
    './src/*.tsx',
    './src/components/**/*.tsx',
    './src/components/*.tsx',
    './src/pages/*.tsx',
    '../../packages/design-system/src/**/*.{ts,tsx}',
    '../../packages/design-system/src/*.{ts,tsx}',
    '../../packages/design-system/src/components/**/*.{ts,tsx}',
    '../../packages/design-system/src/components/*.{ts,tsx}',
    '../../apps/sevak/client/src/**/*.{ts,tsx}',
  ],
  presets: [sharedConfig, uiTwConfig],
  plugins: [],
};

export default config;
