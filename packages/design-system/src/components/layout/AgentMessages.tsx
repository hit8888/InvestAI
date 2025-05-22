import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useRef } from 'react';
import SuggestionsArtifact from './SuggestionsArtifact';
import { PreDemoQuestion } from '../../../../../apps/agent/src/components/views/AgentView/Demo/PreDemoQuestion';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { OrbStatusEnum } from '@meaku/core/types/config';
import MessageItem from './MessageItem';
import { DemoPlayingStatus, MessageSenderRole, ViewType } from '@meaku/core/types/common';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { messagesGroupedByResponseIdAndTimestamp, shouldMessageScrollToTop } from '@meaku/core/utils/messageUtils';

interface IProps {
  viewType: ViewType;
  messages: WebSocketMessage[];
  sessionId: string;
  orbState: OrbStatusEnum;
  showRightPanel?: boolean;
  hasFirstUserMessageBeenSent?: boolean;
  isAMessageBeingProcessed: boolean;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
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
      (viewType === ViewType.USER || viewType === ViewType.ADMIN)
    ) {
      handleScrollToBottom();
    }
  }, [viewType, messages]);

  const aiMessages = messages.filter((message) => message.role === 'ai');

  const messagesSortedByResponseIdAndTimestamp = messagesGroupedByResponseIdAndTimestamp(messages);

  return (
    <div
      className={cn('w-[35%] shrink-0 overflow-y-auto', {
        'w-full': !showRightPanel,
      })}
      onWheel={(e) => e.stopPropagation()}
      style={{
        height: '100%',
        overflow: viewType === ViewType.USER ? 'hidden' : 'auto',
      }}
    >
      <div ref={agentChatContainerRef} className="h-full flex-1 space-y-4 overflow-y-auto p-2 pl-4 pr-2">
        <div
          className={cn('mx-auto w-full', {
            'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]': !showRightPanel && !allowFullWidthForText,
          })}
        >
          {messagesSortedByResponseIdAndTimestamp.map((message, idx) => {
            return (
              <div key={idx}>
                {shouldMessageScrollToTop(message) ? <div ref={currentMessageScrollToTop} className="p-0" /> : null}
                <MessageItem
                  isAMessageBeingProcessed={isAMessageBeingProcessed}
                  logoURL={logoURL}
                  viewType={viewType}
                  sessionId={sessionId}
                  primaryColor={primaryColor}
                  message={message}
                  messageIndex={idx}
                  totalMessages={messagesSortedByResponseIdAndTimestamp.length}
                  orbState={orbState}
                  setActiveArtifact={setActiveArtifact}
                  setDemoPlayingStatus={setDemoPlayingStatus}
                  handleSendUserMessage={handleSendUserMessage}
                  allowFeedback={allowFeedback}
                  initialFeedback={feedbackData?.find((feedback) => feedback.response_id === message.response_id)}
                  lastMessageResponseId={lastMessageResponseId}
                  messages={messagesSortedByResponseIdAndTimestamp}
                  orbLogoUrl={orbLogoUrl}
                  showOrbFromConfig={showOrbFromConfig}
                  invertTextColor={invertTextColor}
                />
              </div>
            );
          })}
          {aiMessages.length <= 1 && !hasFirstUserMessageBeenSent && (
            <div className="w-full pt-4">
              <SuggestionsArtifact
                suggestedQuestionOrientation="right"
                handleSendUserMessage={handleSendUserMessage}
                artifact={{
                  suggested_questions: initialSuggestedQuestions,
                  suggested_questions_type: 'BUBBLE',
                }}
                invertTextColor={invertTextColor}
              />
            </div>
          )}
          {showDemoPreQuestions && (
            <PreDemoQuestion
              isAMessageBeingProcessed={isAMessageBeingProcessed}
              setDemoPlayingStatus={setDemoPlayingStatus}
              handleSendUserMessage={handleSendUserMessage}
            />
          )}
        </div>

        <div className="p-1" />
      </div>
    </div>
  );
};

export default AgentMessages;
