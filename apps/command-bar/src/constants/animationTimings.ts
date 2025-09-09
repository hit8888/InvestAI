// Shared animation timing constants for the command bar
// This file centralizes all animation-related timings to ensure consistency
// and make future adjustments easier to maintain

export const ANIMATION_TIMINGS = {
  // Base durations (in seconds)
  DURATION: {
    FAST: 0.15,
    NORMAL: 0.3,
    SLOW: 0.4,
    SLOWER: 0.5,
    SLOWEST: 0.6,
  },

  // Specific animation durations
  DURATIONS: {
    // Entry animations
    ENTRY_OPACITY: 0.3,
    ENTRY_SCALE: 0.3,
    ENTRY_MOVEMENT: 0.3,

    // Layout animations
    LAYOUT_TRANSITION: 0.4,
    WIDTH_TRANSITION: 0.3,

    // Action animations
    ACTION_OPACITY: 0.5,
    ACTION_MOVEMENT: 0.6,
    ACTION_SHIMMER: 0.6,

    // Tooltip animations
    TOOLTIP_DURATION: 1000, // in milliseconds
  },

  // Delays (in seconds)
  DELAYS: {
    BASE_TOOLTIP: 1.4,
    BASE_ANIMATION: 0.7,
    STAGGER_INTERVAL: 0.1,
    SHIMMER_STAGGER: 0.15,
    CONTAINER_DELAY: 0.2,
  },

  // Easing functions
  EASING: {
    EASE_OUT: 'easeOut',
    EASE_IN_OUT: 'easeInOut',
    LINEAR: 'linear',
  },

  // Spring configurations
  SPRING: {
    STIFFNESS: {
      NORMAL: 200,
      HIGH: 300,
    },
    DAMPING: {
      NORMAL: 12,
      HIGH: 30,
    },
    MASS: 0.8,
  },
} as const;

// Pre-configured transition objects for common animations
export const TRANSITION_PRESETS = {
  // Entry animations
  ENTRY: {
    duration: ANIMATION_TIMINGS.DURATIONS.ENTRY_OPACITY,
    ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
  },

  // Layout animations
  LAYOUT: {
    type: 'tween' as const,
    duration: ANIMATION_TIMINGS.DURATIONS.LAYOUT_TRANSITION,
    ease: ANIMATION_TIMINGS.EASING.EASE_IN_OUT,
  },

  // Width transitions
  WIDTH: {
    duration: ANIMATION_TIMINGS.DURATIONS.WIDTH_TRANSITION,
    ease: ANIMATION_TIMINGS.EASING.EASE_IN_OUT,
  },

  // Opacity transitions
  OPACITY: {
    duration: ANIMATION_TIMINGS.DURATIONS.ENTRY_OPACITY,
    ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
  },

  // Movement transitions
  MOVEMENT: {
    duration: ANIMATION_TIMINGS.DURATIONS.ENTRY_MOVEMENT,
    ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
  },

  // Spring transitions
  SPRING_Y: {
    type: 'spring' as const,
    stiffness: ANIMATION_TIMINGS.SPRING.STIFFNESS.NORMAL,
    damping: ANIMATION_TIMINGS.SPRING.DAMPING.NORMAL,
    mass: ANIMATION_TIMINGS.SPRING.MASS,
  },

  SPRING_BOTTOM: {
    type: 'spring' as const,
    stiffness: ANIMATION_TIMINGS.SPRING.STIFFNESS.HIGH,
    damping: ANIMATION_TIMINGS.SPRING.DAMPING.HIGH,
  },
} as const;

// Complex transition configurations for specific components
export const COMPONENT_TRANSITIONS = {
  // App container entry animation
  APP_CONTAINER: {
    duration: ANIMATION_TIMINGS.DURATIONS.ENTRY_OPACITY,
    ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
  },

  // Feature content wrapper transitions
  FEATURE_CONTENT: {
    duration: ANIMATION_TIMINGS.DURATIONS.ENTRY_OPACITY,
    bottom: TRANSITION_PRESETS.SPRING_BOTTOM,
    opacity: TRANSITION_PRESETS.OPACITY,
    x: TRANSITION_PRESETS.MOVEMENT,
    layout: TRANSITION_PRESETS.LAYOUT,
    y: TRANSITION_PRESETS.SPRING_Y,
  },

  // Feature content width transition
  FEATURE_CONTENT_WIDTH: {
    width: TRANSITION_PRESETS.WIDTH,
  },
} as const;
