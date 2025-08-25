/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    // Include Saral package components
    '../../packages/saral/src/**/*.{js,ts,jsx,tsx}',
    // Include Shared package components
    '../../packages/shared/src/**/*.{js,ts,jsx,tsx}',
    // Include any web component content
    './src/**/*.tsx',
  ],
  safelist: [
    // Ensure custom color classes are generated
    'bg-primary',
    'text-primary-foreground',
    'hover:bg-primary/90',
    'bg-primary-subtle',
    'bg-secondary',
    'text-secondary-foreground',
    'hover:bg-secondary/80',
    'bg-destructive',
    'text-destructive-foreground',
    'hover:bg-destructive/90',
    'bg-muted',
    'text-muted-foreground',
    'bg-accent',
    'text-accent-foreground',
    'hover:bg-accent',
    'hover:text-accent-foreground',
    'bg-background',
    'text-foreground',
    'border-border',
    'ring-ring',
    'bg-card',
    'text-card-foreground',
    'bg-popover',
    'text-popover-foreground',
    'bg-positive-dark',
    'text-positive-dark',
    'bg-positive-light',
    'text-positive-light',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        borderDark: 'hsl(var(--border-dark))',
        input: 'hsl(var(--input))',
        link: 'hsl(var(--link))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        actionBtnIcon: 'hsl(var(--action-btn-icon))',
        actionBtnIconHover: 'hsl(var(--action-btn-icon-hover))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          subtle: 'hsl(var(--primary-subtle))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          25: '#FEFAFA',
          50: '#FDF5F5',
          100: '#FBEAEA',
          200: '#F6D5D5',
          300: '#F2C1C1',
          400: '#EDACAC',
          500: '#E99797',
          600: '#E58282',
          700: '#E06D6D',
          800: '#DC5959',
          900: '#D74444',
          1000: '#D32F2F',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        base: {
          foreground: 'hsl(var(--base-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        positive: {
          DEFAULT: 'hsl(var(--positive-100))',
          dark: 'hsl(var(--positive-dark))',
          light: 'hsl(var(--positive-light))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'elevation-md': 'var(--shadow-elevation-md)',
        'action-btn': 'var(--shadow-action-btn)',
      },
      animation: {
        'text-state': 'text-animation 500ms linear infinite alternate-reverse',
        'high-bounce': 'highBounce 1s ease-in-out infinite',
        'slide-in-right': 'slideInFromRight 0.5s ease-out forwards',
      },
      keyframes: {
        highBounce: {
          '0%, 100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
          '50%': {
            transform: 'translateY(-3px)',
            opacity: '0.4',
          },
        },
        'text-animation': {
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '100% 0%' },
        },
        slideInFromRight: {
          '0%': { transform: 'translateX(10%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
