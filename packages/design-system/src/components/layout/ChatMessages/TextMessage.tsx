import React, { useMemo } from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import { AiResponseLoadingText } from '@breakout/design-system/components/AiResponseLoadingText/index';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import { MessageSenderRole, ViewType } from '@meaku/core/types/common';
import { checkIsAIMessage, getMessageViewType, checkIsLoadingTextMessage } from '@meaku/core/utils/messageUtils';
import ChatMessageTail from './ChatMessageTail';
import ChatMessageTimestamp from './ChatMessageTimestamp';
import ChatMessageSender from './ChatMessageSender';
import { getChatMessageClass, getChatTextMessageContainerClass } from '../messageUtils';
import GithubMarkdownRenderer from '../GithubMarkdownRenderer';
import MessageItemLayout from './MessageItemLayout';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface TextMessageProps {
  elementRef: React.RefObject<HTMLDivElement | null>;
  shouldMessageScrollToTop: boolean;
  message: WebSocketMessage;
  viewType: ViewType;
  isLastQuestionResponse: boolean;
  shouldShowActiveOrb: boolean;
  renderOrb: () => React.ReactNode;
}

const TextMessage: React.FC<TextMessageProps> = ({
  elementRef,
  shouldMessageScrollToTop,
  message,
  viewType,
  isLastQuestionResponse,
  shouldShowActiveOrb,
  renderOrb,
}) => {
  const isMobile = useIsMobile();
  const { trackAgentbotEvent } = useAgentbotAnalytics();

  const isAIMessage = checkIsAIMessage(message);
  const messageViewType = getMessageViewType(message.role as MessageSenderRole, viewType);
  const isLoadingTextMessage = checkIsLoadingTextMessage(message);

  const handleMessageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.tagName === 'A' && isAIMessage) {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.LINK_CLICKED_INSIDE_MESSAGE, {
        link: (target as HTMLAnchorElement).href,
        message: message.message,
      });
    }
  };

  const renderMessageContent = () => {
    if (isLoadingTextMessage) {
      return (
        <div className="flex flex-1 items-center">
          <AiResponseLoadingText color={'rgb(var(--system) / 0.4)'} text={message.message.content} />
        </div>
      );
    }

    return <GithubMarkdownRenderer markdown={message.message.content || ''} />;
  };

  const messageContainerClasses = useMemo(() => {
    const baseClasses = 'relative rounded-2xl';
    const messageClass = getChatMessageClass(messageViewType);

    const conditionalClasses = {
      'flex w-full gap-4 pl-0': (isAIMessage && isLastQuestionResponse) || isLoadingTextMessage,
      'flex gap-7 pl-0 pr-4': isAIMessage && !isLastQuestionResponse,
      'pl-11': isAIMessage && !shouldShowActiveOrb && !isMobile,
      'max-w-full md:max-w-lg': isAIMessage && isMobile,
    };

    return cn(baseClasses, messageClass, conditionalClasses);
  }, [isAIMessage, isLastQuestionResponse, isLoadingTextMessage, shouldShowActiveOrb, isMobile, messageViewType]);

  return (
    <MessageItemLayout className={getChatTextMessageContainerClass(messageViewType)}>
      <div ref={shouldMessageScrollToTop ? elementRef : null} className={messageContainerClasses}>
        <ChatMessageSender messageViewType={messageViewType} role={message.role} />

        {isAIMessage && !isLoadingTextMessage && shouldShowActiveOrb && (
          <div className="flex w-8 items-start justify-start">{renderOrb()}</div>
        )}

        {isLoadingTextMessage && shouldShowActiveOrb && renderOrb()}

        <div className="w-full">
          <div
            className={cn('prose w-full flex-1 text-base text-customPrimaryText', {
              'leading-snug': isAIMessage,
            })}
            onClick={handleMessageClick}
          >
            {renderMessageContent()}
          </div>
        </div>
        <ChatMessageTimestamp messageViewType={messageViewType} timestamp={message.timestamp} />
        <ChatMessageTail messageViewType={messageViewType} />
      </div>
    </MessageItemLayout>
  );
};

export default TextMessage;
