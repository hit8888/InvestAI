import React from 'react';
import { Button, cn } from '@meaku/saral';
import BlackTooltip from '../../components/BlackTooltip';
import {
  CommandBarModuleTypeSchema,
  CommandBarModuleConfigType,
  ConfigurationApiResponse,
} from '@meaku/core/types/api/configuration_response';
import { FeatureActionProps } from '../';
import useFeatureConfig from '../../hooks/useFeatureConfig';
import { useCommandBarStore } from '../../stores/useCommandBarStore';

// Configuration types for different rendering strategies
export interface BaseIconConfig {
  fallbackIcon: React.ReactNode;
  customIconClassName?: string;
  customIconAlt?: string;
}

export interface BaseTooltipConfig {
  content: string | ((featureConfig: CommandBarModuleConfigType) => string);
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export interface BaseButtonConfig {
  size?: 'icon' | 'sm' | 'lg' | 'default';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'default_active';
  className?: string | ((isActive: boolean) => string);
}

export interface ActionConfig {
  moduleType: keyof typeof CommandBarModuleTypeSchema.enum;
  icon?: BaseIconConfig;
  tooltip?: BaseTooltipConfig;
  button?: BaseButtonConfig;
  shouldRender?: (featureConfig: CommandBarModuleConfigType) => boolean;
  customRenderer?: (props: {
    isActive?: boolean;
    onClick: () => void;
    featureConfig: CommandBarModuleConfigType;
    config: ConfigurationApiResponse;
    children?: React.ReactNode;
  }) => React.ReactNode;
}

interface BaseActionComponentProps extends FeatureActionProps {
  config: ActionConfig;
}

const BaseActionComponent: React.FC<BaseActionComponentProps> = ({
  isActive = false,
  onClick,
  initialTooltip,
  config: actionConfig,
}) => {
  const featureConfig: CommandBarModuleConfigType | undefined = useFeatureConfig(
    CommandBarModuleTypeSchema.enum[actionConfig.moduleType],
  );
  const { config } = useCommandBarStore();

  if (!featureConfig) {
    return null;
  }

  // Check if component should render
  if (actionConfig.shouldRender && !actionConfig.shouldRender(featureConfig)) {
    return null;
  }

  // Get custom icon URL
  const customIconUrl = featureConfig?.icon_asset?.public_url ?? undefined;

  // Resolve tooltip content
  const getTooltipContent = (): string => {
    if (!actionConfig.tooltip) return '';

    if (typeof actionConfig.tooltip.content === 'function') {
      return actionConfig.tooltip.content(featureConfig);
    }
    return actionConfig.tooltip.content;
  };

  // Resolve button className
  const getButtonClassName = (): string => {
    const baseClassName = isActive ? 'rounded-2xl' : 'rounded-full';

    if (actionConfig.button?.className) {
      if (typeof actionConfig.button.className === 'function') {
        return `${baseClassName} ${actionConfig.button.className(isActive)}`;
      }
      return `${baseClassName} ${actionConfig.button.className}`;
    }

    return baseClassName;
  };

  // Render icon content
  const renderIconContent = () => {
    if (customIconUrl && actionConfig.icon) {
      const iconClassName = actionConfig.icon.customIconClassName || 'h-full w-full';
      const iconAlt = actionConfig.icon.customIconAlt || featureConfig?.name || 'Icon';

      return <img src={customIconUrl} alt={iconAlt} className={cn(iconClassName, isActive && 'rounded-2xl')} />;
    }

    return actionConfig.icon?.fallbackIcon;
  };

  // Create button element
  const button = (
    <Button
      data-action-id={`action-${CommandBarModuleTypeSchema.enum[actionConfig.moduleType]}`}
      size={actionConfig.button?.size || 'icon'}
      variant={
        isActive
          ? actionConfig.button?.variant === 'outline'
            ? 'default_active'
            : actionConfig.button?.variant || 'default_active'
          : actionConfig.button?.variant || 'outline'
      }
      onClick={() => onClick?.(featureConfig)}
      className={getButtonClassName()}
    >
      {renderIconContent()}
    </Button>
  );

  // Use custom renderer if provided
  if (actionConfig.customRenderer) {
    const customContent = actionConfig.customRenderer({
      onClick: () => onClick?.(featureConfig),
      featureConfig,
      config,
    }) as React.ReactElement;

    if (isActive) {
      return customContent;
    }
    return (
      <BlackTooltip content={getTooltipContent()} initialTooltip={initialTooltip} side={actionConfig.tooltip?.side}>
        {customContent}
      </BlackTooltip>
    );
  }

  // Return button without tooltip if active or no tooltip config
  if (isActive || !actionConfig.tooltip) {
    return button;
  }

  // Wrap with tooltip
  return (
    <BlackTooltip content={getTooltipContent()} initialTooltip={initialTooltip} side={actionConfig.tooltip.side}>
      {button}
    </BlackTooltip>
  );
};

export default BaseActionComponent;
