import React, { HTMLAttributes, KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';

interface AccessibleDivProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onKeyDown' | 'onClick'> {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

const AccessibleDiv = React.forwardRef<HTMLDivElement, AccessibleDivProps>(
  ({ onClick, className, children, disabled = false, ...props }, ref) => {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };

    const handleClick = () => {
      if (disabled) return;
      onClick();
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? undefined : 0}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        className={cn(
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
          {
            'cursor-not-allowed opacity-50': disabled,
            'cursor-pointer': !disabled,
          },
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

AccessibleDiv.displayName = 'AccessibleDiv';

export default AccessibleDiv;
