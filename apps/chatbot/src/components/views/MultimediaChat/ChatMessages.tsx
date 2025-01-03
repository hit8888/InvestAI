import { cn } from '@breakout/design-system/lib/cn';
import { Message } from '@meaku/core/types/chat';
import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { useMessageStore } from '../../../stores/useMessageStore';
import { IWebSocketHandleMessage } from '../../../hooks/useWebSocketChat';
import SuggestionsArtifact from './SuggestionsArtifact';
import { PreDemoQuestion } from './Demo/PreDemoQuestion';

interface IProps {
  messages: Message[];
  showRightPanel?: boolean;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  initialSuggestedQuestions: string[];
  allowFullWidthForText: boolean;
  showDemoPreQuestions: boolean;
}

const ChatMessages = ({
  messages,
  showRightPanel = false,
  handleSendUserMessage,
  initialSuggestedQuestions,
  allowFullWidthForText,
  showDemoPreQuestions,
}: IProps) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentMessageScrollToTop = useRef<HTMLDivElement>(null);

  const orbState = useMessageStore((state) => state.orbState);
  const handleScrollToBottom = () => {
    if (chatContainerRef.current) {
      const { scrollTop } = chatContainerRef.current;
      const isAtTop = scrollTop <= 1;

      if (isAtTop) {
        currentMessageScrollToTop.current?.scrollIntoView({ behavior: 'instant' });
      }
    }
  };
  useEffect(() => {
    handleScrollToBottom();
  }, [messages]);

  const aiMessages = messages.filter((message) => message.role === 'ai');
  return (
    <div
      className={cn('col-span-3 flex-1 overflow-y-auto', {
        'col-span-1': showRightPanel,
      })}
    >
      <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto p-2">
        <div
          className={cn('mx-auto h-full w-full', {
            'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]': !showRightPanel && !allowFullWidthForText,
          })}
        >
          {messages.map((message, idx) => (
            <div key={idx}>
              {message?.role !== 'ai' ? <div ref={currentMessageScrollToTop} className="p-2" /> : null}
              <MessageItem
                message={message}
                messageIndex={idx}
                totalMessages={messages.length}
                orbState={orbState}
                handleSendUserMessage={handleSendUserMessage}
                initialSuggestedQuestions={initialSuggestedQuestions}
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
          {showDemoPreQuestions && <PreDemoQuestion handleSendUserMessage={handleSendUserMessage} />}
        </div>

        <div className="p-1" />
      </div>
    </div>
  );
};

export default ChatMessages;
