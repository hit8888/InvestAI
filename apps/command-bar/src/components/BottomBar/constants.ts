// Animation constants for BottomCenterBar component
// Centralized animation configuration for consistency and maintainability

export const BOTTOM_BAR_ANIMATIONS = {
  // Spring physics configuration for water drop bounce effect
  SPRING_CONFIG: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 8,
    mass: 0.4,
  },

  // Animation durations in milliseconds
  TRANSITION_DURATIONS: {
    EXIT_ANIMATION: 800,
    CONTENT_REVEAL: 300,
    CONTAINER_EXPANSION: 500,
    INPUT_FADE: 200,
  },

  // Easing functions for smooth animations
  EASING: {
    EXIT: [0.4, 0, 0.2, 1],
    ENTRY: 'easeOut',
    SPRING: 'easeOut',
  },

  // Layout constants
  LAYOUT: {
    BAR_SIZE: 66,
    FINAL_HEIGHT: 56,
    BAR_PADDING: 12,
    ACTION_BUTTON_GAP: 12,
  },
} as const;

// Animation presets for different states
export const ANIMATION_PRESETS = {
  // Initial slide-in animation
  SLIDE_IN: {
    y: BOTTOM_BAR_ANIMATIONS.SPRING_CONFIG,
  },

  // Container expansion animation
  CONTAINER_EXPANSION: {
    width: { duration: 0.4, delay: 0.15 }, // Slightly faster and earlier to sync with modules
    height: { duration: 0.4, delay: 0.15 },
    opacity: { duration: 0.2 },
    borderRadius: { duration: 0.5 },
    y: { ...BOTTOM_BAR_ANIMATIONS.SPRING_CONFIG, delay: 0.1 },
  },

  // Exit animation to corner
  EXIT_TO_CORNER: {
    duration: 0.8,
    ease: BOTTOM_BAR_ANIMATIONS.EASING.EXIT,
    width: { duration: 0.8, ease: BOTTOM_BAR_ANIMATIONS.EASING.EXIT },
  },

  // Content reveal animation
  CONTENT_REVEAL: {
    duration: BOTTOM_BAR_ANIMATIONS.TRANSITION_DURATIONS.CONTENT_REVEAL,
    ease: BOTTOM_BAR_ANIMATIONS.EASING.ENTRY,
  },
} as const;

// Button sizing constants for dynamic width calculations
export const BUTTON_SIZING = {
  // RotatingQuestionButton width calculation constants
  ROTATING_QUESTION: {
    // Base padding for button content (left + right padding)
    BASE_PADDING: 24,
    // Approximate width per character in pixels (depends on font size 12px)
    CHAR_WIDTH: 6,
    // Additional padding for icon spacing and visual balance
    ICON_PADDING: 16,
    // Fixed width for send icon state
    SEND_ICON_WIDTH: 30,
    // Minimum width for question buttons
    MIN_QUESTION_WIDTH: 80,
    // Fixed height for all button states
    HEIGHT: 30,
  },

  // Action button size constants
  ACTION_BUTTON: {
    // Default button size
    DEFAULT_SIZE: 42,
    // Large button size for animations
    LARGE_SIZE: 56,
  },
} as const;

// Input field constants
export const INPUT_FIELD = {
  // Default placeholder text for input field
  DEFAULT_PLACEHOLDER: 'See why top companies choose us?',
} as const;

// Animation constants for CommandBarRenderer
export const COMMAND_BAR_ANIMATIONS = {
  NUDGE: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: 0.4,
    },
  },
  DEFAULT_BAR_ENTRY: {
    width: {
      duration: 0.6,
      delay: 0,
      ease: 'easeOut' as const,
    },
    opacity: {
      duration: 0.1,
      delay: 0,
    },
  },
  DEFAULT_BAR_EXIT: {
    width: {
      duration: 0.3,
      delay: 0,
    },
    opacity: {
      duration: 0,
      delay: 0,
    },
  },
  CONTAINER: {
    initial: { opacity: 1, scale: 1 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      opacity: { duration: 0, delay: 0 },
      scale: { duration: 0, delay: 0 },
    },
  },
} as const;
