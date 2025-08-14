import React, { useMemo } from 'react';
import { cn, Markdown } from '@meaku/saral';
import { AiResponseLoadingText } from './AiResponseLoadingText';
import { useCommandBarAnalytics } from '@meaku/core/contexts/CommandBarAnalyticsProvider';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { MessageSenderRole, ViewType } from '../../utils/enum';
import { checkIsAIMessage, getMessageViewType, checkIsLoadingTextMessage } from '../../utils/common';
import ChatMessageTimestamp from './ChatMessageTimestamp';
import ChatMessageSender from './ChatMessageSender';
import { getChatMessageClass, getChatTextMessageContainerClass } from '../../utils/classname';
import MessageItemLayout from '../MessageItemLayout';
import { Message } from '../../types/message';
import { CtaEventDataContent, StreamMessageContent } from '../../utils/types';

interface TextMessageProps {
  elementRef: React.RefObject<HTMLDivElement | null>;
  shouldMessageScrollToTop: boolean;
  message: Message;
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
  const { trackEvent } = useCommandBarAnalytics();

  const isAIMessage = checkIsAIMessage(message);
  const messageViewType = getMessageViewType(message.role, viewType);
  const isLoadingTextMessage = checkIsLoadingTextMessage(message);

  const handleMessageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.tagName === 'A' && isAIMessage) {
      trackEvent(ANALYTICS_EVENT_NAMES.COMMAND_BAR.LINK_CLICKED_INSIDE_MESSAGE, {
        link: (target as HTMLAnchorElement).href,
        message: (message.event_data as CtaEventDataContent).message,
      });
    }
  };

  const renderMessageContent = () => {
    if (isLoadingTextMessage) {
      return (
        <div className="flex flex-1 items-center">
          <AiResponseLoadingText color={'rgb(var(--system) / 0.4)'} text={message.event_data.content} />
        </div>
      );
    }

    return <Markdown markdown={(message.event_data as StreamMessageContent)?.content || ''} />;
  };

  const messageContainerClasses = useMemo(() => {
    const baseClasses = 'relative rounded-2xl';
    const messageClass = getChatMessageClass(messageViewType);

    const conditionalClasses = {
      'flex w-full gap-4 pl-0': (isAIMessage && isLastQuestionResponse) || isLoadingTextMessage,
      'flex gap-7 pl-0 pr-4': isAIMessage && !isLastQuestionResponse,
      'max-w-full md:max-w-lg': isAIMessage,
    };

    return cn(baseClasses, messageClass, conditionalClasses);
  }, [isAIMessage, isLastQuestionResponse, isLoadingTextMessage, shouldShowActiveOrb, messageViewType]);

  return (
    <MessageItemLayout className={getChatTextMessageContainerClass(messageViewType)}>
      <div ref={shouldMessageScrollToTop ? elementRef : null} className={messageContainerClasses}>
        <ChatMessageSender role={message.role as MessageSenderRole} messageViewType={messageViewType} />

        {isAIMessage && !isLoadingTextMessage && shouldShowActiveOrb && (
          <div className="flex w-8 items-start justify-start">{renderOrb()}</div>
        )}

        {isLoadingTextMessage && shouldShowActiveOrb && renderOrb()}

        <div className="w-full">
          <div
            className={cn('prose w-full flex-1 text-base text-[#272A2E]', {
              'leading-snug': isAIMessage,
            })}
            onClick={handleMessageClick}
          >
            {renderMessageContent()}
          </div>
        </div>
        <ChatMessageTimestamp timestamp={message.timestamp} messageViewType={messageViewType} />
      </div>
    </MessageItemLayout>
  );
};

export default TextMessage;
