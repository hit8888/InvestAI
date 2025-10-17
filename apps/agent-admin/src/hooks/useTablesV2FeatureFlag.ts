import { useState, useCallback } from 'react';

const TABLES_V2_FEATURE_FLAG_KEY = 'tables_v2_enabled';

/**
 * Gets the initial state of the Tables V2 feature flag from localStorage.
 * Defaults to false if not set or if parsing fails.
 */
const getInitialTablesV2State = (): boolean => {
  const storedValue = localStorage.getItem(TABLES_V2_FEATURE_FLAG_KEY);
  if (storedValue) {
    try {
      const parsedValue = JSON.parse(storedValue);
      return typeof parsedValue === 'boolean' ? parsedValue : false;
    } catch (error) {
      console.error('Failed to parse tables v2 feature flag from localStorage', error);
    }
  }
  return false;
};

/**
 * Hook to manage the Tables V2 feature flag using localStorage.
 *
 * @returns An object containing:
 * - `isTablesV2Enabled`: Current state of the feature flag
 * - `enableTablesV2`: Function to enable Tables V2
 * - `disableTablesV2`: Function to disable Tables V2
 * - `toggleTablesV2`: Function to toggle the feature flag state
 *
 * @example
 * const { isTablesV2Enabled, toggleTablesV2 } = useTablesV2FeatureFlag();
 *
 * return (
 *   <button onClick={toggleTablesV2}>
 *     {isTablesV2Enabled ? 'Disable' : 'Enable'} Tables V2
 *   </button>
 * );
 */
export const useTablesV2FeatureFlag = () => {
  const [isTablesV2Enabled, setIsTablesV2Enabled] = useState(getInitialTablesV2State);

  const enableTablesV2 = useCallback(() => {
    setIsTablesV2Enabled(true);
    localStorage.setItem(TABLES_V2_FEATURE_FLAG_KEY, JSON.stringify(true));
  }, []);

  const disableTablesV2 = useCallback(() => {
    setIsTablesV2Enabled(false);
    localStorage.setItem(TABLES_V2_FEATURE_FLAG_KEY, JSON.stringify(false));
  }, []);

  const toggleTablesV2 = useCallback(() => {
    setIsTablesV2Enabled((prev) => {
      const newValue = !prev;
      localStorage.setItem(TABLES_V2_FEATURE_FLAG_KEY, JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  return {
    isTablesV2Enabled,
    enableTablesV2,
    disableTablesV2,
    toggleTablesV2,
  };
};
