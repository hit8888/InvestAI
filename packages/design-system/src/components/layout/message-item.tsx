import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import { Message } from '@meaku/core/types/agent';
import { FeedbackEnum, InitialFeedbackPayload } from '@meaku/core/types/feedback';
import isUndefined from 'lodash/isUndefined';
import { useCallback } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import gfm from 'remark-gfm';
import { cn } from '../../lib/cn';
import ChevronIcon from '../icons/chevron';
import UserAvatarIcon from '../icons/user';
import WrappedLogo from '../icons/wrapped-logo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';
import Button from './button';
import FaviconImage from './favicon-image';
import FeedbackButton from './feedback-button';
import { CirclePlayIcon } from 'lucide-react';

type Props = {
  forAgentChatbot?: boolean;
  agentName: string;
  message: Message;
  handleShareInitialFeedback?: (payload: InitialFeedbackPayload) => void;
  handleShowFeedback?: (responseId: string) => void;
};

const MesageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
  const { href, ...rest } = props;

  return <a href={href} {...rest} target="_blank" rel="noreferrer" />;
};

const MessageItem = (props: Props) => {
  const { forAgentChatbot, agentName, message, handleShareInitialFeedback, handleShowFeedback } = props;

  const { trackEvent } = useAnalytics();

  const isSenderBot = message.role === 'ai';
  const isLoading = message.is_loading;
  const isComplete = message.is_complete;
  const showFeedbackButtons = message.showFeedbackOptions && isSenderBot && isComplete;
  const showDocuments = showFeedbackButtons && message.documents?.length > 0;
  const showBuyerIntentScore = showFeedbackButtons && Boolean(message.analytics.buyer_intent_score);
  const isMessageReadOnly = message.isReadOnly ?? false;
  const isFeedbackThumbUp = Boolean(message.feedback?.positive_feedback === true);
  const isFeedbackThumbDown = Boolean(message.feedback?.positive_feedback === false);

  const handleSendResponseFeedback = useCallback(
    (feedback: FeedbackEnum) => {
      if (!handleShareInitialFeedback) return;

      handleShareInitialFeedback({
        responseId: message.id.toString(),
        feedbackType: feedback,
      });
    },
    [message.id, handleShareInitialFeedback],
  );

  const reactMarkdownComponents: Partial<Components> = {
    a: MesageLink,
  };

  const handleMessageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const isLink = target.tagName === 'A';

    if (isLink) {
      trackEvent(ANALYTICS_EVENT_NAMES.LINK_CLICKED_INSIDE_MESSAGE, {
        link: (target as HTMLAnchorElement).href,
        message: message.message,
      });
    }
  };

  const messageTimestamp = new Date(message?.timestamp ?? '').toISOString().replace('T', ' ').split('.')[0];

  return (
    <div
      id={`message-${message.id}`}
      className={cn('flex flex-col', {
        'items-end space-y-2': !isSenderBot,
        'items-start': isSenderBot,
        'animate-pulse': isLoading,
      })}
    >
      {isSenderBot ? (
        forAgentChatbot ? (
          <div className="mb-2 flex items-center gap-2">
            <div className="max-w-min">
              <WrappedLogo className="!h-4 !w-4" />
            </div>
            <h3 className="font-medium text-gray-800">{agentName}</h3>
          </div>
        ) : null
      ) : forAgentChatbot ? (
        <div className="flex items-center justify-end gap-2">
          <p className="text-sm text-gray-500">You</p>
          <UserAvatarIcon />
        </div>
      ) : (
        <p className="w-full self-stretch text-right text-xs font-medium text-gray-500">User</p>
      )}

      <div
        className={cn(
          'w-11/12 max-w-fit overflow-hidden rounded-2xl border text-gray-700 md:w-5/6 lg:w-5/6 2xl:w-4/6',
          {
            'flex flex-col items-start rounded-tl-none border-primary/25 bg-primary/10': (forAgentChatbot && isSenderBot),
            'border-gray-200': (forAgentChatbot && !isSenderBot),
            'flex flex-col items-start border-none': (!forAgentChatbot && isSenderBot),
            'text-white bg-primary/70': (!forAgentChatbot && !isSenderBot),
          },
        )}
      >
        <div className={cn("prose max-w-full", {
          'p-4': (forAgentChatbot && !isSenderBot),
          'py-2 flex flex-col -gap-2 items-start px-4 text-white': (!forAgentChatbot && !isSenderBot)
        })} onClick={handleMessageClick}>
          <ReactMarkdown remarkPlugins={[gfm]} components={reactMarkdownComponents}>
            {message.message}
          </ReactMarkdown>
          {(!forAgentChatbot && !isSenderBot) && <p className='w-full text-primary/30 !-mt-4 text-right text-xs font-medium'>{messageTimestamp}</p>}
        </div>

        {showBuyerIntentScore && (
          <div className="mt-4 flex items-center gap-3 px-4">
            <p className="text-sm font-medium">Analytics:</p>
            <p className="rounded-md bg-primary/40 p-1 text-sm">
              Buyer Intent Score: <span>{message.analytics.buyer_intent_score}</span>
            </p>
          </div>
        )}

        {showDocuments && (
          <div className="w-full">
            <Accordion type="single" collapsible>
              <AccordionItem value="sources" className="border-0 border-none">
                <AccordionTrigger className={cn("w-full px-4 py-1 hover:no-underline [&[data-state=open]_svg]:!-rotate-0", {
                  'rounded-none bg-primary/30': !forAgentChatbot
                })}>
                  <div className="flex w-full items-center justify-between">
                    <h4 className="text-x[13px] font-medium text-gray-700">Show sources:</h4>
                    <div className="flex items-center justify-center rounded-lg bg-primary/20 p-[1px] transition-colors duration-300 ease-in-out hover:bg-primary/30">
                      <ChevronIcon className="h-7 w-7 rotate-180 transform text-primary transition-transform duration-300" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="!pb-0">
                  <div className="bg-primary/20">
                    {message.documents.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className={cn('flex items-center gap-4 px-4 py-2', {
                          'border-b border-primary/30': idx !== message.documents.length - 1,
                        })}
                      >
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white">
                          <p className="text-sm font-medium text-gray-700">{idx + 1}</p>
                        </div>
                        <div className="flex flex-1 items-center justify-between">
                          {!!doc.url && (
                            <>
                              <a
                                href={doc.url}
                                target="_blank"
                                className="block max-w-[18ch] overflow-hidden truncate overflow-ellipsis whitespace-nowrap text-primary underline md:max-w-[25ch] xl:max-w-[35ch]"
                                title={doc.title || doc.data_source_name || doc.url}
                              >
                                {doc.title || doc.data_source_name || doc.url}
                              </a>
                              <div className="flex items-center gap-3">
                                {!!doc.similarity_score && (
                                  <p className="font-medium">
                                    Similarity Score: <span className="text-primary">{doc.similarity_score}</span>
                                  </p>
                                )}
                                <FaviconImage url={doc.url} className="h-4 w-4" />
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </div>

      {(!forAgentChatbot && isSenderBot) && <p className='w-full text-primary/30 mt-2 text-xs font-medium'>{messageTimestamp}</p>}

      {showFeedbackButtons && (
        <div className="mt-2 flex items-center gap-2">
          <FeedbackButton
            disabled={isMessageReadOnly}
            isFilled={isFeedbackThumbUp}
            onClick={() => handleSendResponseFeedback(FeedbackEnum.THUMBS_UP)}
          />
          <FeedbackButton
            disabled={isMessageReadOnly}
            isFilled={isFeedbackThumbDown}
            isInverted={true}
            onClick={() => handleSendResponseFeedback(FeedbackEnum.THUMBS_DOWN)}
          />
          {isMessageReadOnly && (
            <Button
              size="icon"
              disabled={isUndefined(message.feedback?.positive_feedback)}
              onClick={() => handleShowFeedback && handleShowFeedback(message.id.toString())}
              className="h-7 w-7"
            >
              <CirclePlayIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
