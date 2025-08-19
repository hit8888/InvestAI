import { CommandBarModuleConfigType, CommandBarModuleType } from '@meaku/core/types/api/configuration_response';

// Action components
export { default as AskAiAction } from './ask-ai/AskAiAction';
export { default as BookMeetingAction } from './book-meeting/BookMeetingAction';
export { default as SummarizeAction } from './summarize/SummarizeAction';
export { default as IframeAction } from './iframe/IframeAction';

// Content components
export { default as AskAiContent } from './ask-ai/AskAiContent';
export { default as BookMeetingContent } from './book-meeting/BookMeetingContent';
export { default as SummarizeContent } from './summarize/SummarizeContent';
export { default as IframeContent } from './iframe/IframeContent';

// Nudge component
export { default as Nudge } from './nudge/Nudge';

// Types
export interface FeatureContentProps {
  onClose?: () => void;
  onExpand?: () => void;
  isExpanded?: boolean;
  setActiveFeature?: (feature: CommandBarModuleType) => void;
}

export interface FeatureActionProps {
  isActive?: boolean;
  onClick?: (featureConfig: CommandBarModuleConfigType | undefined) => void;
}
