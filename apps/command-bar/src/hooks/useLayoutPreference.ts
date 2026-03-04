import { useCallback } from 'react';
import { LayoutType } from '@neuraltrade/core/types/storage';
import {
  setLayoutPreference,
  getLayoutPreference,
  clearLayoutPreference,
  determineLayout,
  isLayoutPreferenceActive,
} from '@neuraltrade/core/utils/layout-preference-utils';

/**
 * Custom hook for managing layout preferences
 * Provides a clean interface for layout preference operations
 */
export const useLayoutPreference = () => {
  /**
   * Set user's layout preference
   */
  const setPreference = useCallback((layout: LayoutType) => {
    setLayoutPreference(layout);
  }, []);

  /**
   * Get current layout preference
   */
  const getPreference = useCallback((): LayoutType | null => {
    return getLayoutPreference();
  }, []);

  /**
   * Clear layout preference
   */
  const clearPreference = useCallback(() => {
    clearLayoutPreference();
  }, []);

  /**
   * Determine final layout based on user preference and config
   */
  const determineFinalLayout = useCallback((configLayout: string): LayoutType => {
    return determineLayout(configLayout);
  }, []);

  /**
   * Check if layout preference is currently active
   */
  const isPreferenceActive = useCallback((): boolean => {
    return isLayoutPreferenceActive();
  }, []);

  return {
    setPreference,
    getPreference,
    clearPreference,
    determineFinalLayout,
    isPreferenceActive,
  };
};
