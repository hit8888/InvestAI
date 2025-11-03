import { useMemo } from 'react';
import { BOTTOM_BAR_ANIMATIONS, ANIMATION_PRESETS } from '../constants';
import { ANIMATION_TIMINGS } from '../../../constants/animationTimings';

/**
 * Optimized hook for managing BottomCenterBar animation configurations
 * Removed state management - now handled by useBottomBarState
 */
export const useBottomBarAnimation = (isInputReady: boolean, isMobile: boolean, isAnimatingToCorner: boolean) => {
  const containerAnimation = useMemo(() => {
    // Two-phase system: Input first, then modules expand container
    const width = isAnimatingToCorner ? '56px' : isInputReady ? (isMobile ? 'calc(100vw - 32px)' : 'auto') : '0px';

    return {
      initial: {
        opacity: 0,
        y: 0,
        x: '50%',
        transform: 'translateX(50%)',
      },
      animate: {
        width,
        opacity: isInputReady ? 1 : 0,
        y: '0px',
        x: '50%',
        transform: isAnimatingToCorner
          ? 'translateX(calc(50vw - var(--breakout-command-bar-right)))'
          : 'translateX(50%)',
      },
      transition: {
        width: {
          duration: 0.5,
          ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
        },
        opacity: {
          duration: 0.4,
          ease: ANIMATION_TIMINGS.EASING.EASE_OUT,
        },
        x: {
          duration: isAnimatingToCorner ? ANIMATION_TIMINGS.DURATIONS.BOTTOM_BAR_X_CORNER : 0,
          ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : ANIMATION_TIMINGS.EASING.EASE_OUT,
        },
        transform: {
          duration: isAnimatingToCorner ? ANIMATION_TIMINGS.DURATIONS.BOTTOM_BAR_X_CORNER : 0,
          ease: isAnimatingToCorner ? [0.4, 0, 0.2, 1] : ANIMATION_TIMINGS.EASING.EASE_OUT,
        },
      },
    };
  }, [isInputReady, isAnimatingToCorner, isMobile]);

  const containerTransition = useMemo(() => {
    if (isAnimatingToCorner) {
      return {
        ...ANIMATION_PRESETS.EXIT_TO_CORNER,
        delay: 0,
      };
    }

    return {
      duration: 0.4,
      ease: 'easeOut',
    };
  }, [isAnimatingToCorner]);

  return {
    containerAnimation,
    containerTransition,
    springConfig: BOTTOM_BAR_ANIMATIONS.SPRING_CONFIG,
  };
};
