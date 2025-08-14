import { useEffect, useState } from 'react';

/**
 * Hook to manage delayed query enabling based on a delay in milliseconds
 * @param delayMs - Delay in milliseconds before enabling the query. If undefined or 0, enables immediately
 * @returns boolean indicating whether the query should be enabled
 */
const useDelayedQuery = (delayMs?: number): boolean => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (!delayMs || delayMs <= 0) {
      // If no delay is configured, enable the query immediately
      setIsEnabled(true);
      return;
    }

    const timer = setTimeout(() => {
      setIsEnabled(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  return isEnabled;
};

export default useDelayedQuery;
