import type { Message } from '../types/message';
import type { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import type { CommandBarSettings } from '@meaku/core/types/common';

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

export interface FeatureContentProps {
  onClose: () => void;
  onExpand: () => void;
  isExpanded: boolean;
  askaiConfig?: {
    agent_name: string;
    welcome_message: {
      message: string;
      suggested_questions: string[];
      bounce_message: boolean;
      default_artifact_url: string | null;
    };
    ctas: {
      text: string;
      message: string;
      url: string;
    }[];
    welcomeQuestions: string[];
  };
  messages?: Message[];
  isInitialising?: boolean;
  isLoading?: boolean;
  sendUserMessage?: (message: string, overrides?: Partial<Message>) => void;
  config: ConfigurationApiResponse;
  settings: CommandBarSettings;
}
