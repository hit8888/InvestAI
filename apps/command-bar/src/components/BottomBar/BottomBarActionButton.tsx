import React, { useMemo } from 'react';
import { BaseActionComponent } from '@neuraltrade/shared/features';
import { CommandBarModuleConfigType } from '@neuraltrade/core/types/api/configuration_response';
import { ACTION_CONFIGS } from '../../utils/commandBarActionConfigs';
import { ANIMATION_TIMINGS } from '../../constants/animationTimings';

interface BottomBarActionButtonProps {
  featureConfig: CommandBarModuleConfigType;
  isActive: boolean;
  buttonSize: number;
  isAnimating: boolean;
  onClick: (config: CommandBarModuleConfigType) => void;
}

/**
 * Action button component for BottomCenterBar
 * Handles individual module action buttons with animations
 */
export const BottomBarActionButton: React.FC<BottomBarActionButtonProps> = ({
  featureConfig,
  isActive,
  buttonSize,
  isAnimating,
  onClick,
}) => {
  const actionConfig = ACTION_CONFIGS[featureConfig.module_type as keyof typeof ACTION_CONFIGS];

  // Override tooltip side to show on top for bottom center bar
  const customConfig = useMemo(
    () => ({
      ...actionConfig,
      tooltip: actionConfig.tooltip
        ? {
            ...actionConfig.tooltip,
            side: 'top' as const,
          }
        : undefined,
    }),
    [actionConfig],
  );

  const transitionDuration = useMemo(() => {
    if (isAnimating) {
      // Fast size transition for instant switch, slow opacity/scale for smooth exit
      return `width ${ANIMATION_TIMINGS.DURATIONS.ACTION_SIZE_FAST}s ease-out, height ${ANIMATION_TIMINGS.DURATIONS.ACTION_SIZE_FAST}s ease-out, opacity ${ANIMATION_TIMINGS.DURATIONS.ACTION_OPACITY_SLOW}s ${ANIMATION_TIMINGS.EASING.CUBIC_BEZIER_EXIT}, transform ${ANIMATION_TIMINGS.DURATIONS.ACTION_OPACITY_SLOW}s ${ANIMATION_TIMINGS.EASING.CUBIC_BEZIER_EXIT}`;
    }
    return `all ${ANIMATION_TIMINGS.DURATION.NORMAL}s ease-out`;
  }, [isAnimating]);

  if (!actionConfig) return null;

  return (
    <BaseActionComponent
      key={featureConfig.id}
      isActive={isActive}
      onClick={() => onClick(featureConfig)}
      config={customConfig}
      buttonSize={buttonSize}
      transitionDuration={transitionDuration}
    />
  );
};
