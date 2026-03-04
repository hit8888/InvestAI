import { useState, useEffect, useMemo, useCallback } from 'react';
import { CommandBarModuleConfigType, CommandBarModuleType } from '@neuraltrade/core/types/api/configuration_response';
import { CommandBarModuleTypeSchema } from '@neuraltrade/core/types/api/configuration_response';
import { MessageEventType } from '@neuraltrade/shared/types/message';
import { ANIMATION_TIMINGS } from '../../../constants/animationTimings';
import { useLayoutPreference } from '../../../hooks/useLayoutPreference';
import { useTriggerExitAndSwitch } from './useTriggerExitAndSwitch';

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
  // Module state - New two-phase system
  const [isInputReady, setIsInputReady] = useState(false); // Phase 1: Input appears
  const [isModulesReady, setIsModulesReady] = useState(false); // Phase 2: Modules pop out
  const [isAnimatingToCorner, setIsAnimatingToCorner] = useState(false);

  // Layout preference hook
  const { setPreference } = useLayoutPreference();

  // Animation control
  const startExitAnimationCallback = useCallback(() => {
    setIsAnimatingToCorner(true);
  }, []);

  // Create the centralized trigger function
  const triggerExitAndSwitch = useTriggerExitAndSwitch(startExitAnimationCallback, onSwitchToDefault, setPreference);

  // Phase 1: Static API ready - Show input only
  useEffect(() => {
    // When static API loads, show input immediately
    if (!isConfigLoading && modules.length > 0) {
      setIsInputReady(true);
    }
  }, [isConfigLoading, modules.length]);

  // Phase 2: Dynamic API ready - Pop out modules with jelly effect
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // When dynamic config completes, trigger module pop-out animations
    if (isInputReady && isDynamicConfigStarted && !isDynamicConfigLoading) {
      // Small delay before modules start popping out (allows input to settle)
      timeoutId = setTimeout(() => {
        setIsModulesReady(true);
      }, ANIMATION_TIMINGS.DELAYS.MODULE_POP_DELAY);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isInputReady, isDynamicConfigLoading, isDynamicConfigStarted]);

  // Trigger exit animation when activeFeature becomes non-null (external actions like nudges)
  useEffect(() => {
    if (activeFeature !== null) {
      // Use centralized trigger function
      triggerExitAndSwitch(activeFeature);
    }
  }, [activeFeature, triggerExitAndSwitch]);

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

      // Use centralized trigger function
      triggerExitAndSwitch(module_type);

      trackEvent('COMMAND_BAR_ACTION_CLICK', {
        action_type: module_type,
      });
    },
    [activeFeature, setActiveFeature, triggerExitAndSwitch, trackEvent],
  );

  const handleInputSubmit = useCallback(
    (inputValue: string, questionText: string) => {
      if (!inputValue.trim() && !questionText.trim()) return;

      // Construct event data
      const message = inputValue.trim() || questionText;
      const eventData = {
        message,
        eventType: 'TEXT_REQUEST' as const,
      };

      // Use centralized trigger function
      triggerExitAndSwitch(ASK_AI, eventData);
    },
    [triggerExitAndSwitch],
  );

  return {
    // Module state - Two-phase system
    isInputReady, // Phase 1: Input visible
    isModulesReady, // Phase 2: Modules pop out
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
