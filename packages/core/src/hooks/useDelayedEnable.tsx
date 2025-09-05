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

/**
 * Hook to manage delayed enabling of a boolean state based on a delay in milliseconds
 * @param delayMs - Delay in milliseconds before enabling. If undefined or 0, enables immediately. If Infinity, never enables.
 * @returns boolean indicating whether the state is enabled
 */
const useDelayedEnable = (delayMs: number): boolean => {
  const [isEnabled, setIsEnabled] = useState(() => shouldEnableImmediately(delayMs));

  useEffect(() => {
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
  }, [delayMs]);

  return isEnabled;
};

export default useDelayedEnable;
