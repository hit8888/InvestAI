import React, { useMemo, useCallback } from 'react';
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

const BaseActionComponent: React.FC<BaseActionComponentProps> = React.memo(
  ({ isActive = false, onClick, initialTooltip, config: actionConfig }) => {
    const featureConfig: CommandBarModuleConfigType | undefined = useFeatureConfig(
      CommandBarModuleTypeSchema.enum[actionConfig.moduleType],
    );
    const { config } = useCommandBarStore();

    // Get custom icon URL
    const customIconUrl = featureConfig?.icon_asset?.public_url ?? undefined;

    // Resolve tooltip content
    const tooltipContent = useMemo((): string => {
      if (!actionConfig.tooltip) return '';

      if (typeof actionConfig.tooltip.content === 'function') {
        return featureConfig ? actionConfig.tooltip.content(featureConfig) : '';
      }
      return actionConfig.tooltip.content;
    }, [actionConfig.tooltip, featureConfig]);

    // Resolve button className
    const buttonClassName = useMemo((): string => {
      const baseClassName = isActive ? 'rounded-2xl' : 'rounded-full';

      if (actionConfig.button?.className) {
        if (typeof actionConfig.button.className === 'function') {
          return `${baseClassName} ${actionConfig.button.className(isActive)}`;
        }
        return `${baseClassName} ${actionConfig.button.className}`;
      }

      return baseClassName;
    }, [isActive, actionConfig.button?.className]);

    // Resolve button variant
    const buttonVariant = useMemo(() => {
      if (isActive) {
        return actionConfig.button?.variant === 'outline'
          ? 'default_active'
          : actionConfig.button?.variant || 'default_active';
      }

      return actionConfig.button?.variant || 'outline';
    }, [isActive, actionConfig.button?.variant]);

    // Render icon content
    const iconContent = useMemo(() => {
      if (customIconUrl && actionConfig.icon && !isActive) {
        const iconClassName = actionConfig.icon.customIconClassName || 'h-full w-full';
        const iconAlt = actionConfig.icon.customIconAlt || featureConfig?.name || 'Icon';

        return (
          <img
            src={customIconUrl}
            alt={iconAlt}
            className={cn(iconClassName, isActive && 'rounded-2xl')}
            // Add loading optimization
            loading="lazy"
            // Prevent dragging for better UX
            draggable={false}
            // Add key to force re-render only when necessary
            key={`${customIconUrl}-${isActive}`}
          />
        );
      }

      return actionConfig.icon?.fallbackIcon;
    }, [customIconUrl, actionConfig.icon, featureConfig?.name, isActive]);

    const handleClick = useCallback(() => {
      onClick?.(featureConfig);
    }, [onClick, featureConfig]);

    // Create button element with extended hover area
    const button = useMemo(
      () => (
        <div className="p-2 -m-2 group">
          <Button
            data-action-id={`action-${CommandBarModuleTypeSchema.enum[actionConfig.moduleType]}`}
            size={actionConfig.button?.size || 'icon'}
            variant={buttonVariant}
            onClick={handleClick}
            hasWipers={!!customIconUrl && !isActive}
            className={`${buttonClassName} group-hover:bg-backgroundLight group-hover:text-actionBtnIcon`}
          >
            {iconContent}
          </Button>
        </div>
      ),
      [actionConfig.moduleType, actionConfig.button?.size, buttonVariant, handleClick, buttonClassName, iconContent],
    );

    const customRendererContent = useMemo(() => {
      if (!actionConfig.customRenderer || !featureConfig) return null;

      return actionConfig.customRenderer({
        onClick: handleClick,
        featureConfig,
        config,
      }) as React.ReactElement;
    }, [actionConfig.customRenderer, handleClick, featureConfig, config]);

    if (!featureConfig) {
      return null;
    }

    // Check if component should render
    if (actionConfig.shouldRender && !actionConfig.shouldRender(featureConfig)) {
      return null;
    }

    if (customRendererContent) {
      if (isActive) {
        return customRendererContent;
      }
      return (
        <BlackTooltip content={tooltipContent} initialTooltip={initialTooltip} side={actionConfig.tooltip?.side}>
          <div className="p-2 -m-2 group hover:[&>button]:bg-backgroundLight hover:[&>button]:text-actionBtnIcon">
            {customRendererContent}
          </div>
        </BlackTooltip>
      );
    }

    // Return button without tooltip if active or no tooltip config
    if (isActive || !actionConfig.tooltip) {
      return button;
    }

    // Wrap with tooltip
    return (
      <BlackTooltip content={tooltipContent} initialTooltip={initialTooltip} side={actionConfig.tooltip.side}>
        {button}
      </BlackTooltip>
    );
  },
);

// Add display name for debugging
BaseActionComponent.displayName = 'BaseActionComponent';

export default BaseActionComponent;
