import sharedConfig from '@meaku/tailwind-config';
import type { Config } from 'tailwindcss';

const config: Pick<Config, 'prefix' | 'presets' | 'content'> = {
  content: ['./src/**/*.{ts,tsx}', './src/*.{ts,tsx}', './src/components/**/*.{ts,tsx}', './src/components/*.{ts,tsx}'],
  presets: [sharedConfig],
};

export default config;
