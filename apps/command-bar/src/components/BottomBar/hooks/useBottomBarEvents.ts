import { useCallback } from 'react';
import { CommandBarModuleConfigType, CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { MessageEventType } from '@meaku/shared/types/message';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { ANIMATION_TIMINGS } from '../../../constants/animationTimings';

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

/**
 * Custom hook for managing BottomCenterBar event handlers
 */
export const useBottomBarEvents = (
  activeFeature: CommandBarModuleType | null,
  setActiveFeature: (feature: CommandBarModuleType | null) => void,
  onSwitchToDefault: (
    moduleType: CommandBarModuleType,
    eventData?: { message?: string; eventType?: keyof typeof MessageEventType },
  ) => void,
  startExitAnimation: () => void,
  trackEvent: (event: string, data: Record<string, unknown>) => void,
) => {
  const handleModuleClick = useCallback(
    async (featureConfig: CommandBarModuleConfigType) => {
      if (!featureConfig) return;

      const { module_type } = featureConfig;

      // If already active, just deactivate
      if (activeFeature === module_type) {
        setActiveFeature(null);
        trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.ACTION_CLICK, {
          action_type: module_type,
        });
        return;
      }

      // Start exit animation
      startExitAnimation();

      // Wait for movement and shrink to complete, then switch to default bar
      setTimeout(() => {
        requestAnimationFrame(() => {
          onSwitchToDefault(module_type);
        });
      }, ANIMATION_TIMINGS.DELAYS.BOTTOM_BAR_EXIT_ANIMATION * 1000);

      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.ACTION_CLICK, {
        action_type: module_type,
      });
    },
    [activeFeature, setActiveFeature, onSwitchToDefault, startExitAnimation, trackEvent],
  );

  const handleInputSubmit = useCallback(
    (inputValue: string, questionText?: string) => {
      // Get the message to send - either user input or suggested question
      const messageToSend = inputValue.trim() || questionText || '';

      // Start exit animation
      startExitAnimation();

      setTimeout(() => {
        requestAnimationFrame(() => {
          // Determine if this is a suggested question click or user input
          const isSuggestedQuestion = questionText && !inputValue.trim();

          // Construct the complete event data
          const eventData = messageToSend
            ? {
                message: messageToSend,
                eventType: isSuggestedQuestion
                  ? MessageEventType.SUGGESTED_QUESTION_CLICKED
                  : MessageEventType.TEXT_REQUEST,
              }
            : undefined;

          // Pass complete event to centralized handler
          onSwitchToDefault(ASK_AI, eventData);
        });
      }, ANIMATION_TIMINGS.DELAYS.BOTTOM_BAR_EXIT_ANIMATION * 1000);
    },
    [onSwitchToDefault, startExitAnimation],
  );

  return {
    handleModuleClick,
    handleInputSubmit,
  };
};
