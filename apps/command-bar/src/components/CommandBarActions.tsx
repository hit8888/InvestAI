import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BaseActionComponent } from '@neuraltrade/shared/features';
import { clearAllInitialTooltips } from '@neuraltrade/shared/components/BlackTooltip';
import {
  CommandBarModuleConfigType,
  CommandBarModuleType,
  CommandBarModuleTypeSchema,
} from '@neuraltrade/core/types/api/configuration_response';
import { useCommandBarAnalytics } from '@neuraltrade/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@neuraltrade/core/constants/analytics';
import { useCommandBarStore } from '@neuraltrade/shared/stores/useCommandBarStore';
import { useIsMobile } from '@neuraltrade/core/contexts/DeviceManagerProvider';
import { ACTION_ANIMATION_CONSTANTS, ANIMATION_STYLES, TRANSITION_PRESETS } from '../constants/actionAnimations';
import { getVisualIndex, getAnimationDelay, getTooltipDelay } from '../utils/actionUtils';
import { ActionShimmerEffect } from './ActionShimmerEffect';
import { ACTION_CONFIGS } from '../utils/commandBarActionConfigs';

// Layout constants for better maintainability
const ACTION_BUTTON_SIZE = 56; // 14 * 4 = 56px (h-14 w-14 in Tailwind)
const ACTION_BUTTON_GAP = ACTION_ANIMATION_CONSTANTS.ACTION_GAP;
const ACTION_BUTTON_HEIGHT = ACTION_ANIMATION_CONSTANTS.ACTION_HEIGHT;

interface CommandBarActionsProps {
  activeFeature: CommandBarModuleType | null;
  setActiveFeature: (buttonType: CommandBarModuleType | null) => void;
  shouldStartAnimations?: boolean;
  skipInitialTooltips?: boolean;
  isFirstTimeVisitor?: boolean;
}

const { ASK_AI } = CommandBarModuleTypeSchema.enum;

const CommandBarActions: React.FC<CommandBarActionsProps> = ({
  activeFeature,
  setActiveFeature,
  shouldStartAnimations = false,
  skipInitialTooltips = false,
  isFirstTimeVisitor = false,
}) => {
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

  // Clear initial tooltips immediately when any module is opened
  useEffect(() => {
    if (activeFeature) {
      clearAllInitialTooltips();
    }
  }, [activeFeature]);

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

    const actionConfig = ACTION_CONFIGS[featureConfig.module_type as keyof typeof ACTION_CONFIGS];
    if (!actionConfig) return null;

    // Skip initial tooltip for single module, when switching from bottom bar, or for returning visitors
    const shouldShowInitialTooltip = modules.length > 1 && !skipInitialTooltips && isFirstTimeVisitor;
    const initialTooltipConfig =
      shouldShowInitialTooltip && shouldStartAnimations
        ? {
            delay: tooltipDelay,
            duration: ACTION_ANIMATION_CONSTANTS.TOOLTIP_DURATION,
          }
        : undefined;

    return (
      <BaseActionComponent
        key={featureConfig.id}
        isActive={isActive}
        onClick={handleClick}
        initialTooltip={initialTooltipConfig}
        config={actionConfig}
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
                ...(shouldStartAnimations ? finalPosition : { bottom: 0, right: 0 }),
                opacity: 1,
              }}
              transition={{
                opacity: {
                  duration: 0.3,
                  ease: 'easeOut',
                },
                bottom: {
                  duration: TRANSITION_PRESETS.movement.duration,
                  delay: shouldStartAnimations ? animationDelay : 0,
                  ease: 'easeOut',
                },
                right: {
                  duration: TRANSITION_PRESETS.movement.duration,
                  delay: shouldStartAnimations ? animationDelay : 0,
                  ease: 'easeOut',
                },
              }}
            >
              {renderActionComponent(featureConfig, tooltipDelay)}
              {shouldStartAnimations && <ActionShimmerEffect visualIndex={visualIndex} />}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CommandBarActions;
