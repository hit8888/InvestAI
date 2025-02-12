import { cn } from '@breakout/design-system/lib/cn';
import { Message } from '@meaku/core/types/agent';
import { useEffect, useRef } from 'react';
import SuggestionsArtifact from './SuggestionsArtifact';
import { PreDemoQuestion } from '../../../../../apps/agent/src/components/views/MultimediaChat/Demo/PreDemoQuestion';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import { OrbStatusEnum } from '@meaku/core/types/config';
import MessageItem from './MessageItem';
import { Feedback } from '@meaku/core/types/session';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { GetArtifactPayload } from '@meaku/core/types/api';

interface IProps {
  usingForAgent?: boolean;
  messages: Message[];
  sessionId: string;
  orbState: OrbStatusEnum;
  showRightPanel?: boolean;
  isAMessageBeingProcessed: boolean;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: GetArtifactPayload | null) => void;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  handleAddMessageFeedback: (messageId: string, feedback: Partial<Feedback>) => void;
  handleRemoveMessageFeedback: (messageId: string, previousState?: Message) => void;
  initialSuggestedQuestions: string[];
  allowFullWidthForText: boolean;
  showDemoPreQuestions: boolean;
  primaryColor: string | null;
  logoURL: string | null;
  allowFeedback: boolean;
}

const AgentMessages = ({
  usingForAgent = true,
  messages,
  sessionId,
  orbState,
  showRightPanel = false,
  isAMessageBeingProcessed,
  setDemoPlayingStatus,
  setActiveArtifact,
  handleSendUserMessage,
  handleAddMessageFeedback,
  handleRemoveMessageFeedback,
  initialSuggestedQuestions,
  allowFullWidthForText,
  showDemoPreQuestions,
  primaryColor,
  logoURL,
  allowFeedback,
}: IProps) => {
  const agentChatContainerRef = useRef<HTMLDivElement>(null);
  const currentMessageScrollToTop = useRef<HTMLDivElement>(null);

  const handleScrollToBottom = () => {
    if (agentChatContainerRef.current) {
      const container = agentChatContainerRef.current;
      const lastUserMessage = currentMessageScrollToTop.current;

      if (lastUserMessage) {
        // Get the offset of the last user message relative to the container
        const containerTop = container.offsetTop;
        const messageTop = lastUserMessage.offsetTop;

        // Scroll the container
        container.scrollTop = messageTop - containerTop;
      }
    }
  };

  useEffect(() => {
    if (usingForAgent) {
      handleScrollToBottom();
    }
  }, [messages, usingForAgent]);

  const aiMessages = messages.filter((message) => message.role === 'ai');
  return (
    <div
      className={cn('col-span-3 flex-1 overflow-y-auto', {
        'col-span-1': showRightPanel,
      })}
      onWheel={(e) => e.stopPropagation()}
      style={{
        height: '100%',
        overflow: usingForAgent ? 'hidden': 'auto',
      }}
    >
      <div ref={agentChatContainerRef} className="h-full flex-1 space-y-4 hide-scrollbar overflow-y-auto p-2">
        <div
          className={cn('mx-auto w-full', {
            'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]': !showRightPanel && !allowFullWidthForText,
          })}
        >
          {messages.map((message, idx) => (
            <div key={idx}>
              {message?.role !== 'ai' ? <div ref={currentMessageScrollToTop} className="p-2" /> : null}
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
                handleAddMessageFeedback={handleAddMessageFeedback}
                handleRemoveMessageFeedback={handleRemoveMessageFeedback}
                initialSuggestedQuestions={initialSuggestedQuestions}
                allowFeedback={allowFeedback}
              />
            </div>
          ))}
          {aiMessages.length <= 1 && (
            <div className="w-full pt-4">
              <SuggestionsArtifact
                suggestedQuestionOrientation='right'
                isAMessageBeingProcessed={isAMessageBeingProcessed}
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
