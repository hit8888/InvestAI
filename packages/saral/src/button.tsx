import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        default_active: 'bg-black text-white',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'shadow-action-btn text-foreground bg-background hover:bg-backgroundLight hover:text-actionBtnIcon',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'bg-muted text-muted-foreground hover:bg-muted/90 hover:muted-foreground/90 hover:shadow-md hover:border transition-all',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        xs: 'h-8 rounded-md px-3 py-[6px] text-sm leading-[22px] !flex font-normal',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-14 w-14',
      },
      hasWipers: {
        true: 'relative overflow-hidden group',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      hasWipers: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  hasWipers?: boolean;
  wiperColor?: string;
  primaryWipers?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      hasWipers = false,
      wiperColor,
      primaryWipers = false,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    // Get wiper color class based on variant and wiperColor prop
    const getWiperColorClass = () => {
      // primaryWipers overrides everything
      if (primaryWipers) return 'bg-primary/40';

      // Custom wiperColor for edge cases (any Tailwind class)
      if (wiperColor) {
        return wiperColor; // Use as-is for custom colors like 'bg-green-300/50'
      }

      // Auto-select based on variant (default behavior)
      const filledVariants = ['default', 'default_active', 'destructive', 'secondary'];
      const outlineVariants = ['outline', 'ghost'];

      if (filledVariants.includes(variant || 'default')) {
        return 'bg-background/25'; // Use background color for filled buttons
      } else if (outlineVariants.includes(variant || 'default')) {
        return 'bg-foreground/5'; // Use gray color for outline/ghost buttons
      }

      return 'bg-primary/40'; // fallback to primary
    };

    if (asChild) {
      // Note: When using asChild with hasWipers, we use a wrapper div approach
      // to ensure the wiper animation works correctly while maintaining Slot functionality

      if (hasWipers) {
        // Wrapper approach: Create a wrapper div that can contain wipers
        // while still using Slot for the actual child component
        return (
          <div className={cn(buttonVariants({ variant, size, hasWipers, className }))}>
            {hasWipers && (
              <>
                {/* Glass wiper effect - two wipers */}
                <div
                  className={`absolute -left-full top-1/2 h-2 w-32 -translate-y-1 -translate-y-1/2 ${getWiperColorClass()} z-[1] -rotate-45 transition-all duration-[500ms] ease-linear group-hover:left-full`}
                />
                <div
                  className={`absolute -left-full top-1/2 h-2 w-32 -translate-x-6 -translate-y-1/2 translate-y-1 ${getWiperColorClass()} z-[1] -rotate-45 transition-all duration-[500ms] ease-linear group-hover:left-full`}
                />
              </>
            )}
            <div
              className={cn(
                hasWipers
                  ? 'relative z-10 flex items-center justify-center gap-2'
                  : 'flex items-center justify-center gap-2',
              )}
            >
              <Slot ref={ref} {...props}>
                {children}
              </Slot>
            </div>
          </div>
        );
      }

      // Standard asChild implementation without wipers
      const Comp = Slot;
      return (
        <Comp className={cn(buttonVariants({ variant, size, hasWipers, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp className={cn(buttonVariants({ variant, size, hasWipers, className }))} ref={ref} {...props}>
        {hasWipers && (
          <>
            {/* Glass wiper effect - two wipers */}
            <div
              className={`absolute -left-full top-1/2 h-2 w-32 -translate-y-1 -translate-y-1/2 ${getWiperColorClass()} z-[1] -rotate-45 transition-all duration-[500ms] ease-linear group-hover:left-full`}
            />
            <div
              className={`absolute -left-full top-1/2 h-2 w-32 -translate-x-6 -translate-y-1/2 translate-y-1 ${getWiperColorClass()} z-[1] -rotate-45 transition-all duration-[500ms] ease-linear group-hover:left-full`}
            />
          </>
        )}
        <div
          className={cn(
            hasWipers
              ? 'relative z-10 flex items-center justify-center gap-2'
              : 'flex items-center justify-center gap-2',
          )}
        >
          {children}
        </div>
      </Comp>
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
