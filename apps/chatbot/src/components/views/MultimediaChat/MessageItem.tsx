import BotIndicator from '@breakout/design-system/components/layout/bot-indicator';
import { cn } from '@breakout/design-system/lib/cn';
import { Message } from '@meaku/core/types/chat';
import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import gfm from 'remark-gfm';
import useInView from '../../../hooks/useInView';
import ArtifactPreview from './ArtifactPreview';
import ChatArtifact from './ChatArtifact';
import { useAllowFeedback } from '../../../shared/UrlDerivedDataProvider';
import MessageAnalytics from './MessageAnalytics';
import MessageDataSources from './MessageDataSources.tsx';
import MessageFeedback from './MessageFeedback.tsx';
import SuggestionsArtifact from './SuggestionsArtifact.tsx';
import useWebSocketChat from '../../../hooks/useWebSocketChat.tsx';
import useUnifiedConfigurationResponseManager from '../../../pages/shared/hooks/useUnifiedConfigurationResponseManager.ts';

interface IProps {
  message: Message;
  messageIndex: number;
  totalMessages: number;
}

const MessageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
  const { href, ...rest } = props;

  return <a className="text-primary" href={href} {...rest} target="_blank" rel="noreferrer" />;
};

const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => {
  return <strong className="text-primary-textColor" {...props} />;
};

const MessageItem = (props: IProps) => {
  const { message, messageIndex, totalMessages } = props;

  const [isSingleLineMessage, setIsSingleLineMessage] = useState(false);

  const messageRef = useRef<HTMLDivElement>(null);
  const { isInView, ref: inViewRef } = useInView(0, true);

  const { handleSendUserMessage } = useWebSocketChat();

  const initialSuggestedQuestions = useUnifiedConfigurationResponseManager().getInitialSuggestedQuestions();

  const isSenderBot = message.role === 'ai';
  const isLoading = message.is_loading;

  const messageArtifactId = message.artifact?.artifact_id;
  const messageArtifactType = message.artifact?.artifact_type;

  const showArtifactPreview = messageIndex >= totalMessages - 4;
  const isLastMessage = messageIndex === totalMessages - 1;

  const showMessageArtifactPreview =
    !isLastMessage && (showArtifactPreview || isInView) && !!messageArtifactId && messageArtifactType !== 'NONE';

  const allowFeedback = useAllowFeedback();

  const reactMarkdownComponents: Partial<Components> = {
    a: MessageLink,
    strong: MessageStrong,
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
    <div ref={inViewRef}>
      <div
        className={cn('flex items-center', {
          'justify-end': !isSenderBot,
        })}
      >
        <div
          className={cn('max-w-full', {
            'ml-10 rounded-2xl bg-primary/70 px-3 py-2': !isSenderBot,
            'mr-10 flex gap-7 p-6 pl-0': isSenderBot,
          })}
        >
          {isSenderBot && (
            <>
              <BotIndicator />
            </>
          )}
          <div className="flex-col">
            <div
              className={cn('prose max-w-full flex-1', {
                'text-white': !isSenderBot,
                'leading-snug text-primary-textColor': isSenderBot,
                'animate-pulse': isLoading,
              })}
              ref={messageRef}
            >
              <ReactMarkdown remarkPlugins={[gfm]} components={reactMarkdownComponents}>
                {message.message}
              </ReactMarkdown>
            </div>
            <div className="flex flex-col items-start">
              {message.chatArtifact && message.chatArtifact.artifact_type == 'FORM' && (
                <ChatArtifact
                  artifact={message.chatArtifact}
                  messageIndex={messageIndex}
                  totalMessages={totalMessages}
                />
              )}
            </div>
            {showMessageArtifactPreview && (
              <ArtifactPreview artifactId={messageArtifactId} artifactType={messageArtifactType} />
            )}
            {isSenderBot && allowFeedback && message.is_complete && (
              <>
                <MessageAnalytics analytics={message.analytics} />
                <MessageDataSources dataSources={message.documents} />
                <MessageFeedback message={message} />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="ml-auto">
        {totalMessages <= 1 && (
          <SuggestionsArtifact
            handleSendUserMessage={handleSendUserMessage}
            artifact={{
              suggested_questions: initialSuggestedQuestions,
              suggested_questions_type: 'BUBBLE',
            }}
          />
        )}
        {message.chatArtifact && message.chatArtifact.artifact_type == 'SUGGESTIONS' && (
          <ChatArtifact artifact={message.chatArtifact} messageIndex={messageIndex} totalMessages={totalMessages} />
        )}
      </div>
    </div>
  );
};

export default MessageItem;
