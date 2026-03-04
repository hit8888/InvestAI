import { useState } from 'react';
import { CommandBarModuleType } from '@neuraltrade/core/types/api/configuration_response';
import { MessageEventType, Message } from '@neuraltrade/shared/types/message';
import { ANIMATION_TIMINGS } from '../../../constants/animationTimings';

export interface BottomBarTransitionState {
  hasInteracted: boolean;
  shouldUnmountBottomBar: boolean;
  shouldShowDefaultBar: boolean;
  isDefaultBarReady: boolean;
  pendingModule: CommandBarModuleType | null;
  pendingEventData: {
    message: string;
    eventType: MessageEventType;
  } | null;
  skipInitialTooltips: boolean;
}

export interface BottomBarTransitionActions {
  handleSwitchToDefault: (
    moduleType: CommandBarModuleType,
    eventData?: { message?: string; eventType?: keyof typeof MessageEventType },
  ) => void;
  handleDefaultBarAnimationComplete: () => void;
  setActiveFeature: (feature: CommandBarModuleType | null) => void;
  sendUserMessage: (message: string, overrides?: Partial<Message>) => void;
}

export const useBottomBarTransition = (
  setActiveFeature: (feature: CommandBarModuleType | null) => void,
  sendUserMessage: (message: string, overrides?: Partial<Message>) => void,
) => {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [shouldUnmountBottomBar, setShouldUnmountBottomBar] = useState(false);
  const [shouldShowDefaultBar, setShouldShowDefaultBar] = useState(false);
  const [isDefaultBarReady, setIsDefaultBarReady] = useState(false);
  const [pendingModule, setPendingModule] = useState<CommandBarModuleType | null>(null);
  const [pendingEventData, setPendingEventData] = useState<{
    message: string;
    eventType: MessageEventType;
  } | null>(null);
  const [skipInitialTooltips, setSkipInitialTooltips] = useState(false);

  // Handle transition from bottom center to bottom right
  const handleSwitchToDefault = (
    moduleType: CommandBarModuleType,
    eventData?: { message?: string; eventType?: keyof typeof MessageEventType },
  ) => {
    setHasInteracted(true);
    setPendingModule(moduleType);
    setSkipInitialTooltips(true); // Skip tooltips when switching from bottom bar

    // Store event data to send after animations complete
    if (eventData && eventData.message && eventData.eventType) {
      setPendingEventData({
        message: eventData.message,
        eventType: MessageEventType[eventData.eventType],
      });
    }

    // Control bottom bar unmounting and default bar entry independently
    // Start default bar entry immediately
    setShouldShowDefaultBar(true);

    // Delay bottom bar unmounting to allow overlap
    setTimeout(() => {
      setShouldUnmountBottomBar(true);
    }, ANIMATION_TIMINGS.DELAYS.BOTTOM_BAR_UNMOUNT * 1000); // Use constant for the delay
  };

  // Handle the animation sequence
  const handleDefaultBarAnimationComplete = () => {
    // Default bar has appeared, now it can show its entry animations
    setIsDefaultBarReady(true);

    if (pendingModule) {
      // Activate module after a delay, using a constant
      setTimeout(() => {
        setActiveFeature(pendingModule);
        setPendingModule(null);

        // Send pending event data after module is activated
        if (pendingEventData) {
          sendUserMessage(pendingEventData.message, {
            event_type: pendingEventData.eventType,
          } as Partial<Message>);
          setPendingEventData(null);
        }

        // Don't reset skip tooltips flag when switching from bottom bar
        // This ensures tooltips are permanently skipped for this session
      }, ANIMATION_TIMINGS.DELAYS.MODULE_ACTIVATION * 1000); // Use constant for the delay
    } else {
      // If no pending module, reset the flag immediately
      setSkipInitialTooltips(false);
    }
  };

  const state: BottomBarTransitionState = {
    hasInteracted,
    shouldUnmountBottomBar,
    shouldShowDefaultBar,
    isDefaultBarReady,
    pendingModule,
    pendingEventData,
    skipInitialTooltips,
  };

  const actions: BottomBarTransitionActions = {
    handleSwitchToDefault,
    handleDefaultBarAnimationComplete,
    setActiveFeature,
    sendUserMessage,
  };

  return { state, actions };
};
