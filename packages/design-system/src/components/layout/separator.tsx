import React from 'react';
import { cn } from '../../lib/cn';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
}

const Separator = ({ className, vertical = false, ...props }: IProps) => {
  return (
    <div
      className={cn(
        'border border-primary/10',
        {
          'h-px w-full': !vertical, // Horizontal separator
          'h-full w-px': vertical, // Vertical separator
        },
        className,
      )}
      {...props}
    ></div>
  );
};

export default Separator;
