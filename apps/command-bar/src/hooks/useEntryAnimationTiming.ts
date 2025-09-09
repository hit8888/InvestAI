import { useMemo } from 'react';
import type { CommandBarModuleConfigType } from '@meaku/core/types/api/configuration_response';
import { ANIMATION_TIMINGS } from '../constants/animationTimings';

export const useEntryAnimationTiming = (modules: CommandBarModuleConfigType[]) => {
  return useMemo(() => {
    if (modules.length === 0) return 0;

    // Entry animation timing breakdown:
    // 1. Container fade: 0.3s
    // 2. Button movement: base delay + stagger + movement duration
    // 3. Shimmer: base delay + stagger + shimmer duration
    // 4. Tooltip: base delay + stagger + tooltip duration

    const lastActionMovement =
      ANIMATION_TIMINGS.DELAYS.BASE_ANIMATION +
      (modules.length - 1) * ANIMATION_TIMINGS.DELAYS.STAGGER_INTERVAL +
      ANIMATION_TIMINGS.DURATIONS.ACTION_MOVEMENT;

    const lastActionShimmer =
      ANIMATION_TIMINGS.DELAYS.BASE_TOOLTIP +
      (modules.length - 1) * ANIMATION_TIMINGS.DELAYS.SHIMMER_STAGGER +
      ANIMATION_TIMINGS.DURATIONS.ACTION_SHIMMER;

    const lastActionTooltip =
      ANIMATION_TIMINGS.DELAYS.BASE_TOOLTIP +
      (modules.length - 1) * ANIMATION_TIMINGS.DELAYS.STAGGER_INTERVAL +
      ANIMATION_TIMINGS.DURATIONS.TOOLTIP_DURATION / 1000; // Convert ms to seconds

    // Return the maximum completion time + small buffer
    return (
      Math.max(lastActionMovement, lastActionShimmer, lastActionTooltip) + ANIMATION_TIMINGS.DELAYS.CONTAINER_DELAY
    );
  }, [modules.length]);
};
