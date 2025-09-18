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
  MOBILE_PADDING: '16px',
  MOBILE_RIGHT_OFFSET: '16px',
  MOBILE_LEFT_OFFSET: '16px',
  MOBILE_TRANSFORM: 'translateY(0)',
  MOBILE_HEIGHT: 'calc(100dvh - 32px)', // Accounting for top and bottom padding
  MOBILE_WIDTH: 'calc(100vw - 32px)', // Accounting for left and right padding

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
 * Natural easing curve for smooth animations
 */
const NATURAL_EASING = [0.4, 0, 0.2, 1] as const;

/**
 * Animation configuration for Framer Motion
 */
export const ANIMATION_CONFIG = {
  mobile: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
    transition: {
      duration: LAYOUT_CONSTANTS.ANIMATION_DURATION,
      ease: LAYOUT_CONSTANTS.ANIMATION_EASE,
      type: LAYOUT_CONSTANTS.ANIMATION_TYPE,
      willChange: 'transform, opacity',
    },
  },
  desktop: {
    initial: { opacity: 0, x: 8, width: LAYOUT_CONSTANTS.DEFAULT_WIDTH },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 8, width: LAYOUT_CONSTANTS.DEFAULT_WIDTH },
    transition: {
      duration: LAYOUT_CONSTANTS.ANIMATION_DURATION,
      ease: NATURAL_EASING, // Use the same natural easing for all properties
      type: LAYOUT_CONSTANTS.ANIMATION_TYPE,
      width: {
        duration: LAYOUT_CONSTANTS.ANIMATION_DURATION,
        ease: NATURAL_EASING,
      },
      right: {
        duration: LAYOUT_CONSTANTS.ANIMATION_DURATION,
        ease: NATURAL_EASING,
      },
      willChange: 'transform, opacity, width, right',
    },
  },
} as const;

/**
 * Base styles for mobile and desktop layouts
 */
export const BASE_STYLES = {
  mobile: {
    position: 'fixed' as const,
    top: LAYOUT_CONSTANTS.MOBILE_PADDING,
    right: LAYOUT_CONSTANTS.MOBILE_RIGHT_OFFSET,
    bottom: LAYOUT_CONSTANTS.MOBILE_PADDING,
    left: LAYOUT_CONSTANTS.MOBILE_LEFT_OFFSET,
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
