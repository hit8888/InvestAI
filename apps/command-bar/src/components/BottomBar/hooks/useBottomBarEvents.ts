import { useCallback } from 'react';
import { CommandBarModuleConfigType, CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { MessageEventType } from '@meaku/shared/types/message';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { LayoutType } from '@meaku/core/types/storage';
import { useTriggerExitAndSwitch } from './useTriggerExitAndSwitch';

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
  setPreference?: (layout: LayoutType) => void,
) => {
  // Create the centralized trigger function
  const triggerExitAndSwitch = useTriggerExitAndSwitch(startExitAnimation, onSwitchToDefault, setPreference);
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

      // Use centralized trigger function
      triggerExitAndSwitch(module_type);

      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.ACTION_CLICK, {
        action_type: module_type,
      });
    },
    [activeFeature, setActiveFeature, triggerExitAndSwitch, trackEvent],
  );

  const handleInputSubmit = useCallback(
    (inputValue: string, questionText?: string) => {
      // Get the message to send - either user input or suggested question
      const messageToSend = inputValue.trim() || questionText || '';

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

      // Use centralized trigger function
      triggerExitAndSwitch(ASK_AI, eventData);
    },
    [triggerExitAndSwitch],
  );

  return {
    handleModuleClick,
    handleInputSubmit,
  };
};
