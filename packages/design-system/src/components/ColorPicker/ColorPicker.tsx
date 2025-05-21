import React from 'react';

import { cn } from '../../lib/cn';

export interface ColorPickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  color: string;
  fallbackColor?: string;
  sizeClass?: string;
  className?: string;
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>((props, ref) => {
  const {
    color,
    fallbackColor = '#E0E0E0',
    sizeClass = 'h-6 w-6',
    className,
    onChange,
    onFocus,
    onBlur,
    ...restProps
  } = props;

  return (
    <div ref={ref} className={cn('relative', sizeClass, className)}>
      <input
        type="color"
        value={color}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        aria-label="Select color"
        {...restProps}
      />
      <div
        className="absolute inset-0 z-0 h-full w-full rounded border border-gray-100 transition-colors duration-200"
        style={{
          backgroundColor: color || fallbackColor,
        }}
      />
    </div>
  );
});

export default ColorPicker;
