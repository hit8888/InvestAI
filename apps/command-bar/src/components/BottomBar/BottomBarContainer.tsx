import React from 'react';
import { motion } from 'framer-motion';
import { CommandBarModuleType } from '@neuraltrade/core/types/api/configuration_response';
import { useCommandBarAnalytics } from '@neuraltrade/core/contexts/CommandBarAnalyticsProvider';
import { useCommandBarStore } from '@neuraltrade/shared/stores/useCommandBarStore';
import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';
import { MessageEventType } from '@neuraltrade/shared/types/message';
import { cn } from '@neuraltrade/saral';

// Custom hooks
import { useBottomBarAnimation } from './hooks/useBottomBarAnimation';
import { useBottomBarState } from './hooks/useBottomBarState';

// Components
import BottomBarContent from './BottomBarContent';

// Constants
import { BUTTON_SIZING } from './constants';

interface BottomBarContainerProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (buttonType: CommandBarModuleType | null) => void;
  actionButtonSize?: number;
  isDynamicConfigLoading?: boolean;
  isDynamicConfigStarted?: boolean;
  onSwitchToDefault?: (
    moduleType: CommandBarModuleType,
    eventData?: { message?: string; eventType?: keyof typeof MessageEventType },
  ) => void;
}

const BottomBarContainer: React.FC<BottomBarContainerProps> = ({
  activeFeature,
  setActiveFeature,
  actionButtonSize = BUTTON_SIZING.BUTTON_SIZE,
  isDynamicConfigLoading = false,
  isDynamicConfigStarted = false,
  onSwitchToDefault,
}) => {
  const { config, isConfigLoading } = useCommandBarStore();
  const suggestedQuestions = config.body?.welcome_message?.suggested_questions ?? [];
  const primaryPlaceholder = config.body?.bottom_bar_config?.primary_placeholder ?? '';
  const welcomeMessages = Array.isArray(primaryPlaceholder) ? primaryPlaceholder : [primaryPlaceholder].filter(Boolean);

  const { trackEvent } = useCommandBarAnalytics();
  const isMobile = useIsMobile();
  const { modules = [] } = config.command_bar ?? {};

  // Consolidated state management - Two-phase system
  const {
    isInputReady, // Phase 1
    isModulesReady, // Phase 2
    askAiModule,
    otherModules,
    isAnimatingToCorner,
    handleModuleClick,
    handleInputSubmit,
  } = useBottomBarState(
    modules,
    isConfigLoading,
    isMobile,
    activeFeature,
    setActiveFeature,
    onSwitchToDefault || (() => {}),
    trackEvent,
    isDynamicConfigLoading,
    isDynamicConfigStarted,
  );

  const { containerAnimation, containerTransition } = useBottomBarAnimation(
    isInputReady,
    isMobile,
    isAnimatingToCorner,
  );

  return (
    <motion.div
      {...containerAnimation}
      layout={false}
      transition={containerTransition}
      className={cn(
        'command-bar-positioned fixed bottom-root-bottom-offset right-1/2 z-root transform',
        'flex items-center gap-3',
      )}
    >
      <BottomBarContent
        activeFeature={activeFeature}
        actionButtonSize={actionButtonSize}
        isDynamicConfigLoading={isDynamicConfigLoading}
        isAnimatingToCorner={isAnimatingToCorner}
        isInputReady={isInputReady}
        isModulesReady={isModulesReady}
        askAiModule={askAiModule || null}
        otherModules={otherModules}
        suggestedQuestions={suggestedQuestions}
        welcomeMessages={welcomeMessages}
        onModuleClick={handleModuleClick}
        onInputSubmit={handleInputSubmit}
      />
    </motion.div>
  );
};

export default BottomBarContainer;
