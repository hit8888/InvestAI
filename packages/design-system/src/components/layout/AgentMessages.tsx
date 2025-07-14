import { cn } from '@breakout/design-system/lib/cn';
import React, { useEffect, useRef, useMemo } from 'react';
import SuggestionsArtifact from './ChatMessages/SuggestionsArtifact';
import PreDemoQuestion from './ChatMessages/PreDemoQuestion';
import MessageItem from './ChatMessages/MessageItem';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { DemoPlayingStatus, MessageSenderRole, ViewType } from '@meaku/core/types/common';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import {
  checkIsCurrentMessageComplete,
  messagesGroupedByResponseIdAndTimestamp,
  shouldMessageScrollToTop,
} from '@meaku/core/utils/messageUtils';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface IProps {
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
}

const AgentMessages = ({
  viewType,
  messages,
  sessionId,
  orbState,
  showRightPanel = false,
  isAMessageBeingProcessed,
  hasFirstUserMessageBeenSent,
  setDemoPlayingStatus,
  setIsArtifactPlaying,
  setActiveArtifact,
  handleSendUserMessage,
  initialSuggestedQuestions,
  allowFullWidthForText,
  showDemoPreQuestions,
  primaryColor,
  logoURL,
  allowFeedback,
  feedbackData,
  lastMessageResponseId,
  orbLogoUrl,
  showOrbFromConfig,
  invertTextColor,
}: IProps) => {
  const agentChatContainerRef = useRef<HTMLDivElement>(null);
  const currentMessageScrollToTop = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const handleScrollToBottom = () => {
    if (agentChatContainerRef.current) {
      const container = agentChatContainerRef.current;
      const lastUserMessage = currentMessageScrollToTop.current;

      if (lastUserMessage) {
        // Add a small delay to ensure content is rendered
        requestAnimationFrame(() => {
          // Get the offset of the last user message relative to the container
          const containerTop = container.offsetTop;
          const messageTop = lastUserMessage.offsetTop;
          // Scroll the container
          container.scrollTop = messageTop - containerTop;
        });
      }
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (
      lastMessage?.role === MessageSenderRole.AI &&
      currentMessageScrollToTop.current &&
      (viewType === ViewType.ADMIN || viewType === ViewType.USER)
    ) {
      handleScrollToBottom();
    }
  }, [viewType, messages]);

  const getInitialFeedback = useMemo(() => {
    return (message: WebSocketMessage) =>
      feedbackData?.find((feedback) => feedback.response_id === message.response_id);
  }, [feedbackData]);

  const aiMessages = messages.filter((message) => message.role === 'ai');

  const messagesSortedByResponseIdAndTimestamp = messagesGroupedByResponseIdAndTimestamp(messages);

  const isCurrentMessageComplete = checkIsCurrentMessageComplete(messages, lastMessageResponseId);
  const agentMessagesContainerClassName = useMemo(() => {
    if (isMobile || !showRightPanel) {
      return 'w-full';
    } else if (!isMobile && showRightPanel) {
      return 'w-[35%] shrink-0';
    } else if (!isMobile) {
      return 'shrink-0';
    }
    return '';
  }, [isMobile, showRightPanel]);

  return (
    <div
      className={cn(agentMessagesContainerClassName)}
      onWheel={(e) => e.stopPropagation()}
      style={{
        height: '100%',
        overflow: viewType === ViewType.USER ? 'hidden' : 'auto',
      }}
    >
      <div
        id="agent-messages-container"
        ref={agentChatContainerRef}
        className={cn(['h-full flex-1 space-y-4 overflow-y-auto p-2 pl-4 pr-2', isMobile && 'p-4'])}
      >
        <div
          className={cn([
            'mx-auto flex w-full flex-col gap-8',
            !showRightPanel && !allowFullWidthForText && 'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]',
          ])}
        >
          {messagesSortedByResponseIdAndTimestamp.map((message, idx) => {
            return (
              <React.Fragment key={idx}>
                <MessageItem
                  elementRef={currentMessageScrollToTop}
                  shouldMessageScrollToTop={shouldMessageScrollToTop(message)}
                  isAMessageBeingProcessed={isAMessageBeingProcessed}
                  logoURL={logoURL}
                  viewType={viewType}
                  sessionId={sessionId}
                  primaryColor={primaryColor}
                  message={message}
                  orbState={orbState}
                  setIsArtifactPlaying={setIsArtifactPlaying}
                  setActiveArtifact={setActiveArtifact}
                  setDemoPlayingStatus={setDemoPlayingStatus}
                  handleSendUserMessage={handleSendUserMessage}
                  allowFeedback={allowFeedback}
                  initialFeedback={getInitialFeedback(message)}
                  lastMessageResponseId={lastMessageResponseId}
                  messages={messagesSortedByResponseIdAndTimestamp}
                  orbLogoUrl={orbLogoUrl}
                  showOrbFromConfig={showOrbFromConfig}
                  invertTextColor={invertTextColor}
                />
              </React.Fragment>
            );
          })}
          {aiMessages.length <= 1 && !hasFirstUserMessageBeenSent && (
            <SuggestionsArtifact
              handleSendUserMessage={handleSendUserMessage}
              artifact={{
                suggested_questions: initialSuggestedQuestions,
                suggested_questions_type: 'BUBBLE',
              }}
              invertTextColor={invertTextColor}
            />
          )}
          {isCurrentMessageComplete && showDemoPreQuestions && (
            <PreDemoQuestion
              isAMessageBeingProcessed={isAMessageBeingProcessed}
              setDemoPlayingStatus={setDemoPlayingStatus}
              handleSendUserMessage={handleSendUserMessage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentMessages;
