import { Message } from "@meaku/core/types/chat";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { cn } from "../../lib/cn";
import UserAvatarIcon from "../icons/user";
import WrappedLogo from "../icons/wrapped-logo";

type Props = {
  message: Message;
};

const MessageItem = (props: Props) => {
  const { message } = props;

  const isSenderBot = message.role === "ai";
  const isLoading = message.is_loading;
  const videoURL = message.media?.type === "VIDEO" && message.media.url;

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
          <div className="ui-prose ui-text-sm md:ui-text-[15px]">
            <ReactMarkdown remarkPlugins={[gfm]}>
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
          src={videoURL}
          autoPlay={!message.isPartOfHistory}
        />
      )}
    </div>
  );
};

export default MessageItem;
