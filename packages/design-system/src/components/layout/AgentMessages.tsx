import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useRef } from 'react';
import SuggestionsArtifact from './SuggestionsArtifact';
import { PreDemoQuestion } from '../../../../../apps/agent/src/components/views/AgentView/Demo/PreDemoQuestion';
import { ArtifactBaseType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { OrbStatusEnum } from '@meaku/core/types/config';
import MessageItem from './MessageItem';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { FeedbackRequestPayload } from '@meaku/core/types/api/feedback_request';
import { shouldMessageScrollToTop } from '@meaku/core/utils/messageUtils';

interface IProps {
  usingForAgent?: boolean;
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
  feedbackData: FeedbackRequestPayload[];
  lastMessageResponseId: string;
  orbLogoUrl: string | undefined | null;
}

const AgentMessages = ({
  usingForAgent = true,
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
    if (currentMessageScrollToTop.current && usingForAgent) {
      handleScrollToBottom();
    }
  }, [currentMessageScrollToTop.current, usingForAgent, messages.length]);

  const aiMessages = messages.filter((message) => message.role === 'ai');

  return (
    <div
      className={cn('w-[35%] overflow-y-auto', {
        'w-full': !showRightPanel,
      })}
      onWheel={(e) => e.stopPropagation()}
      style={{
        height: '100%',
        overflow: usingForAgent ? 'hidden' : 'auto',
      }}
    >
      <div ref={agentChatContainerRef} className="h-full flex-1 space-y-4 overflow-y-auto p-2 pl-4 pr-2">
        <div
          className={cn('mx-auto w-full', {
            'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]': !showRightPanel && !allowFullWidthForText,
          })}
        >
          {messages.map((message, idx) => {
            return (
              <div key={idx}>
                {shouldMessageScrollToTop(message) ? <div ref={currentMessageScrollToTop} className="p-0" /> : null}
                <MessageItem
                  isAMessageBeingProcessed={isAMessageBeingProcessed}
                  logoURL={logoURL}
                  usingForAgent={usingForAgent}
                  sessionId={sessionId}
                  primaryColor={primaryColor}
                  message={message}
                  messageIndex={idx}
                  totalMessages={messages.length}
                  orbState={orbState}
                  setActiveArtifact={setActiveArtifact}
                  setDemoPlayingStatus={setDemoPlayingStatus}
                  handleSendUserMessage={handleSendUserMessage}
                  allowFeedback={allowFeedback}
                  initialFeedback={feedbackData.find((feedback) => feedback.response_id === message.response_id)}
                  lastMessageResponseId={lastMessageResponseId}
                  messages={messages}
                  orbLogoUrl={orbLogoUrl}
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
