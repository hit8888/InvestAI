import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AskAiAction,
  BookMeetingAction,
  SummarizeAction,
  IframeAction,
  VideoLibraryAction,
} from '@meaku/shared/features';
import {
  CommandBarModuleConfigType,
  CommandBarModuleType,
  CommandBarModuleTypeSchema,
} from '@meaku/core/types/api/configuration_response';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { useCommandBarStore } from '@meaku/shared/stores/useCommandBarStore';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';
import { ACTION_ANIMATION_CONSTANTS, ANIMATION_STYLES, TRANSITION_PRESETS } from '../constants/actionAnimations';
import { ActionShimmerEffect } from './ActionShimmerEffect';
import { getVisualIndex, getAnimationDelay, getTooltipDelay } from '../utils/actionUtils';

// Layout constants for better maintainability
const ACTION_BUTTON_SIZE = 56; // 14 * 4 = 56px (h-14 w-14 in Tailwind)
const ACTION_BUTTON_GAP = ACTION_ANIMATION_CONSTANTS.ACTION_GAP;
const ACTION_BUTTON_HEIGHT = ACTION_ANIMATION_CONSTANTS.ACTION_HEIGHT;

interface CommandBarActionsProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (buttonType: CommandBarModuleType | null) => void;
}

const { ASK_AI, BOOK_MEETING, SUMMARIZE, IFRAME, VIDEO_LIBRARY } = CommandBarModuleTypeSchema.enum;

// Action component mapping for cleaner code
const ACTION_COMPONENTS = {
  [ASK_AI]: AskAiAction,
  [BOOK_MEETING]: BookMeetingAction,
  [SUMMARIZE]: SummarizeAction,
  [IFRAME]: IframeAction,
  [VIDEO_LIBRARY]: VideoLibraryAction,
} as const;

const CommandBarActions: React.FC<CommandBarActionsProps> = ({ activeFeature, setActiveFeature }) => {
  const { config } = useCommandBarStore();
  const { trackEvent } = useCommandBarAnalytics();
  const isMobile = useIsMobile();
  const { modules = [] } = config.command_bar ?? {};

  // Performance optimization: Warm up the GPU for animations
  useEffect(() => {
    if (modules.length > 0) {
      requestAnimationFrame(() => {
        // This empty RAF call ensures the next frame is ready for smooth animations
      });
    }
  }, [modules.length]);

  // Ensure Ask AI button is always bottom most
  const orderedActions = [...modules]
    .sort((a, b) => {
      if (a.module_type === ASK_AI && b.module_type !== ASK_AI) return 1;
      if (a.module_type !== ASK_AI && b.module_type === ASK_AI) return -1;
      return 0;
    })
    .filter((module) => (isMobile ? module.module_type === ASK_AI : true));

  const handleClick = (featureConfig: CommandBarModuleConfigType | undefined) => {
    if (!featureConfig) return;

    const { module_type } = featureConfig;
    setActiveFeature(activeFeature === module_type ? null : module_type);
    trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.ACTION_CLICK, {
      action_type: module_type,
    });
  };

  const renderActionComponent = (featureConfig: CommandBarModuleConfigType, tooltipDelay: number) => {
    const isActive = activeFeature === featureConfig.module_type;

    const ActionComponent = ACTION_COMPONENTS[featureConfig.module_type as keyof typeof ACTION_COMPONENTS];
    if (!ActionComponent) return null;

    // Skip initial tooltip for single module
    const shouldShowInitialTooltip = modules.length > 1;
    const initialTooltipConfig = shouldShowInitialTooltip
      ? {
          delay: tooltipDelay,
          duration: ACTION_ANIMATION_CONSTANTS.TOOLTIP_DURATION,
        }
      : undefined;

    return (
      <ActionComponent
        key={featureConfig.id}
        isActive={isActive}
        onClick={handleClick}
        initialTooltip={initialTooltipConfig}
      />
    );
  };

  // Calculate all animation timing data upfront using regular functions
  const actionTimingData = orderedActions.map((featureConfig, index) => {
    const visualIndex = getVisualIndex(index, featureConfig.module_type, orderedActions.length);
    const animationDelay = getAnimationDelay(
      visualIndex,
      ACTION_ANIMATION_CONSTANTS.BASE_ANIMATION_DELAY,
      ACTION_ANIMATION_CONSTANTS.STAGGER_INTERVAL,
    );
    const tooltipDelay = getTooltipDelay(
      visualIndex,
      ACTION_ANIMATION_CONSTANTS.BASE_TOOLTIP_DELAY,
      ACTION_ANIMATION_CONSTANTS.STAGGER_INTERVAL,
    );

    return {
      featureConfig,
      index,
      visualIndex,
      animationDelay,
      tooltipDelay,
    };
  });

  // Calculate final positions for each action
  const getActionPosition = (index: number, featureConfig: CommandBarModuleConfigType) => {
    const isAskAI = featureConfig.module_type === ASK_AI;

    if (isAskAI) {
      return { bottom: 0, right: 0 };
    } else {
      const positionFromBottom = (orderedActions.length - 1 - index) * (ACTION_BUTTON_HEIGHT + ACTION_BUTTON_GAP);
      return { bottom: positionFromBottom, right: 0 };
    }
  };

  return (
    <motion.div
      className="relative"
      style={ANIMATION_STYLES.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={TRANSITION_PRESETS.container}
    >
      {/* Invisible placeholder elements that reserve space in flex layout */}
      <div className="flex flex-col-reverse" style={{ gap: `${ACTION_BUTTON_GAP}px` }}>
        {orderedActions.map((featureConfig) => (
          <div
            key={`placeholder-${featureConfig.id}`}
            className="invisible"
            style={{ height: `${ACTION_BUTTON_SIZE}px`, width: `${ACTION_BUTTON_SIZE}px` }}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Absolutely positioned visible action buttons */}
      <div className="absolute inset-0">
        {actionTimingData.map(({ featureConfig, index, visualIndex, animationDelay, tooltipDelay }) => {
          const isAskAI = featureConfig.module_type === ASK_AI;
          const finalPosition = getActionPosition(index, featureConfig);

          return (
            <motion.div
              key={featureConfig.id}
              className="absolute"
              style={{
                height: `${ACTION_BUTTON_SIZE}px`,
                width: `${ACTION_BUTTON_SIZE}px`,
                zIndex: index + 1,
                ...ANIMATION_STYLES.actionButton,
              }}
              initial={{
                bottom: 0,
                right: 0,
                opacity: 0,
              }}
              animate={{
                ...finalPosition,
                opacity: 1,
              }}
              transition={{
                opacity: TRANSITION_PRESETS.opacity,
                bottom: {
                  ...TRANSITION_PRESETS.movement,
                  delay: animationDelay,
                },
                right: {
                  ...TRANSITION_PRESETS.movement,
                  delay: animationDelay,
                },
              }}
            >
              {renderActionComponent(featureConfig, tooltipDelay)}

              {!isAskAI && <ActionShimmerEffect visualIndex={visualIndex} />}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CommandBarActions;
