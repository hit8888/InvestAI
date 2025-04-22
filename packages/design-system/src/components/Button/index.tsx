import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib/cn';
import './index.css';

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
        leftIcon: '',
        rightIcon: '',
        icon: 'aspect-square',
      },
      variant: {
        primary:
          'bg-primary text-white border-2 border-borderStroke hover:bg-primary/80 focus:bg-primary active:bg-primary ring-primary disabled:bg-primary/30',
        secondary:
          'text-primary border border-primary hover:bg-primary/5 focus:bg-primary/5 active:bg-primary/5 ring-primary disabled:border-primary/30 disabled:text-primary/30',
        tertiary: 'text-primary hover:bg-primary/5 bg-tertiary disabled:text-primary/30',
        destructive:
          'bg-destructive-1000 border-2 text-white border-borderStroke hover:bg-destructive-800 focus:bg-destructive-1000 ring-destructive disabled:bg-destructive-300',
        destructive_secondary:
          'text-destructive-1000 border border-destructive-1000 hover:bg-destructive-50 focus:bg-destructive-50 ring-destructive disabled:border-destructive-300 disabled:text-destructive-300',
        destructive_tertiary:
          'text-destructive-1000 hover:bg-destructive-50 bg-destructive-tertiary disabled:text-destructive-300',
        system:
          'bg-gray-600 border-2 text-white border-borderStroke hover:bg-gray-500 focus:bg-gray-600 ring-system disabled:bg-gray-300',
        system_secondary:
          'text-gray-600 border border-gray-600 hover:bg-gray-50 focus:bg-gray-50 ring-system disabled:border-gray-300 disabled:text-gray-300',
        system_tertiary: 'text-gray-600 hover:bg-gray-50 bg-system-tertiary disabled:text-gray-300',
        inverted_primary:
          'bg-primary/60 border-2 text-customPrimaryText border-borderStroke hover:bg-primary/50 focus:bg-primary/60 ring-inverted disabled:bg-primary/30 disabled:text-gray-300',
        inverted_secondary:
          'text-customPrimaryText border border-primary hover:bg-primary/20 focus:bg-primary/30 active:bg-primary/30 ring-inverted disabled:border-primary/30 disabled:text-gray-300',
        inverted_tertiary: 'text-customPrimaryText hover:bg-primary/20 bg-inverted-tertiary disabled:text-gray-300',
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
      {
        size: 'small',
        buttonStyle: 'leftIcon',
        className: 'pr-3 pl-2 py-2',
      },
      {
        size: 'small',
        buttonStyle: 'rightIcon',
        className: 'pr-2 pl-3 py-2',
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
      {
        size: 'medium',
        buttonStyle: 'leftIcon',
        className: 'pl-2 pr-3.5 py-2.5',
      },
      {
        size: 'medium',
        buttonStyle: 'rightIcon',
        className: 'pr-2 pl-3.5 py-2.5',
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
      {
        size: 'regular',
        buttonStyle: 'leftIcon',
        className: 'pr-4 pl-2 py-3',
      },
      {
        size: 'regular',
        buttonStyle: 'rightIcon',
        className: 'pl-4 pr-2 py-3',
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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, size, buttonStyle, variant, label, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <button className={cn(buttonVariants({ size, buttonStyle, variant, className }))} ref={ref} {...props}>
        {leftIcon && <span className="flex h-4 w-4 items-center">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="flex h-4 w-4 items-center">{rightIcon}</span>}
        {label && <span className="sr-only">{label}</span>}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
