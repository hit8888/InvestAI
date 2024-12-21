import { cn } from '@breakout/design-system/lib/cn';
import { Message } from '@meaku/core/types/chat';
import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { useMessageStore } from '../../../stores/useMessageStore';

interface IProps {
  messages: Message[];
  showArtifact?: boolean;
}

const ChatMessage = (props: IProps) => {
  const { messages, showArtifact = false } = props;

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

  return (
    <div
      className={cn('col-span-3 flex-1 overflow-y-auto', {
        'col-span-1': showArtifact,
      })}
    >
      <div ref={chatContainerRef} className="flex-1 space-y-4 overflow-y-auto p-2">
        <div
          className={cn('mx-auto h-full w-full', {
            'sm:max-w-[85%] lg:max-w-[80%] xl:max-w-[70%] 2xl:max-w-[60%]': !showArtifact,
          })}
        >
          {messages.map((message, idx) => (
            <>
              {message?.role !== 'ai' ? <div ref={currentMessageScrollToTop} className="p-2" /> : null}
              <MessageItem
                key={message.id}
                message={message}
                messageIndex={idx}
                totalMessages={messages.length}
                orbState={orbState}
              />
            </>
          ))}
        </div>

        <div className="p-1" />
      </div>
    </div>
  );
};

export default ChatMessage;
