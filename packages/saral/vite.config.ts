import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'lucide-react',
        '@radix-ui/react-slot',
        '@radix-ui/react-popover',
        '@radix-ui/react-tooltip',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'class-variance-authority': 'cva',
          clsx: 'clsx',
          'tailwind-merge': 'twMerge',
          'lucide-react': 'LucideReact',
          '@radix-ui/react-slot': 'RadixSlot',
          '@radix-ui/react-popover': 'RadixPopover',
          '@radix-ui/react-tooltip': 'RadixTooltip',
        },
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
