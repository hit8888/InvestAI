import { ViewType } from '@neuraltrade/core/types/common';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import { OrbStatusEnum } from '@neuraltrade/core/types/config';
import { DemoPlayingStatus } from '@neuraltrade/core/types/common';
import { ArtifactBaseType } from '@neuraltrade/core/types/webSocketData';
import { FeedbackRequestPayload } from '@neuraltrade/core/types/api/feedback_request';

// Types
export interface IProps {
  viewType: ViewType;
  messages: WebSocketMessage[];
  sessionId: string;
  orbState: OrbStatusEnum;
  showRightPanel?: boolean;
  hasFirstUserMessageBeenSent?: boolean;
  isAMessageBeingProcessed: boolean;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setIsArtifactPlaying: (isPlaying: boolean) => void;
  setActiveArtifact: (artifact: ArtifactBaseType | null) => void;
  handleSendUserMessage: (data: Pick<WebSocketMessage, 'message' | 'message_type'>) => void;
  initialSuggestedQuestions: string[];
  allowFullWidthForText: boolean;
  showDemoPreQuestions: boolean;
  primaryColor: string | null;
  logoURL: string | null;
  allowFeedback: boolean;
  feedbackData?: FeedbackRequestPayload[];
  lastMessageResponseId: string;
  orbLogoUrl: string | undefined | null;
  showOrbFromConfig: boolean;
  invertTextColor: boolean;
  enableScrollToBottom?: boolean;
  isTyping?: boolean;
}

export interface MessageGroupProps extends Omit<IProps, 'initialSuggestedQuestions' | 'allowFullWidthForText'> {
  group: WebSocketMessage[];
  groupIndex: number;
  isLastGroupWithContent: boolean;
  containerHeight: number;
  enableScrollToBottom: boolean;
  aiMessages: WebSocketMessage[];
  hasFirstUserMessageBeenSent?: boolean;
  currentMessageScrollToTop: React.RefObject<HTMLDivElement | null>;
  lastGroupRef: React.RefObject<HTMLDivElement | null>;
  groupStartScrollTargetRef: React.RefObject<HTMLDivElement | null>;
  groupEndScrollTargetRef: React.RefObject<HTMLDivElement | null>;
  isCurrentMessageComplete: boolean;
  getInitialFeedback: (message: WebSocketMessage) => FeedbackRequestPayload | undefined;
}

export interface DownArrowButtonProps {
  show: boolean;
  onClick: () => void;
}
