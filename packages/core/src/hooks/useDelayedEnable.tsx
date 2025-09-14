import { useEffect, useState } from 'react';

/**
 * Helper function to determine if a state should be enabled based on delay value
 * @param delayMs - Delay in milliseconds
 * @returns boolean indicating if the state should be enabled immediately
 */
const shouldEnableImmediately = (delayMs: number): boolean => {
  if (delayMs === Infinity) {
    return false;
  }
  return !delayMs || delayMs <= 0;
};

interface UseDelayedEnableOptions {
  /**
   * Whether to start the delay computation. If false, the state remains disabled.
   * @default true
   */
  shouldStart?: boolean;
}

/**
 * Hook to manage delayed enabling of a boolean state based on a delay in milliseconds
 * @param delayMs - Delay in milliseconds before enabling. If undefined or 0, enables immediately. If Infinity, never enables.
 * @param options - Configuration options for the hook
 * @returns boolean indicating whether the state is enabled
 */
const useDelayedEnable = (delayMs: number, options: UseDelayedEnableOptions = {}): boolean => {
  const { shouldStart = true } = options;
  const [isEnabled, setIsEnabled] = useState(() => shouldStart && shouldEnableImmediately(delayMs));

  useEffect(() => {
    if (!shouldStart) {
      setIsEnabled(false);
      return;
    }

    if (shouldEnableImmediately(delayMs)) {
      setIsEnabled(true);
      return;
    }

    if (delayMs === Infinity) {
      setIsEnabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsEnabled(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs, shouldStart]);

  return isEnabled;
};

export default useDelayedEnable;
