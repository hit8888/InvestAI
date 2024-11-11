import SparkleIcon from '@breakout/design-system/components/icons/sparkle';
import BotIndicator from '@breakout/design-system/components/layout/bot-indicator';
import { cn } from '@breakout/design-system/lib/cn';
import { Message, SuggestionArtifactType } from '@meaku/core/types/chat';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import gfm from 'remark-gfm';
import useWebSocketChat from '../../../hooks/useWebSocketChat';
import ArtifactManager from '../../../../../../packages/core/src/managers/ArtifactManager';
import { useChatStore } from '../../../stores/useChatStore';
import useArtifactDataQuery from '@meaku/core/queries/useArtifactDataQuery';

interface IProps {
  message: Message;
  showMessageArtifact?: boolean;
}

const MesageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
  const { href, ...rest } = props;

  return <a className="text-primary" href={href} {...rest} target="_blank" rel="noreferrer" />;
};

const MessageStrong = (props: React.HTMLAttributes<HTMLElement>) => {
  return <strong className="text-gray-600" {...props} />;
};

const MessageItem = (props: IProps) => {
  const { message, showMessageArtifact = false } = props;

  const [isSingleLineMessage, setIsSingleLineMessage] = useState(false);

  const messageRef = useRef<HTMLDivElement>(null);

  const { handleSendUserMessage } = useWebSocketChat();

  const suggestionArtifactId = useChatStore((state) => state.suggestionArtifactId);
  const setSuggestionArtifactId = useChatStore((state) => state.setSuggestionArtifactId);

  const { data: suggestionData } = useArtifactDataQuery({
    artifactId: suggestionArtifactId as string,
    artifactType: 'SUGGESTIONS',
    queryOptions: {
      enabled: !!suggestionArtifactId,
    },
  });

  const manager = useMemo(() => {
    if (!suggestionData) return null;

    return new ArtifactManager(suggestionData);
  }, [suggestionData]);

  const suggestionContent = manager?.getArtifactContent() as SuggestionArtifactType;

  const suggestedQuestions = suggestionContent?.suggested_questions || [];
  const suggestedQuestionType = suggestionContent?.suggested_questions_type;

  const showSuggestedQuestions =
    showMessageArtifact && suggestedQuestions.length > 0 && suggestedQuestionType === 'BUBBLE';

  const isSenderBot = message.role === 'ai';
  const isLoading = message.is_loading;

  const reactMarkdownComponents: Partial<Components> = {
    a: MesageLink,
    strong: MessageStrong,
  };

  const handleSuggestedQuestionOnClick = (msg: string) => {
    setSuggestionArtifactId(null);
    handleSendUserMessage(msg);
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
    <div>
      <div
        className={cn('flex items-center', {
          'justify-end': !isSenderBot,
        })}
      >
        <div
          className={cn('max-w-full', {
            'ml-10 bg-primary/70 px-3 py-2': !isSenderBot,
            'mr-10 flex gap-7 p-6 pl-0': isSenderBot,
            'rounded-full': isSingleLineMessage,
            'rounded-2xl': !isSingleLineMessage,
          })}
        >
          {isSenderBot && (
            <>
              <BotIndicator />
            </>
          )}
          <div
            className={cn('prose max-w-full flex-1', {
              'text-primary-foreground': !isSenderBot,
              'leading-snug text-gray-600': isSenderBot,
              'animate-pulse': isLoading,
            })}
            ref={messageRef}
          >
            <ReactMarkdown remarkPlugins={[gfm]} components={reactMarkdownComponents}>
              {message.message}
            </ReactMarkdown>
          </div>
          {/* TODO: Add link preview */}
          {/* <div></div> */}
        </div>
      </div>
      <div className="ml-auto flex flex-col">
        {showSuggestedQuestions && (
          <div className="flex flex-col gap-3">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => handleSuggestedQuestionOnClick(question)}
                className="group ml-auto flex max-w-fit items-center justify-center gap-1 rounded-full border-2 border-primary/10 bg-primary/15 p-2 text-primary transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
                title={question}
              >
                <SparkleIcon className="!h-4 !w-4 fill-primary/60 transition-colors duration-300 ease-in-out group-hover:fill-white/60" />
                <span className="max-w-80 truncate text-sm font-medium">{question}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;
