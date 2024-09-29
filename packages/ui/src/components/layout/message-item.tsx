import ANALYTICS_EVENT_NAMES from "@meaku/core/constants/analytics";
import useAnalytics from "@meaku/core/hooks/useAnalytics";
import { Message } from "@meaku/core/types/chat";
import { useEffect } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import gfm from "remark-gfm";
import { cn } from "../../lib/cn";
import UserAvatarIcon from "../icons/user";
import WrappedLogo from "../icons/wrapped-logo";

type Props = {
  message: Message;
};

const MesageLink = (props: React.LinkHTMLAttributes<HTMLAnchorElement>) => {
  const { href, ...rest } = props;

  return <a href={href} {...rest} target="_blank" rel="noreferrer" />;
};

const MessageItem = (props: Props) => {
  const { message } = props;

  const { trackEvent } = useAnalytics();

  const isSenderBot = message.role === "ai";
  const isLoading = message.is_loading;
  const videoURL = message.media?.type === "VIDEO" && message.media.url;

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
      className={cn("ui-flex ui-flex-col", {
        "ui-items-end ui-space-y-2": !isSenderBot,
        "ui-items-start": isSenderBot,
        "ui-animate-pulse": isLoading,
      })}
    >
      {!isSenderBot && (
        <div className="ui-flex ui-items-center ui-justify-end ui-gap-2">
          <p className="ui-text-sm ui-text-gray-500">You</p>
          <UserAvatarIcon />
        </div>
      )}

      <div
        className={cn(
          "ui-w-11/12 ui-max-w-fit ui-rounded-2xl ui-border ui-p-4 ui-text-gray-700 sm:ui-w-10/12 md:ui-w-4/6 lg:ui-w-3/6 2xl:ui-w-2/6",
          {
            "ui-flex ui-items-start ui-space-x-4 ui-rounded-tl-none ui-border-primary/25 ui-bg-primary/10":
              isSenderBot,
            "ui-rounded-br-none ui-border-gray-200": !isSenderBot,
            "ui-rounded-b-none": !!videoURL,
          },
        )}
      >
        {isSenderBot && (
          <div className="ui-max-w-min">
            <WrappedLogo className="!ui-h-5 !ui-w-5" />
          </div>
        )}
        <div>
          {isSenderBot && (
            <h3 className="ui-font-medium ui-text-gray-800">Sam</h3>
          )}
          <div
            className="ui-prose ui-text-sm md:ui-text-[15px]"
            onClick={handleMessageClick}
          >
            <ReactMarkdown
              remarkPlugins={[gfm]}
              components={reactMarkdownComponents}
            >
              {message.message}
            </ReactMarkdown>
          </div>
        </div>
      </div>
      {videoURL && (
        <video
          className={
            "ui-w-11/12 ui-max-w-fit ui-rounded-b-2xl sm:ui-w-10/12 md:ui-w-4/6 lg:ui-w-3/6 2xl:ui-w-2/6"
          }
          controls
          autoPlay={!message.isPartOfHistory}
        >
          <source src={videoURL} type="video/mp4" />
          Your browser does not support viewing this video.
        </video>
      )}
    </div>
  );
};

export default MessageItem;
