import { ANIMATION_TIMINGS } from './animationTimings';

// Animation timing constants for command bar actions
// These constants are now derived from the centralized animation timings
export const ACTION_ANIMATION_CONSTANTS = {
  // Base delays (using centralized values)
  BASE_TOOLTIP_DELAY: ANIMATION_TIMINGS.DELAYS.BASE_TOOLTIP,
  BASE_ANIMATION_DELAY: ANIMATION_TIMINGS.DELAYS.BASE_ANIMATION,
  STAGGER_INTERVAL: ANIMATION_TIMINGS.DELAYS.STAGGER_INTERVAL,
  SHIMMER_STAGGER_INTERVAL: ANIMATION_TIMINGS.DELAYS.SHIMMER_STAGGER,

  // Durations (using centralized values)
  OPACITY_DURATION: ANIMATION_TIMINGS.DURATIONS.ACTION_OPACITY,
  MOVEMENT_DURATION: ANIMATION_TIMINGS.DURATIONS.ACTION_MOVEMENT,
  SHIMMER_DURATION: ANIMATION_TIMINGS.DURATIONS.ACTION_SHIMMER,
  TOOLTIP_DURATION: ANIMATION_TIMINGS.DURATIONS.TOOLTIP_DURATION,

  // Layout constants
  ACTION_GAP: 15,
  ACTION_HEIGHT: 56,
  SHIMMER_WIDTH: 168,
  SHIMMER_TRAVEL_DISTANCE: 112,

  // Z-index values
  SHIMMER_Z_INDEX: 1000,
} as const;

// Common animation styles
export const ANIMATION_STYLES = {
  container: {
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
    perspective: 1000,
  },
  actionButton: {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
  },
  shimmer: {
    width: ACTION_ANIMATION_CONSTANTS.SHIMMER_WIDTH,
    backgroundImage:
      'linear-gradient(135deg, transparent 0%, transparent 46%, hsl(var(--primary) / 0.2) 46%, hsl(var(--primary) / 0.2) 48%, transparent 48%, transparent 54%, hsl(var(--primary) / 0.2) 54%, hsl(var(--primary) / 0.2) 56%, transparent 56%, transparent 100%)',
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
  },
} as const;

// Animation transition presets
export const TRANSITION_PRESETS = {
  container: {
    duration: ACTION_ANIMATION_CONSTANTS.OPACITY_DURATION,
    ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
    delay: ANIMATION_TIMINGS.DELAYS.CONTAINER_DELAY,
  },
  opacity: {
    duration: ACTION_ANIMATION_CONSTANTS.OPACITY_DURATION,
    ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
    delay: ANIMATION_TIMINGS.DELAYS.CONTAINER_DELAY,
  },
  movement: {
    duration: ACTION_ANIMATION_CONSTANTS.MOVEMENT_DURATION,
    ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
  },
  shimmer: {
    duration: ACTION_ANIMATION_CONSTANTS.SHIMMER_DURATION,
    ease: ANIMATION_TIMINGS.EASING.LINEAR,
  },
} as const;
