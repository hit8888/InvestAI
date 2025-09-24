import React, { useMemo } from 'react';
import { BaseActionComponent } from '@meaku/shared/features';
import { CommandBarModuleConfigType } from '@meaku/core/types/api/configuration_response';
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
      return `all ${ANIMATION_TIMINGS.DURATION.SLOWEST}s cubic-bezier(0.4, 0, 0.2, 1)`;
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
