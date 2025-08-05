import React, { HTMLAttributes, KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';

interface AccessibleTableRowProps extends Omit<HTMLAttributes<HTMLTableRowElement>, 'onKeyDown' | 'onClick'> {
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  clickable?: boolean;
  disabled?: boolean;
}

const AccessibleTableRow = React.forwardRef<HTMLTableRowElement, AccessibleTableRowProps>(
  ({ onClick, className, children, clickable = false, disabled = false, ...props }, ref) => {
    const isInteractive = clickable && onClick && !disabled;

    const handleKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
      if (!isInteractive) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    const handleClick = () => {
      if (!isInteractive) return;
      onClick();
    };

    return (
      <tr
        ref={ref}
        tabIndex={isInteractive ? 0 : undefined}
        onKeyDown={isInteractive ? handleKeyDown : undefined}
        onClick={isInteractive ? handleClick : undefined}
        className={cn(
          {
            'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1':
              isInteractive,
            'cursor-not-allowed opacity-50': disabled,
          },
          className,
        )}
        {...props}
      >
        {children}
      </tr>
    );
  },
);

AccessibleTableRow.displayName = 'AccessibleTableRow';

export default AccessibleTableRow;
