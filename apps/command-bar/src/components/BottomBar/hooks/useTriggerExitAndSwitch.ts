import { useCallback } from 'react';
import { CommandBarModuleType } from '@neuraltrade/core/types/api/configuration_response';
import { MessageEventType } from '@neuraltrade/shared/types/message';
import { ANIMATION_TIMINGS } from '../../../constants/animationTimings';
import { LAYOUT_PREFERENCE_CONFIG } from '@neuraltrade/core/constants/layout-preference';
import { LayoutType } from '@neuraltrade/core/types/storage';

/**
 * Custom hook to centralize exit animation and switch to default bar logic
 * This reduces code duplication across multiple handlers
 */
export const useTriggerExitAndSwitch = (
  startExitAnimation: () => void,
  onSwitchToDefault: (
    moduleType: CommandBarModuleType,
    eventData?: { message?: string; eventType?: keyof typeof MessageEventType },
  ) => void,
  setPreference?: (layout: LayoutType) => void,
) => {
  return useCallback(
    (moduleType: CommandBarModuleType, eventData?: { message?: string; eventType?: keyof typeof MessageEventType }) => {
      // Start exit animation
      startExitAnimation();

      // Store user preference for bottom_right layout (1 hour expiration)
      if (setPreference) {
        setPreference(LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT);
      }

      // Wait for animation to complete, then switch to default bar
      setTimeout(() => {
        requestAnimationFrame(() => {
          onSwitchToDefault(moduleType, eventData);
        });
      }, ANIMATION_TIMINGS.DELAYS.BOTTOM_BAR_EXIT_ANIMATION * 1000);
    },
    [startExitAnimation, onSwitchToDefault, setPreference],
  );
};
