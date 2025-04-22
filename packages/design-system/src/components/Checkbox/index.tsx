'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /**
   * When true, renders the checkbox as a circular, dotted checkbox.
   * Defaults to false.
   */
  isCircularCheckbox?: boolean;
}

const Checkbox = React.forwardRef<React.ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, isCircularCheckbox = false, ...props }, ref) => (
    <CheckboxPrimitive.Root
      ref={ref}
      className={cn(
        'ring-offset-background focus-visible:ring-ring peer h-5 w-5 shrink-0 rounded-[4px] border-2 border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ',
        isCircularCheckbox
          ? 'h-6 w-6 rounded-full border-dashed border-gray-600 data-[state=unchecked]:h-5 data-[state=unchecked]:w-5 data-[state=checked]:border-none data-[state=checked]:bg-gray-600'
          : 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className={cn('flex items-center justify-center text-current', {
          'h-5 w-5 rounded-full bg-white': isCircularCheckbox,
        })}
      >
        <Check
          className={cn('h-3 w-3 rounded-sm bg-gray-900', {
            'bg-inherit stroke-gray-600': isCircularCheckbox, // Filled checkmark with stroke
          })}
          strokeWidth={4}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  ),
);
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
