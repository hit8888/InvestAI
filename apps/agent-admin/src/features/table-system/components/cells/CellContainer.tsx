import type { HTMLAttributes } from 'react';
import { cn } from '@breakout/design-system/lib/cn';

const BASE_CLASSES = 'h-full min-w-0 w-full flex items-center gap-2';

export type CellContainerProps = HTMLAttributes<HTMLDivElement>;

export const CellContainer = ({ children, className, ...rest }: CellContainerProps) => (
  <div className={cn(BASE_CLASSES, className)} {...rest}>
    {children}
  </div>
);
