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
    },
    variant: {
      primary: 'button--primary',
      secondary: 'button--secondary',
      tertiary: 'button--tertiary',
      destructive: 'button--destructive',
      destructive_secondary: 'button--destructive-secondary',
      destructive_tertiary: 'button--destructive-tertiary',
      system: 'button--system',
      system_secondary: 'button--system-secondary',
      system_tertiary: 'button--system-tertiary',
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
