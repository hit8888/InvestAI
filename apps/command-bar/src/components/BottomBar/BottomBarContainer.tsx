import React from 'react';
import { motion } from 'framer-motion';
import { CommandBarModuleType } from '@meaku/core/types/api/configuration_response';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import { useCommandBarStore } from '@meaku/shared/stores/useCommandBarStore';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { MessageEventType } from '@meaku/shared/types/message';
import { cn } from '@meaku/saral';

// Custom hooks
import { useBottomBarAnimation } from './hooks/useBottomBarAnimation';
import { useBottomBarState } from './hooks/useBottomBarState';

// Components
import BottomBarContent from './BottomBarContent';

// Constants
import { BOTTOM_BAR_ANIMATIONS } from './constants';

interface BottomBarContainerProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (buttonType: CommandBarModuleType | null) => void;
  actionButtonSize?: number;
  isDynamicConfigLoading?: boolean;
  onSwitchToDefault?: (
    moduleType: CommandBarModuleType,
    eventData?: { message?: string; eventType?: keyof typeof MessageEventType },
  ) => void;
}

const BottomBarContainer: React.FC<BottomBarContainerProps> = ({
  activeFeature,
  setActiveFeature,
  actionButtonSize = 56,
  isDynamicConfigLoading = false,
  onSwitchToDefault,
}) => {
  const { config, isConfigLoading } = useCommandBarStore();
  const primaryPlaceholder = config.body?.bottom_bar_config?.primary_placeholder;
  const suggestedQuestions = config.body?.welcome_message?.suggested_questions ?? [];

  const { trackEvent } = useCommandBarAnalytics();
  const isMobile = useIsMobile();
  const { modules = [] } = config.command_bar ?? {};

  // Consolidated state management
  const { isModulesReady, askAiModule, otherModules, isAnimatingToCorner, handleModuleClick, handleInputSubmit } =
    useBottomBarState(
      modules,
      isConfigLoading,
      isMobile,
      activeFeature,
      setActiveFeature,
      onSwitchToDefault || (() => {}),
      trackEvent,
    );

  const { containerAnimation, containerTransition } = useBottomBarAnimation(
    isModulesReady,
    isMobile,
    isAnimatingToCorner,
  );

  return (
    <motion.div
      {...containerAnimation}
      layout={false}
      transition={containerTransition}
      className={cn(
        'fixed bottom-4 right-1/2 z-command-bar transform',
        'bg-white/95 shadow-lg backdrop-blur-sm',
        'flex items-center overflow-hidden',
      )}
      style={{
        padding: isAnimatingToCorner ? '0px' : isModulesReady ? `${BOTTOM_BAR_ANIMATIONS.LAYOUT.BAR_PADDING}px` : 0,
        minWidth: isAnimatingToCorner ? '0px' : '66px',
      }}
    >
      <motion.div
        className={`absolute left-0 top-0 -z-10 h-full w-full rounded-[40px] transition-all ${
          isModulesReady
            ? 'bg-gradient-to-b from-primary via-transparent to-transparent'
            : 'bg-gradient-to-b from-gray-100 via-transparent to-transparent'
        }`}
        animate={{
          rotate: !isModulesReady ? 360 : 0,
        }}
        transition={
          !isModulesReady
            ? {
                duration: 0.6,
                repeat: Infinity,
                ease: 'linear',
              }
            : {
                duration: 0,
              }
        }
      />

      <BottomBarContent
        activeFeature={activeFeature}
        actionButtonSize={actionButtonSize}
        isDynamicConfigLoading={isDynamicConfigLoading}
        isAnimatingToCorner={isAnimatingToCorner}
        isModulesReady={isModulesReady}
        askAiModule={askAiModule || null}
        otherModules={otherModules}
        suggestedQuestions={suggestedQuestions}
        onModuleClick={handleModuleClick}
        onInputSubmit={handleInputSubmit}
        primaryPlaceholder={primaryPlaceholder ?? 'See why top companies choose us? 🏅'}
      />
    </motion.div>
  );
};

export default BottomBarContainer;
