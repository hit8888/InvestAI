import { useMemo } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import MessageItemLayout from '../ChatMessages/MessageItemLayout';
import { getChatMessageClass, getChatTextMessageContainerClass } from '../messageUtils';
import { MessageViewType } from '@neuraltrade/core/types/common';
import ChatMessageTail from '../ChatMessages/ChatMessageTail';
import ChatMessageSender from '../ChatMessages/ChatMessageSender';

const messageViewType = MessageViewType.ADMIN_MESSAGE_IN_USER_VIEW;

const TypingIndicator: React.FC = () => {
  const messageContainerClasses = useMemo(() => {
    const baseClasses = 'relative rounded-2xl';
    const messageClass = getChatMessageClass(messageViewType);

    const conditionalClasses = {
      'flex items-start gap-2': true,
      'w-auto': true,
    };

    return cn(baseClasses, messageClass, conditionalClasses);
  }, []);

  return (
    <MessageItemLayout className={getChatTextMessageContainerClass(messageViewType)}>
      <div className={messageContainerClasses}>
        <ChatMessageSender messageViewType={messageViewType} role="ai" />

        <div className="min-w-0">
          <div className="prose text-base leading-snug text-customPrimaryText">
            <div className="flex items-center px-1.5 py-1">
              <div className="flex items-center justify-center space-x-1">
                <div
                  className={cn(
                    'size-1.5 animate-high-bounce rounded-full duration-700 [animation-delay:200ms]',
                    'bg-gray-500',
                  )}
                />
                <div
                  className={cn(
                    'size-1.5 animate-high-bounce rounded-full duration-700 [animation-delay:300ms]',
                    'bg-gray-500',
                  )}
                />
                <div
                  className={cn(
                    'size-1.5 animate-high-bounce rounded-full duration-700 [animation-delay:400ms]',
                    'bg-gray-500',
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <ChatMessageTail messageViewType={messageViewType} />
      </div>
    </MessageItemLayout>
  );
};

export default TypingIndicator;
