import React from 'react';
import { cn } from '../../lib/cn';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  isDashed?: boolean;
}

const Separator = ({ className, vertical = false, isDashed = false, ...props }: IProps) => {
  return (
    <div
      className={cn(
        'border-t border-gray-200',
        {
          'h-px w-full': !vertical, // Horizontal separator
          'h-full w-px': vertical, // Vertical separator
          'border-dashed': isDashed,
        },
        className,
      )}
      {...props}
    ></div>
  );
};

export default Separator;
