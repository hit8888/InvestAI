import { cn } from '@breakout/design-system/lib/cn';
import { Message } from '@meaku/core/types/agent';
import { useEffect, useRef } from 'react';
import SuggestionsArtifact from './SuggestionsArtifact';
// import { PreDemoQuestion } from '../../../../../apps/agent/src/components/views/MultimediaChat/Demo/PreDemoQuestion';
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
  tenantName: string;
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
  allowFeedback: boolean;
}

const AgentMessages = ({
  usingForAgent = true,
  messages,
  sessionId,
  orbState,
  showRightPanel = false,
  setDemoPlayingStatus,
  setActiveArtifact,
  handleSendUserMessage,
  handleAddMessageFeedback,
  handleRemoveMessageFeedback,
  initialSuggestedQuestions,
  allowFullWidthForText,
  showDemoPreQuestions,
  primaryColor,
  allowFeedback,
}: IProps) => {
  const agentChatContainerRef = useRef<HTMLDivElement>(null);
  const currentMessageScrollToTop = useRef<HTMLDivElement>(null);

  const handleScrollToBottom = () => {
    if (agentChatContainerRef.current) {
      const { scrollTop } = agentChatContainerRef.current;
      const isAtTop = scrollTop <= 1;

      if (isAtTop) {
        currentMessageScrollToTop.current?.scrollIntoView({ behavior: 'instant' });
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
    >
      <div ref={agentChatContainerRef} className="flex-1 space-y-4 overflow-y-auto p-2">
        <div
          className={cn('mx-auto h-full w-full', {
            'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]': !showRightPanel && !allowFullWidthForText,
          })}
        >
          {messages.map((message, idx) => (
            <div key={idx}>
              {message?.role !== 'ai' ? <div ref={currentMessageScrollToTop} className="p-2" /> : null}
              <MessageItem
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
            <div className="pt-4">
              <SuggestionsArtifact
                handleSendUserMessage={handleSendUserMessage}
                artifact={{
                  suggested_questions: initialSuggestedQuestions,
                  suggested_questions_type: 'BUBBLE',
                }}
              />
            </div>
          )}
          {showDemoPreQuestions && <></>} {/*Temorary fix to avoid predemo question*/}
        </div>
        <div className="p-1" />
      </div>
    </div>
  );
};

export default AgentMessages;
