import { useState, useEffect, useMemo, useCallback } from 'react';
import { CommandBarModuleConfigType, CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@meaku/core/types/api/configuration_response';
import { MessageEventType } from '@meaku/shared/types/message';
import { LAYOUT_PREFERENCE_CONFIG } from '@meaku/core/constants/layout-preference';
import { ANIMATION_TIMINGS } from '../../../constants/animationTimings';
import { useLayoutPreference } from '../../../hooks/useLayoutPreference';

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

/**
 * Consolidated hook for managing all bottom bar state
 * Combines module management, animation state, and event handling
 */
export const useBottomBarState = (
  modules: CommandBarModuleConfigType[],
  isConfigLoading: boolean,
  isMobile: boolean,
  activeFeature: CommandBarModuleType | null,
  setActiveFeature: (feature: CommandBarModuleType | null) => void,
  onSwitchToDefault: (
    moduleType: CommandBarModuleType,
    eventData?: { message?: string; eventType?: keyof typeof MessageEventType },
  ) => void,
  trackEvent: (event: string, data: Record<string, unknown>) => void,
  isDynamicConfigLoading: boolean = false,
  isDynamicConfigStarted: boolean = false,
) => {
  // Module state
  const [isModulesReady, setIsModulesReady] = useState(false);
  const [isAnimatingToCorner, setIsAnimatingToCorner] = useState(false);
  const [isWidthExpanded, setIsWidthExpanded] = useState(false);

  // Layout preference hook
  const { setPreference } = useLayoutPreference();

  // Single phase: Wait for dynamic API to complete before starting animation
  useEffect(() => {
    // Only proceed when:
    // 1. Static API is loaded AND
    // 2. Dynamic config has started AND
    // 3. Dynamic config is not loading (completed)
    if (!isConfigLoading && modules.length > 0 && isDynamicConfigStarted && !isDynamicConfigLoading) {
      // Start the bounce animation immediately
      setIsModulesReady(true);

      // Start width expansion after 1 second delay
      setTimeout(() => {
        setIsWidthExpanded(true);
      }, 1000);
    }
  }, [isConfigLoading, modules.length, isDynamicConfigLoading, isDynamicConfigStarted]);

  // Filter available modules based on device type
  const availableModules = useMemo(() => {
    // Show all modules when ready (single phase)
    return modules.filter((module) => (isMobile ? module.module_type === ASK_AI : true));
  }, [modules, isMobile]);

  // Separate Ask AI from other modules
  const { askAiModule, otherModules } = useMemo(
    () => ({
      askAiModule: availableModules.find((module) => module.module_type === ASK_AI),
      otherModules: availableModules.filter((module) => module.module_type !== ASK_AI),
    }),
    [availableModules],
  );

  // Animation control
  const startExitAnimationCallback = useCallback(() => {
    setIsAnimatingToCorner(true);
  }, []);

  // Event handlers
  const handleModuleClick = useCallback(
    (featureConfig: CommandBarModuleConfigType) => {
      if (!featureConfig) return;

      const { module_type } = featureConfig;

      // If already active, just deactivate
      if (activeFeature === module_type) {
        setActiveFeature(null);
        trackEvent('COMMAND_BAR_ACTION_CLICK', {
          action_type: module_type,
        });
        return;
      }

      // Start exit animation
      startExitAnimationCallback();

      // Store user preference for bottom_right layout (1 hour expiration)
      setPreference(LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT);

      // Wait for animation to complete, then switch to default bar
      setTimeout(() => {
        requestAnimationFrame(() => {
          onSwitchToDefault(module_type);
        });
      }, ANIMATION_TIMINGS.DELAYS.BOTTOM_BAR_EXIT_ANIMATION * 1000);

      trackEvent('COMMAND_BAR_ACTION_CLICK', {
        action_type: module_type,
      });
    },
    [activeFeature, setActiveFeature, startExitAnimationCallback, onSwitchToDefault, trackEvent],
  );

  const handleInputSubmit = useCallback(
    (inputValue: string, questionText: string) => {
      if (!inputValue.trim() && !questionText.trim()) return;

      // Start exit animation
      startExitAnimationCallback();

      // Store user preference for bottom_right layout (1 hour expiration)
      setPreference(LAYOUT_PREFERENCE_CONFIG.DEFAULT_LAYOUT);

      // Wait for animation to complete, then switch to default bar
      setTimeout(() => {
        requestAnimationFrame(() => {
          const message = inputValue.trim() || questionText;
          onSwitchToDefault(ASK_AI, {
            message,
            eventType: 'TEXT_REQUEST',
          });
        });
      }, ANIMATION_TIMINGS.DELAYS.BOTTOM_BAR_EXIT_ANIMATION * 1000);
    },
    [startExitAnimationCallback, onSwitchToDefault],
  );

  return {
    // Module state
    isModulesReady,
    isWidthExpanded,
    askAiModule,
    otherModules,

    // Animation state
    isAnimatingToCorner,
    startExitAnimation: startExitAnimationCallback,

    // Event handlers
    handleModuleClick,
    handleInputSubmit,
  };
};
