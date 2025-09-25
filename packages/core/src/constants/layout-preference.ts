/**
 * Layout preference configuration constants
 */

// Layout preference expiration time (1 hour in milliseconds)
export const LAYOUT_PREFERENCE_EXPIRATION_MS = 60 * 60 * 1000;

// Default layout values
export const DEFAULT_LAYOUT = 'bottom_right' as const;
export const CENTER_LAYOUT = 'bottom_center' as const;

// Layout preference storage keys
export const LAYOUT_PREFERENCE_KEYS = {
  LAYOUT: 'layout',
  TIMESTAMP: 'timestamp',
  EXPIRES_AT: 'expiresAt',
} as const;

// Layout preference configuration
export const LAYOUT_PREFERENCE_CONFIG = {
  EXPIRATION_MS: LAYOUT_PREFERENCE_EXPIRATION_MS,
  DEFAULT_LAYOUT,
  CENTER_LAYOUT,
} as const;
