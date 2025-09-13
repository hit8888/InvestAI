import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';

/**
 * Layout constants for FeatureContentWrapper positioning and sizing
 */
export const LAYOUT_CONSTANTS = {
  // Gap constants
  MIN_TOP_GAP: 16,
  MIN_BOTTOM_GAP: 16,

  // Module dimensions
  ASK_AI_MAX_HEIGHT: 730,
  VIDEO_LIBRARY_WIDTH: 750,
  EXPANDED_WIDTH: 750,
  DEFAULT_WIDTH: 450,

  // Animation constants
  ANIMATION_DURATION: 0.3,
  ANIMATION_EASE: 'easeOut' as const,
  ANIMATION_TYPE: 'tween' as const,

  // Mobile layout
  MOBILE_RIGHT_OFFSET: '0px',
  MOBILE_MARGIN_RIGHT: '0px',
  MOBILE_TRANSFORM: 'translateY(50%)',
  MOBILE_HEIGHT: '100dvh',
  MOBILE_WIDTH: '100vw',

  // Desktop layout
  DESKTOP_RIGHT_OFFSET: '64px',
  DESKTOP_MARGIN_RIGHT: '16px',
  DESKTOP_TRANSFORM: 'translateY(50%)',
} as const;

/**
 * Default module configuration shared by most modules
 */
const defaultModuleConfig = {
  maxHeight: LAYOUT_CONSTANTS.ASK_AI_MAX_HEIGHT,
  width: LAYOUT_CONSTANTS.DEFAULT_WIDTH,
  expandedWidth: LAYOUT_CONSTANTS.EXPANDED_WIDTH,
  innerStyles: {
    // No forced height - let it size based on content
  },
} as const;

/**
 * Module-specific configuration for styling and behavior
 */
export const MODULE_CONFIG = {
  ASK_AI: defaultModuleConfig,
  VIDEO_LIBRARY: {
    maxHeight: 'auto', // Will be calculated based on available space
    width: LAYOUT_CONSTANTS.VIDEO_LIBRARY_WIDTH,
    expandedWidth: LAYOUT_CONSTANTS.VIDEO_LIBRARY_WIDTH,
    innerStyles: {
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
    },
  },
  LIVE_CHAT: defaultModuleConfig,
  SUMMARIZE: defaultModuleConfig,
  BOOK_MEETING: defaultModuleConfig,
  IFRAME: defaultModuleConfig,
} as const satisfies Record<
  CommandBarModuleType,
  {
    maxHeight: number | 'auto';
    width: number;
    expandedWidth: number;
    innerStyles: Record<string, string | number>;
  }
>;

/**
 * Animation configuration for Framer Motion
 */
export const ANIMATION_CONFIG = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 8 },
  transition: {
    duration: LAYOUT_CONSTANTS.ANIMATION_DURATION,
    ease: LAYOUT_CONSTANTS.ANIMATION_EASE,
    type: LAYOUT_CONSTANTS.ANIMATION_TYPE,
    willChange: 'transform, opacity',
  },
} as const;

/**
 * Base styles for mobile and desktop layouts
 */
export const BASE_STYLES = {
  mobile: {
    position: 'fixed' as const,
    right: LAYOUT_CONSTANTS.MOBILE_RIGHT_OFFSET,
    marginRight: LAYOUT_CONSTANTS.MOBILE_MARGIN_RIGHT,
    transform: LAYOUT_CONSTANTS.MOBILE_TRANSFORM,
    height: LAYOUT_CONSTANTS.MOBILE_HEIGHT,
    width: LAYOUT_CONSTANTS.MOBILE_WIDTH,
  },
  desktop: {
    position: 'fixed' as const,
    right: LAYOUT_CONSTANTS.DESKTOP_RIGHT_OFFSET,
    marginRight: LAYOUT_CONSTANTS.DESKTOP_MARGIN_RIGHT,
    transform: LAYOUT_CONSTANTS.DESKTOP_TRANSFORM,
  },
} as const;
