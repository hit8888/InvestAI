import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import type { AnimationProps } from 'framer-motion';
import { cn } from './utils';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipArrow = TooltipPrimitive.Arrow;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    hasArrow?: boolean;
    animation?: AnimationProps;
    arrowClassName?: string;
  }
>(({ className, sideOffset = 4, hasArrow = true, animation, arrowClassName, ...props }, ref) => {
  const defaultAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };

  const finalAnimation = animation || defaultAnimation;

  return (
    <TooltipPrimitive.Content ref={ref} sideOffset={sideOffset} asChild {...props}>
      <motion.div
        {...finalAnimation}
        className={cn(
          'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
          className,
        )}
      >
        {props.children}
        {hasArrow && <TooltipArrow className={cn('fill-popover', arrowClassName)} />}
      </motion.div>
    </TooltipPrimitive.Content>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow };
