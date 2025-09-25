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
    ACTION_SIZE_FAST: 0.3, // Fast size transition for instant switch
    ACTION_OPACITY_SLOW: 0.8, // Slow opacity transition for smooth exit

    // Bottom bar animation durations
    BOTTOM_BAR_WIDTH: 0.6, // 600ms for width transition
    BOTTOM_BAR_HEIGHT_NORMAL: 0.4, // 400ms for normal height transition
    BOTTOM_BAR_HEIGHT_CORNER: 0.8, // 800ms for corner animation height
    BOTTOM_BAR_BORDER_RADIUS: 0.5, // 500ms for border radius transition
    BOTTOM_BAR_X_CORNER: 0.8, // 800ms for x-axis corner animation

    // Tooltip animations
    TOOLTIP_DURATION: 5000, // in milliseconds
  },

  // Delays (in seconds)
  DELAYS: {
    BASE_TOOLTIP: 1.4,
    BASE_ANIMATION: 0.2, // Start actions at 200ms
    STAGGER_INTERVAL: 0.1,
    SHIMMER_STAGGER: 0.15,
    CONTAINER_DELAY: 0.2,
    // Bottom bar transition delays
    BOTTOM_BAR_UNMOUNT: 0.5, // 500ms delay for bottom bar unmounting
    MODULE_ACTIVATION: 1.0, // 1000ms delay for module activation
    BOTTOM_BAR_EXIT_ANIMATION: 0.8, // 800ms delay for bottom bar exit animation
    // Rotating question delays
    QUESTION_TRANSITION: 0.15, // 150ms delay for question transition
    QUESTION_ROTATION_INTERVAL: 3.0, // 3 seconds between question rotations
    // Bottom bar animation delays
    BOTTOM_BAR_WIDTH_EXPANSION: 0.2, // 200ms delay for Phase 2 expansion
    BOTTOM_BAR_HEIGHT_DELAY: 0.1, // 100ms delay for height animation
    MIN_PHASE_1_DURATION: 1000, // 1 second minimum after dynamic config completes (in milliseconds)
  },

  // Easing functions
  EASING: {
    EASE_OUT: 'easeOut',
    EASE_IN_OUT: 'easeInOut',
    LINEAR: 'linear',
    CUBIC_BEZIER_EXIT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Spring configurations
  SPRING: {
    STIFFNESS: {
      NORMAL: 200,
      HIGH: 300,
      BOTTOM_BAR_Y: 400, // Specific stiffness for bottom bar y animation
    },
    DAMPING: {
      NORMAL: 12,
      HIGH: 30,
      BOTTOM_BAR_Y: 8, // Specific damping for bottom bar y animation
    },
    MASS: 0.8,
    BOTTOM_BAR_Y_MASS: 0.4, // Specific mass for bottom bar y animation
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

  // Bottom bar specific spring configuration
  SPRING_BOTTOM_BAR_Y: {
    type: 'spring' as const,
    stiffness: ANIMATION_TIMINGS.SPRING.STIFFNESS.BOTTOM_BAR_Y,
    damping: ANIMATION_TIMINGS.SPRING.DAMPING.BOTTOM_BAR_Y,
    mass: ANIMATION_TIMINGS.SPRING.BOTTOM_BAR_Y_MASS,
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
