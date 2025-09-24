import React, { useState } from 'react';
import { cn } from './utils';

export interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  size?: number;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className,
  fallbackClassName,
  size = 28,
}) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  if (hasError) {
    return (
      <div
        className={cn('flex items-center justify-center rounded-full bg-gray-200', fallbackClassName)}
        style={{ width: size, height: size }}
      >
        <svg
          className="text-gray-400"
          style={{ width: size * 0.57, height: size * 0.57 }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn('rounded-full object-cover', className)}
      style={{ width: size, height: size }}
      onError={handleError}
    />
  );
};
