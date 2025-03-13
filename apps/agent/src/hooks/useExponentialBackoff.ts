import { useCallback, useEffect, useRef } from 'react';

interface ExponentialBackoffOptions {
  initialThreshold: number;
  maxThreshold: number;
  backoffFactor: number;
  maxAttempts: number;
}

interface BackoffState {
  attemptCount: number;
  nextThreshold: number;
  isLastAttempt: boolean;
}

export const useExponentialBackoff = ({
  initialThreshold,
  maxThreshold,
  backoffFactor,
  maxAttempts,
}: ExponentialBackoffOptions) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const attemptCountRef = useRef(0);
  const isMountedRef = useRef(true);

  // Set isMounted to false when component unmounts
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      // Clean up timer on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const getNextThreshold = useCallback(() => {
    const backoffTime = initialThreshold * Math.pow(backoffFactor, attemptCountRef.current);
    return Math.min(backoffTime, maxThreshold);
  }, [initialThreshold, maxThreshold, backoffFactor]);

  const startBackoffTimer = useCallback(
    (callback: (state: BackoffState) => void) => {
      // Don't start timer if component is unmounted
      if (!isMountedRef.current) return;

      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Only set timer if we haven't exceeded max attempts
      if (attemptCountRef.current < maxAttempts) {
        const threshold = getNextThreshold();

        timerRef.current = setTimeout(() => {
          // Check if component is still mounted before executing callback
          if (!isMountedRef.current) return;

          const currentAttempt = attemptCountRef.current + 1;

          // Call the provided callback with current state
          callback({
            attemptCount: currentAttempt,
            nextThreshold: getNextThreshold(),
            isLastAttempt: currentAttempt >= maxAttempts,
          });

          // Increment attempt count after callback
          attemptCountRef.current = currentAttempt;
        }, threshold);
      }
    },
    [maxAttempts, getNextThreshold],
  );

  const resetBackoff = useCallback(() => {
    // Don't reset if component is unmounted
    if (!isMountedRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    attemptCountRef.current = 0;
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    startBackoffTimer,
    resetBackoff,
    clearTimer,
  };
};
