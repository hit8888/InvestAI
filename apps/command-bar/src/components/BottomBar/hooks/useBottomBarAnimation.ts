import { useMemo } from 'react';
import { BOTTOM_BAR_ANIMATIONS, ANIMATION_PRESETS } from '../constants';
import { TRANSITION_PRESETS, ANIMATION_TIMINGS } from '../../../constants/animationTimings';

/**
 * Optimized hook for managing BottomCenterBar animation configurations
 * Removed state management - now handled by useBottomBarState
 */
export const useBottomBarAnimation = (
  isModulesReady: boolean,
  isMobile: boolean,
  isAnimatingToCorner: boolean,
  isDynamicConfigLoading: boolean = false,
  isWidthExpanded: boolean = false,
) => {
  const containerAnimation = useMemo(() => {
    // Single phase: Direct entry to expanded state when dynamic API is ready
    const isExpanded = isWidthExpanded; // Use width expansion state

    const width = isAnimatingToCorner
      ? '56px'
      : isExpanded
        ? isMobile
          ? 'calc(100vw - 32px)'
          : 'max(40vw, 900px)'
        : BOTTOM_BAR_ANIMATIONS.LAYOUT.BAR_SIZE;

    return {
      initial: {
        width: BOTTOM_BAR_ANIMATIONS.LAYOUT.BAR_SIZE,
        height: BOTTOM_BAR_ANIMATIONS.LAYOUT.BAR_SIZE,
        borderRadius: '50%',
        y: '84px', // Start below screen
        opacity: 1,
      },
      animate: {
        width,
        height: isAnimatingToCorner
          ? `${BOTTOM_BAR_ANIMATIONS.LAYOUT.FINAL_HEIGHT}px`
          : BOTTOM_BAR_ANIMATIONS.LAYOUT.BAR_SIZE,
        borderRadius: '40px',
        y: '0px', // Always bounce to center
        x: '50%', // Always stay at center
        transform: isAnimatingToCorner
          ? 'translateX(calc(50vw - var(--breakout-command-bar-right)))'
          : 'translateX(50%)',
      },
      transition: {
        width: {
          duration: ANIMATION_TIMINGS.DURATIONS.BOTTOM_BAR_WIDTH,
          delay: 0, // No delay needed since we control it with state
          ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
        },
        height: {
          duration: isAnimatingToCorner
            ? ANIMATION_TIMINGS.DURATIONS.BOTTOM_BAR_HEIGHT_CORNER
            : ANIMATION_TIMINGS.DURATIONS.BOTTOM_BAR_HEIGHT_NORMAL,
          delay: isAnimatingToCorner ? 0 : ANIMATION_TIMINGS.DELAYS.BOTTOM_BAR_HEIGHT_DELAY,
          ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : ANIMATION_TIMINGS.EASING.EASE_OUT,
        },
        borderRadius: {
          duration: ANIMATION_TIMINGS.DURATIONS.BOTTOM_BAR_BORDER_RADIUS,
          delay: 0, // Border radius happens during bounce
        },
        y: {
          ...TRANSITION_PRESETS.SPRING_BOTTOM_BAR_Y,
          delay: 0,
        },
        x: {
          duration: isAnimatingToCorner ? ANIMATION_TIMINGS.DURATIONS.BOTTOM_BAR_X_CORNER : 0,
          delay: isAnimatingToCorner ? 0 : 0,
          ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : ANIMATION_TIMINGS.EASING.EASE_OUT,
        },
        transform: {
          duration: isAnimatingToCorner ? ANIMATION_TIMINGS.DURATIONS.BOTTOM_BAR_X_CORNER : 0,
          delay: isAnimatingToCorner ? 0 : 0,
          ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : ANIMATION_TIMINGS.EASING.EASE_OUT,
        },
      },
    };
  }, [isModulesReady, isAnimatingToCorner, isMobile, isDynamicConfigLoading, isWidthExpanded]);

  const containerTransition = useMemo(() => {
    if (isAnimatingToCorner) {
      return {
        ...ANIMATION_PRESETS.EXIT_TO_CORNER,
        delay: 0,
      };
    }

    if (isModulesReady) {
      return {
        ...ANIMATION_PRESETS.CONTAINER_EXPANSION,
        y: TRANSITION_PRESETS.SPRING_Y,
      };
    }

    return {
      y: TRANSITION_PRESETS.SPRING_Y,
      duration: 0,
    };
  }, [isModulesReady, isAnimatingToCorner]);

  return {
    containerAnimation,
    containerTransition,
    springConfig: BOTTOM_BAR_ANIMATIONS.SPRING_CONFIG,
  };
};
