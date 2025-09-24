import { useMemo } from 'react';
import { BOTTOM_BAR_ANIMATIONS, ANIMATION_PRESETS } from '../constants';
import { TRANSITION_PRESETS } from '../../../constants/animationTimings';

/**
 * Optimized hook for managing BottomCenterBar animation configurations
 * Removed state management - now handled by useBottomBarState
 */
export const useBottomBarAnimation = (isModulesReady: boolean, isMobile: boolean, isAnimatingToCorner: boolean) => {
  const containerAnimation = useMemo(() => {
    const isExpanded = isModulesReady && !isAnimatingToCorner;
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
        y: '66px',
        opacity: 1,
      },
      animate: {
        width,
        height: isAnimatingToCorner
          ? `${BOTTOM_BAR_ANIMATIONS.LAYOUT.FINAL_HEIGHT}px`
          : BOTTOM_BAR_ANIMATIONS.LAYOUT.BAR_SIZE,
        borderRadius: '40px',
        y: isAnimatingToCorner ? '0px' : isExpanded ? '0px' : '66px',
        x: isAnimatingToCorner ? 'calc(50vw - 16px)' : '50%',
      },
    };
  }, [isModulesReady, isAnimatingToCorner, isMobile]);

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
