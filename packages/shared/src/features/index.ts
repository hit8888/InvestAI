import { CommandBarModuleConfigType, CommandBarModuleType } from '@neuraltrade/core/types/api/configuration_response';

// Base Action component
export { default as BaseActionComponent } from './base/BaseActionComponent';
export type { ActionConfig, BaseIconConfig, BaseTooltipConfig, BaseButtonConfig } from './base/BaseActionComponent';

// Nudge component
export { default as Nudge } from './nudge/Nudge';

// Types
export interface FeatureContentProps {
  onClose?: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  setActiveFeature?: (feature: CommandBarModuleType | null) => void;
}

// Types
export type InitialTooltipConfig = {
  delay: number;
  duration: number;
};

export interface FeatureActionProps {
  isActive?: boolean;
  onClick?: (featureConfig: CommandBarModuleConfigType | undefined) => void;
  initialTooltip?: InitialTooltipConfig; // Configuration for initial tooltip sequence
}
