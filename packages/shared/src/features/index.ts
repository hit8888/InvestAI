import { CommandBarModuleConfigType, CommandBarModuleType } from '@meaku/core/types/api/configuration_response';

// Base Action component
export { default as BaseActionComponent } from './base/BaseActionComponent';
export type { ActionConfig, BaseIconConfig, BaseTooltipConfig, BaseButtonConfig } from './base/BaseActionComponent';

// Content components
export { default as AskAiContent } from './ask-ai/AskAiContent';
export { default as BookMeetingContent } from './book-meeting/BookMeetingContent';
export { default as SummarizeContent } from './summarize/SummarizeContent';
export { default as IframeContent } from './iframe/IframeContent';
export { default as VideoLibraryContent } from './video-library/VideoLibraryContent';
export { default as DemoLibraryContent } from './demo-library/DemoLibraryContent';

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
