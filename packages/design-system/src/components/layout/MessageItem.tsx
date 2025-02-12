import BotIndicator from '@breakout/design-system/components/layout/bot-indicator';
import { cn } from '@breakout/design-system/lib/cn';
import Orb from '@breakout/design-system/components/Orb/index';
import { Message } from '@meaku/core/types/agent';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import gfm from 'remark-gfm';
import useInView from '@meaku/core/hooks/useInView';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import { OrbStatusEnum } from '@meaku/core/types/config';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { AiResponseLoadingText } from '@breakout/design-system/components/AiResponseLoadingText/index';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import MessageAnalytics from './MessageAnalytics.tsx';
import MessageDataSources from './MessageDataSources.tsx';
import MessageFeedback from './MessageFeedback.tsx';
import ArtifactPreview from './ArtifactPreview.tsx';
import { IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import ChatArtifact from './ChatArtifact.tsx';
import { Feedback } from '@meaku/core/types/session';
import { DemoPlayingStatus } from '@meaku/core/types/common';
import { GetArtifactPayload } from '@meaku/core/types/api';
import { getMessageTimestamp } from '@meaku/core/utils/index';

interface IProps {
  isAMessageBeingProcessed: boolean;
  usingForAgent: boolean;
  message: Message;
  sessionId: string;
  primaryColor: string | null;
  messageIndex: number;
  totalMessages: number;
  orbState: OrbStatusEnum;
  handleSendUserMessage: (data: IWebSocketHandleMessage) => void;
  setDemoPlayingStatus: (value: DemoPlayingStatus) => void;
  setActiveArtifact: (artifact: GetArtifactPayload | null) => void;
  handleAddMessageFeedback: (messageId: string, feedback: Partial<Feedback>) => void;
  handleRemoveMessageFeedback: (messageId: string, previousState?: Message) => void;
  initialSuggestedQuestions: string[];
  allowFeedback: boolean;
  logoURL: string | null;
}

const MessageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
  const { href, ...rest } = props;

  return <a className="text-primary" href={href} {...rest} target="_blank" rel="noreferrer" />;
};

const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => {
  return <strong className="text-primary-textColor" {...props} />;
};

const MessageItem = ({
  isAMessageBeingProcessed,
  usingForAgent,
  message,
  sessionId,
  primaryColor,
  messageIndex,
  totalMessages,
  orbState,
  setDemoPlayingStatus,
  setActiveArtifact,
  handleSendUserMessage,
  handleAddMessageFeedback,
  handleRemoveMessageFeedback,
  initialSuggestedQuestions,
  allowFeedback,
  logoURL,
}: IProps) => {
  const { trackAgentbotEvent } = useAgentbotAnalytics();
  const [isSingleLineMessage, setIsSingleLineMessage] = useState(false);

  const messageRef = useRef<HTMLDivElement>(null);
  const { isInView, ref: inViewRef } = useInView(0, true);

  const isSenderBot = message.role === 'ai';
  const isLoading = message.is_loading;

  const messageArtifactId = message.artifact?.artifact_id ?? '';
  const messageArtifactType = message.artifact?.artifact_type;

  const showArtifactPreview = messageIndex >= totalMessages - 4;
  const isLastMessage = messageIndex === totalMessages - 1;

  const hasValidArtifact = !!messageArtifactId && messageArtifactType !== 'NONE';

  const showMessageArtifactPreview =
    hasValidArtifact && (usingForAgent ? !isLastMessage && (showArtifactPreview || isInView) : true);

  const reactMarkdownComponents: Partial<Components> = {
    a: MessageLink,
    strong: MessageStrong,
  };

  const handleMessageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isLink = target.tagName === 'A';

    if (isLink && isSenderBot) {
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

  const conditionSpecificForDashboard = !usingForAgent && !isSenderBot;
  
  const timestamp = message?.timestamp;
  const formattedTimestamp = getMessageTimestamp(timestamp);

  return (
    <div ref={inViewRef}>
      <div
        className={cn('flex items-center', {
          'ml-11 justify-end pr-6': !isSenderBot,
          'flex-col items-end': conditionSpecificForDashboard,
        })}
      >
        {conditionSpecificForDashboard ? (
          <p className="w-full self-stretch pb-2 pr-2 text-right text-xs font-medium text-gray-500">User</p>
        ) : null}
        <div
          className={cn('max-w-full', {
            'rounded-2xl bg-primary/70 px-3 py-2': !isSenderBot,
            'flex gap-4 p-6 pl-0': isSenderBot && isLastMessage,
            'flex gap-7 p-6 pl-0': isSenderBot && !isLastMessage,
          })}
        >
          {isSenderBot && <>{isLastMessage ? <Orb state={orbState} color={primaryColor} /> : <BotIndicator />}</>}

          <div className="flex-col">
            <div
              className={cn('prose max-w-full flex-1', {
                'text-white': !isSenderBot,
                'leading-snug text-primary-textColor': isSenderBot,
              })}
              ref={messageRef}
              onClick={handleMessageClick}
            >
              {isLoading ? (
                <div className="flex h-8 items-center">
                  <AiResponseLoadingText color={primaryColor} text={message.message} />
                </div>
              ) : (
                <ReactMarkdown remarkPlugins={[gfm]} components={reactMarkdownComponents}>
                  {message.message}
                </ReactMarkdown>
              )}
              {conditionSpecificForDashboard ? (
                <p className="!-mt-4 w-full text-right text-xs font-medium text-gray-100">{formattedTimestamp}</p>
              ) : null}
            </div>
            <div className="flex flex-col items-start">
              {message.chatArtifact && message.chatArtifact.artifact_type == 'FORM' && (
                <ChatArtifact
                  isAMessageBeingProcessed={isAMessageBeingProcessed}
                  handleSendUserMessage={handleSendUserMessage}
                  artifact={message.chatArtifact}
                  messageIndex={messageIndex}
                  totalMessages={totalMessages}
                />
              )}
            </div>
            {showMessageArtifactPreview && (
              <ArtifactPreview
                logoURL={logoURL}
                usingForAgent={usingForAgent}
                setDemoPlayingStatus={setDemoPlayingStatus}
                setActiveArtifact={setActiveArtifact}
                artifactId={messageArtifactId}
                artifactType={messageArtifactType}
              />
            )}
            {isSenderBot && allowFeedback && message.is_complete && (
              <>
                <MessageAnalytics analytics={message.analytics} />
                <MessageDataSources dataSources={message.documents} />
                {!usingForAgent && <p className="mt-2 w-full text-xs font-medium text-gray-400">{formattedTimestamp}</p>}
                <MessageFeedback
                  sessionId={sessionId}
                  message={message}
                  handleAddMessageFeedback={handleAddMessageFeedback}
                  handleRemoveMessageFeedback={handleRemoveMessageFeedback}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="ml-auto">
        {totalMessages < 1 && (
          <SuggestionsArtifact
            suggestedQuestionOrientation='left'
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            handleSendUserMessage={handleSendUserMessage}
            artifact={{
              suggested_questions: initialSuggestedQuestions,
              suggested_questions_type: 'BUBBLE',
            }}
          />
        )}
        {message.chatArtifact && message.chatArtifact.artifact_type == 'SUGGESTIONS' && (
          <ChatArtifact
            isAMessageBeingProcessed={isAMessageBeingProcessed}
            artifact={message.chatArtifact}
            messageIndex={messageIndex}
            totalMessages={totalMessages}
            handleSendUserMessage={handleSendUserMessage}
          />
        )}
      </div>
    </div>
  );
};

export default MessageItem;
