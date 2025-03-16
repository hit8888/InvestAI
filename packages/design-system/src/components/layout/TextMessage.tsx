import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import gfm from 'remark-gfm';
import { cn } from '@breakout/design-system/lib/cn';
import Orb from '@breakout/design-system/components/Orb/index';
// import BotIndicator from '@breakout/design-system/components/layout/bot-indicator';
import { AiResponseLoadingText } from '@breakout/design-system/components/AiResponseLoadingText/index';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { getMessageTimestamp } from '@meaku/core/utils/index';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';

interface TextMessageProps {
  message: WebSocketMessage;
  isAiMessage: boolean;
  usingForAgent: boolean;
  isLastQuestionResponse: boolean;
  orbState: OrbStatusEnum;
  primaryColor: string | null;
  shouldShowActiveOrb: boolean;
  orbLogoUrl: string | undefined | null;
}

const MessageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
  const { href, ...rest } = props;
  return <a className="text-primary" href={href} {...rest} target="_blank" rel="noreferrer" />;
};

const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => {
  return <strong className="text-primary-textColor" {...props} />;
};

const TextMessage: React.FC<TextMessageProps> = ({
  message,
  isAiMessage,
  usingForAgent,
  isLastQuestionResponse,
  orbState,
  primaryColor,
  shouldShowActiveOrb,
  orbLogoUrl,
}) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const [isSingleLineMessage, setIsSingleLineMessage] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const conditionSpecificForDashboard = !usingForAgent && !isAiMessage;
  const timestamp = message?.timestamp;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  const reactMarkdownComponents: Partial<Components> = {
    a: MessageLink,
    strong: MessageStrong,
  };

  const handleMessageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isLink = target.tagName === 'A';

    if (isLink && isAiMessage) {
      trackAgentbotEvent(ANALYTICS_EVENT_NAMES.LINK_CLICKED_INSIDE_MESSAGE, {
        link: (target as HTMLAnchorElement).href,
        message: message.message,
      });
    }
  };

  useEffect(() => {
    if (messageRef.current) {
      const lineHeight = parseFloat(getComputedStyle(messageRef.current).lineHeight);
      const height = messageRef.current.scrollHeight;

      if (isSingleLineMessage === height <= lineHeight) return;

      setIsSingleLineMessage(height <= lineHeight);
    }
  }, [message.message, isSingleLineMessage]);

  return (
    <div
      className={cn('flex items-center', {
        'ml-11 justify-end pr-6': !isAiMessage,
        'flex-col items-end': conditionSpecificForDashboard,
      })}
    >
      {conditionSpecificForDashboard ? (
        <p className="w-full self-stretch pb-2 pr-2 text-right text-xs font-medium text-gray-500">User</p>
      ) : null}
      <div
        className={cn('max-w-full', {
          'rounded-2xl bg-primary/70 px-3 py-2': !isAiMessage,
          'flex gap-4 p-6 pl-0': isAiMessage && isLastQuestionResponse,
          'flex gap-7 p-6 pl-0': isAiMessage && !isLastQuestionResponse,
          'pl-11': !shouldShowActiveOrb && isAiMessage,
        })}
      >
        {(isAiMessage || message.message_type === 'LOADING_TEXT') && (
          <>
            {shouldShowActiveOrb ? (
              <Orb state={orbState} color={primaryColor} orbLogoUrl={orbLogoUrl} />
            ) : (
              // <BotIndicator />
              <></>
            )}
          </>
        )}

        <div className="flex-col">
          <div
            className={cn('prose max-w-full flex-1', {
              'text-white': !isAiMessage,
              'leading-snug text-primary-textColor': isAiMessage,
            })}
            ref={messageRef}
            onClick={handleMessageClick}
          >
            {message.message_type === 'LOADING_TEXT' ? (
              <div className="flex h-8 items-center">
                <AiResponseLoadingText color={primaryColor} text={message.message.content} />
              </div>
            ) : (
              <ReactMarkdown remarkPlugins={[gfm]} components={reactMarkdownComponents}>
                {message.message.content}
              </ReactMarkdown>
            )}
            {conditionSpecificForDashboard ? (
              <p className="!-mt-4 w-full text-right text-xs font-medium text-gray-100">{formattedTimestamp}</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextMessage;
