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
    // Ensure z-index classes are generated
    'z-tooltip',
    'z-dropdown',
    'z-select',
    'z-popover',
    'z-modal',
    'z-root',
    'z-behind-content',
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
        breakout: 'hsl(var(--breakout))',
        background: 'hsl(var(--background))',
        backgroundLight: 'hsl(var(--background-light))',
        textAccent: 'hsl(var(--text-accent))',
        backgroundSubtle: 'hsl(var(--background-subtle))',
        foreground: 'hsl(var(--foreground))',
        actionBtnIcon: 'hsl(var(--action-btn-icon))',
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
      spacing: {
        'root-bottom-offset': 'var(--breakout-command-bar-bottom)',
        'root-right-offset': 'var(--breakout-command-bar-right)',
      },
      animation: {
        'text-state': 'text-animation 500ms linear infinite alternate-reverse',
        'high-bounce': 'highBounce 1s ease-in-out infinite',
        'quick-flash': 'quick-flash 3s ease-in-out infinite',
        'pulse-medium': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in-right': 'scaleInRight 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'scale-out-right': 'scaleOutRight 0.2s ease-in forwards',
      },
      zIndex: {
        root: 'var(--z-root)',
        tooltip: 'var(--z-tooltip)',
        dropdown: 'var(--z-dropdown)',
        select: 'var(--z-select)',
        popover: 'var(--z-popover)',
        modal: 'var(--z-modal)',
        'behind-content': 'var(--z-behind-content)',
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
        'quick-flash': {
          '0%, 95%': {
            opacity: '1',
            scale: '1',
          },
          '97%': {
            opacity: '0.8',
            scale: '1.25',
          },
          '100%': {
            opacity: '1',
            scale: '1',
          },
        },
        scaleInRight: {
          '0%': {
            transform: 'scale(0) translateX(16px)',
            opacity: '0',
            transformOrigin: 'right center',
          },
          '100%': {
            transform: 'scale(1) translateX(0)',
            opacity: '1',
            transformOrigin: 'right center',
          },
        },
        scaleOutRight: {
          '0%': {
            transform: 'scale(1) translateX(0)',
            opacity: '1',
            transformOrigin: 'right center',
          },
          '100%': {
            transform: 'scale(0) translateX(16px)',
            opacity: '0',
            transformOrigin: 'right center',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
      },
    },
  },
  plugins: [],
};
