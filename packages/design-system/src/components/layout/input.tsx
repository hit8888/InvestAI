import React, { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  const { className, ...restProps } = props;

  return (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full flex-1 resize-none overflow-y-auto rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary',
        className,
      )}
      {...restProps}
    />
  );
});

Input.displayName = 'Input';

export default Input;
