import { setLocalStorageData, getLocalStorageData } from './storage-utils';
import { LayoutType } from '../types/storage';
import { LAYOUT_PREFERENCE_CONFIG } from '../constants/layout-preference';

/**
 * Layout preference utilities for managing user's layout choice
 * Stores preference for 1 hour to override config-based layout
 */

// Helper function for safe operations with error handling
const safeLayoutOperation = <T>(operation: () => T, errorMsg: string): T | null => {
  try {
    return operation();
  } catch (error) {
    console.error(errorMsg, error);
    return null;
  }
};

/**
 * Validate if a layout value is valid
 */
const isValidLayout = (layout: string): layout is LayoutType => {
  return layout === 'bottom_center' || layout === 'bottom_right';
};

/**
 * Set user's layout preference with 1-hour expiration
 * @param layout - The layout preference to store
 */
export const setLayoutPreference = (layout: LayoutType): void => {
  if (!isValidLayout(layout)) {
    console.error('Invalid layout preference:', layout);
    return;
  }

  const preference = {
    layout,
    timestamp: Date.now(),
    expiresAt: Date.now() + LAYOUT_PREFERENCE_CONFIG.EXPIRATION_MS,
  };

  safeLayoutOperation(
    () => setLocalStorageData({ layoutPreference: preference }),
    'Error setting layout preference:',
  );
};

/**
 * Get user's layout preference if it exists and hasn't expired
 * Returns null if no preference or expired
 */
export const getLayoutPreference = (): LayoutType | null => {
  return safeLayoutOperation(() => {
    const data = getLocalStorageData();
    const preference = data?.layoutPreference;

    if (!preference) return null;

    // Check if preference has expired
    if (Date.now() > preference.expiresAt) {
      // Clean up expired preference
      clearLayoutPreference();
      return null;
    }

    return preference.layout;
  }, 'Error getting layout preference:');
};

/**
 * Clear the layout preference
 */
export const clearLayoutPreference = (): void => {
  safeLayoutOperation(
    () => setLocalStorageData({ layoutPreference: undefined }),
    'Error clearing layout preference:',
  );
};

/**
 * Determine the final layout based on user preference and config
 * User preference overrides config for 1 hour
 * @param configLayout - The layout from configuration
 * @returns The final layout to use
 */
export const determineLayout = (configLayout: string): LayoutType => {
  const userPreference = getLayoutPreference();

  // User preference overrides config for 1 hour
  if (userPreference === LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT) {
    return LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT;
  }

  // Fall back to config
  return configLayout === LAYOUT_PREFERENCE_CONFIG.CENTER_LAYOUT 
    ? LAYOUT_PREFERENCE_CONFIG.CENTER_LAYOUT 
    : LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT;
};

/**
 * Check if layout preference is active (not expired)
 */
export const isLayoutPreferenceActive = (): boolean => {
  return safeLayoutOperation(() => {
    const data = getLocalStorageData();
    const preference = data?.layoutPreference;

    if (!preference) return false;

    return Date.now() <= preference.expiresAt;
  }, 'Error checking layout preference status:') ?? false;
};
