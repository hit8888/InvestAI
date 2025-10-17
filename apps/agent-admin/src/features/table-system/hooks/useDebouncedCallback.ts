import { useCallback, useRef } from 'react';

/**
 * Hook that returns a debounced version of a callback function
 * The callback will only be called after the specified delay has passed
 * since the last time it was invoked
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => void>(callback: T, delay: number): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay],
  );

  return debouncedCallback;
};
