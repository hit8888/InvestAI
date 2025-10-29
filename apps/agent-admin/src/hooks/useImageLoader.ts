import { useState } from 'react';

/**
 * Custom hook for managing image loading states
 * Eliminates duplicate image loading logic across components
 */
export const useImageLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return {
    isLoading,
    hasError,
    imgProps: {
      onLoad: handleLoad,
      onError: handleError,
    },
  };
};
