import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Input = forwardRef((props: React.InputHTMLAttributes<HTMLInputElement>, ref) => {
  const { className, ...restProps } = props;

  return (
    <input
      className={cn(
        'h-10 w-full flex-1 resize-none overflow-y-auto rounded-md border-gray-300 text-sm focus:border-primary focus:ring-primary',
        className,
      )}
      {...restProps}
    />
  );
});

export default Input;
