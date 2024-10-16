import ANALYTICS_EVENT_NAMES from "@meaku/core/constants/analytics";
import useAnalytics from "@meaku/core/hooks/useAnalytics";
import { Message } from "@meaku/core/types/chat";
import {
  FeedbackEnum,
  InitialFeedbackPayload,
} from "@meaku/core/types/feedback";
import isUndefined from "lodash/isUndefined";
import { CirclePlayIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import gfm from "remark-gfm";
import { cn } from "../../lib/cn";
import ChevronIcon from "../icons/chevron";
import UserAvatarIcon from "../icons/user";
import WrappedLogo from "../icons/wrapped-logo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";
import Button from "./button";
import FaviconImage from "./favicon-image";
import FeedbackButton from "./feedback-button";

type Props = {
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
  const { agentName, message, handleShareInitialFeedback, handleShowFeedback } =
    props;

  const { trackEvent } = useAnalytics();

  const isSenderBot = message.role === "ai";
  const isLoading = message.is_loading;
  const isComplete = message.is_complete;
  const videoURL = message.media?.type === "VIDEO" && message.media.url;
  const showFeedbackButtons =
    message.showFeedbackOptions && isSenderBot && isComplete;
  const showDocuments = showFeedbackButtons && message.documents?.length > 0;
  const isMessageReadOnly = message.isReadOnly ?? false;
  const isFeedbackThumbUp = Boolean(
    message.feedback?.positive_feedback === true,
  );
  const isFeedbackThumbDown = Boolean(
    message.feedback?.positive_feedback === false,
  );

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
    const isLink = target.tagName === "A";

    if (isLink) {
      trackEvent(ANALYTICS_EVENT_NAMES.LINK_CLICKED_INSIDE_MESSAGE, {
        link: (target as HTMLAnchorElement).href,
        message: message.message,
      });
    }
  };

  useEffect(() => {
    const messageContent = message.message;
    const doesMessageContainLink = messageContent.includes("http");

    if (doesMessageContainLink) {
      trackEvent(ANALYTICS_EVENT_NAMES.LINK_VIEWED, {
        message: messageContent,
      });
    }
  }, [message.message]);

  return (
    <div
      id={`message-${message.id}`}
      className={cn("ui-flex ui-flex-col", {
        "ui-items-end ui-space-y-2": !isSenderBot,
        "ui-items-start": isSenderBot,
        "ui-animate-pulse": isLoading,
      })}
    >
      {isSenderBot ? (
        <div className="ui-mb-2 ui-flex ui-items-center ui-gap-2">
          <div className="ui-max-w-min">
            <WrappedLogo className="!ui-h-4 !ui-w-4" />
          </div>
          <h3 className="ui-font-medium ui-text-gray-800">{agentName}</h3>
        </div>
      ) : (
        <div className="ui-flex ui-items-center ui-justify-end ui-gap-2">
          <p className="ui-text-sm ui-text-gray-500">You</p>
          <UserAvatarIcon />
        </div>
      )}

      <div
        className={cn(
          "ui-w-11/12 ui-max-w-fit ui-overflow-hidden ui-rounded-2xl ui-border ui-text-gray-700 md:ui-w-5/6 lg:ui-w-5/6 2xl:ui-w-4/6",
          {
            "ui-flex ui-flex-col ui-items-start ui-rounded-tl-none ui-border-primary/25 ui-bg-primary/10":
              isSenderBot,
            "ui-border-gray-200": !isSenderBot,
          },
        )}
      >
        <div className="ui-p-4" onClick={handleMessageClick}>
          <ReactMarkdown
            remarkPlugins={[gfm]}
            components={reactMarkdownComponents}
          >
            {message.message}
          </ReactMarkdown>
        </div>

        {showDocuments && (
          <div className="ui-w-full">
            <Accordion type="single" collapsible>
              <AccordionItem
                value="sources"
                className="ui-border-0 ui-border-none"
              >
                <AccordionTrigger className="ui-w-full ui-px-4 ui-py-1 hover:ui-no-underline [&[data-state=open]_svg]:!-ui-rotate-0">
                  <div className="ui-flex ui-w-full ui-items-center ui-justify-between">
                    <h4 className="ui-text-x[13px] ui-font-medium ui-text-gray-700">
                      Show sources:
                    </h4>
                    <div className="ui-flex ui-items-center ui-justify-center ui-rounded-lg ui-bg-primary/20 ui-p-[1px] ui-transition-colors ui-duration-300 ui-ease-in-out hover:ui-bg-primary/30">
                      <ChevronIcon className="ui-h-7 ui-w-7 ui-rotate-180 ui-transform ui-text-primary ui-transition-transform ui-duration-300" />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="!ui-pb-0">
                  <div className="ui-bg-primary/20">
                    {message.documents.map((doc, idx) => (
                      <div
                        key={doc.id}
                        className={cn(
                          "ui-flex ui-items-center ui-gap-4 ui-px-4 ui-py-2",
                          {
                            "ui-border-b ui-border-primary/30":
                              idx !== message.documents.length - 1,
                          },
                        )}
                      >
                        <div className="ui-flex ui-h-6 ui-w-6 ui-items-center ui-justify-center ui-rounded-md ui-bg-white">
                          <p className="ui-text-sm ui-font-medium ui-text-gray-700">
                            {idx + 1}
                          </p>
                        </div>
                        <div className="ui-flex ui-flex-1 ui-items-center ui-justify-between">
                          {doc.url ? (
                            <>
                              <a
                                href={doc.url}
                                target="_blank"
                                className="ui-block ui-max-w-[18ch] ui-overflow-hidden ui-truncate ui-overflow-ellipsis ui-whitespace-nowrap ui-text-primary ui-underline md:ui-max-w-[25ch] xl:ui-max-w-[35ch]"
                                title={doc.title || doc.data_source_name}
                              >
                                {doc.title || doc.data_source_name}
                              </a>
                              <div>
                                <FaviconImage
                                  url={doc.url}
                                  className="ui-h-4 ui-w-4"
                                />
                              </div>
                            </>
                          ) : (
                            <p
                              className="ui-block ui-max-w-[18ch] ui-overflow-hidden ui-truncate ui-overflow-ellipsis ui-whitespace-nowrap ui-text-primary md:ui-max-w-[25ch] xl:ui-max-w-[35ch]"
                              title={doc.title || doc.data_source_name}
                            >
                              {doc.title || doc.data_source_name}
                            </p>
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

        {videoURL && (
          <video
            className="ui-w-full"
            controls
            autoPlay={!message.isPartOfHistory}
          >
            <source src={videoURL} type="video/mp4" />
            Your browser does not support viewing this video.
          </video>
        )}
      </div>

      {showFeedbackButtons && (
        <div className="ui-mt-2 ui-flex ui-items-center ui-gap-2">
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
              onClick={() =>
                handleShowFeedback && handleShowFeedback(message.id.toString())
              }
              className="ui-h-7 ui-w-7"
            >
              <CirclePlayIcon className="ui-h-4 ui-w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
