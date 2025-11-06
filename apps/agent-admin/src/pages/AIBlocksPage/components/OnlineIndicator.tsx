import { cn } from '@breakout/design-system/lib/cn';
import React from 'react';

type OnlineIndicatorProps = {
  position?: 'bottom-right' | 'top-right';
  size?: number;
  borderWidth?: number;
  offset?: number;
};

const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({
  position = 'bottom-right',
  size = 10,
  borderWidth = 1,
  offset = 2,
}) => {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderWidth: `${borderWidth}px`,
        right: `-${offset}px`,
        ...(position === 'bottom-right' ? { bottom: `-${offset}px` } : { top: `-${offset}px` }),
      }}
      className={cn(
        'absolute z-10 animate-[quick-flash_3s_ease-in-out_infinite] rounded-full border border-white bg-green-500',
      )}
    />
  );
};

export default OnlineIndicator;
