import React from 'react';
import { cn } from '@breakout/design-system/lib/cn';
import Orb from '@breakout/design-system/components/Orb/index';
import { AiResponseLoadingText } from '@breakout/design-system/components/AiResponseLoadingText/index';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { OrbStatusEnum } from '@meaku/core/types/config';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import useElementScrollIntoView from '@meaku/core/hooks/useElementScrollIntoView';
import { MessageSenderRole, ViewType } from '@meaku/core/types/common';
import { checkIsAIMessage, getMessageViewType, checkIsLoadingTextMessage } from '@meaku/core/utils/messageUtils';
import ChatMessageTail from './ChatMessageTail';
import ChatMessageTimestamp from './ChatMessageTimestamp';
import ChatMessageSender from './ChatMessageSender';
import { getChatMessageClass, getChatTextMessageContainerClass } from './messageUtils';
import GithubMarkdownRenderer from './GithubMarkdownRenderer';

interface TextMessageProps {
  message: WebSocketMessage;
  viewType: ViewType;
  isLastQuestionResponse: boolean;
  orbState: OrbStatusEnum;
  primaryColor: string | null;
  shouldShowActiveOrb: boolean;
  isCurrentMsgUserInactiveMessage: boolean;
  showOrbFromConfig: boolean;
  orbLogoUrl: string | undefined | null;
}

const TextMessage: React.FC<TextMessageProps> = ({
  message,
  viewType,
  isLastQuestionResponse,
  orbState,
  primaryColor,
  shouldShowActiveOrb,
  isCurrentMsgUserInactiveMessage,
  orbLogoUrl,
  showOrbFromConfig,
}) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const isHumanMessage = message.role === MessageSenderRole.USER || message.role === MessageSenderRole.ADMIN;
  const scrollToMessageRef = useElementScrollIntoView<HTMLDivElement>({
    shouldScroll: (isCurrentMsgUserInactiveMessage && isLastQuestionResponse) || isHumanMessage,
  });

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

  const renderOrb = () =>
    shouldShowActiveOrb && (
      <Orb showOrb={showOrbFromConfig} state={orbState} color={primaryColor} orbLogoUrl={orbLogoUrl} />
    );

  const renderMessageContent = () => {
    if (isLoadingTextMessage) {
      return (
        <div className="flex h-8 items-center ">
          <AiResponseLoadingText color={'rgb(var(--system) / 0.4)'} text={message.message.content} />
        </div>
      );
    }

    return <GithubMarkdownRenderer markdown={message.message.content || ''} />;
  };

  return (
    <div
      ref={scrollToMessageRef}
      className={cn('flex items-center', getChatTextMessageContainerClass(messageViewType))}
    >
      <div
        className={cn('relative max-w-full rounded-2xl px-4 py-2', getChatMessageClass(messageViewType), {
          'flex gap-4 py-4 pl-0': isAIMessage && isLastQuestionResponse,
          'flex gap-7 p-4 pl-0': isAIMessage && !isLastQuestionResponse,
          'pl-11': isAIMessage && !shouldShowActiveOrb,
        })}
      >
        <ChatMessageSender messageViewType={messageViewType} role={message.role} />

        <div className="mb-0.5 flex max-w-8 items-end justify-center">
          {(isAIMessage || isLoadingTextMessage) && renderOrb()}
        </div>

        <div className="flex-col">
          <div
            className={cn('prose w-full flex-1 text-base text-customPrimaryText', {
              'leading-snug': isAIMessage,
            })}
            onClick={handleMessageClick}
          >
            {renderMessageContent()}
            <ChatMessageTimestamp messageViewType={messageViewType} timestamp={message.timestamp} />
          </div>
        </div>
        <ChatMessageTail messageViewType={messageViewType} />
      </div>
    </div>
  );
};

export default TextMessage;
