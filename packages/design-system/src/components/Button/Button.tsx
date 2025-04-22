import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import './index.css';

export const buttonVariants = cva('button', {
  variants: {
    size: {
      small: 'button--small',
      medium: 'button--medium',
      regular: 'button--regular',
      icon: 'button--icon',
    },
    buttonStyle: {
      default: '',
      icon: 'aspect-square',
      leftIcon: '',
      rightIcon: '',
    },
    variant: {
      primary: 'button--primary ring-primary',
      secondary: 'button--secondary ring-primary',
      tertiary: 'button--tertiary bg-tertiary',
      destructive: 'button--destructive ring-destructive',
      destructive_secondary: 'button--destructive-secondary ring-destructive',
      destructive_tertiary: 'button--destructive-tertiary bg-destructive-tertiary',
      system: 'button--system ring-system',
      system_secondary: 'button--system-secondary ring-system',
      system_tertiary: 'button--system-tertiary bg-system-tertiary',
      inverted_primary: 'button--inverted-primary ring-inverted',
      inverted_secondary: 'button--inverted-secondary ring-inverted',
      inverted_tertiary: 'button--inverted-tertiary bg-inverted-tertiary-light',
    },
  },
  defaultVariants: {
    size: 'small',
    buttonStyle: 'default',
    variant: 'system',
  },
});

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
