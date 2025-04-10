import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib/cn';

export const buttonVariants = cva(
  'rounded-md flex items-center justify-center gap-2 cursor-pointer text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        small: 'text-sm',
        medium: 'text-sm',
        regular: 'text-sm',
      },
      buttonStyle: {
        default: '',
        icon: 'aspect-square',
      },
      variant: {
        primary:
          'bg-primary text-white border-2 border-borderStroke hover:bg-primary/80 focus:bg-primary active:bg-primary focus:ring-4 focus:ring-primary/20 disabled:bg-primary/30',
        secondary:
          'text-primary border border-primary hover:bg-primary/5 focus:bg-primary/5 active:bg-primary/5 focus:ring-4 focus:ring-primary/20 disabled:border-primary/30 disabled:text-primary/30',
        tertiary: 'text-primary hover:bg-primary/5 focus:bg-primary/10 disabled:text-primary/30',
        destructive:
          'bg-destructive-1000 border-2 text-white border-borderStroke hover:bg-destructive-800 focus:bg-destructive-1000 focus:ring-4 focus:ring-destructive-200 disabled:bg-destructive-300',
        destructive_secondary:
          'text-destructive-1000 border border-destructive-1000 hover:bg-destructive-50 focus:bg-destructive-50 focus:ring-4 focus:ring-destructive-200 disabled:border-destructive-300 disabled:text-destructive-300',
        destructive_tertiary:
          'text-destructive-1000 hover:bg-destructive-50 focus:bg-destructive-100 disabled:text-destructive-300',
        system:
          'bg-gray-600 border-2 text-white border-borderStroke hover:bg-gray-500 focus:bg-gray-600 focus:ring-4 focus:ring-gray-200 disabled:bg-gray-300',
        system_secondary:
          'text-gray-600 border border-gray-600 hover:bg-gray-50 focus:bg-gray-50 focus:ring-4 focus:ring-gray-200 disabled:border-gray-300 disabled:text-gray-300',
        system_tertiary: 'text-gray-600 hover:bg-gray-50 focus:bg-gray-100 disabled:text-gray-300',
      },
    },
    compoundVariants: [
      // Small size variants
      {
        size: 'small',
        buttonStyle: 'default',
        className: 'px-3 py-2',
      },
      {
        size: 'small',
        buttonStyle: 'icon',
        className: 'w-8 h-8 py-1.5 px-2',
      },
      // Medium size variants
      {
        size: 'medium',
        buttonStyle: 'default',
        className: 'px-3.5 py-2.5',
      },
      {
        size: 'medium',
        buttonStyle: 'icon',
        className: 'w-9 h-9 py-2.5 px-2',
      },
      // Regular size variants
      {
        size: 'regular',
        buttonStyle: 'default',
        className: 'py-3 px-4',
      },
      {
        size: 'regular',
        buttonStyle: 'icon',
        className: 'w-10 h-10 py-3 px-2',
      },
    ],
    defaultVariants: {
      size: 'small',
      buttonStyle: 'default',
      variant: 'system',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  label?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, size, buttonStyle, variant, label, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ size, buttonStyle, variant, className }))} ref={ref} {...props}>
        {children}
        {label && <span className="sr-only">{label}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
