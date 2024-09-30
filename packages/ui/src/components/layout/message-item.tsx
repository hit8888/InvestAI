import { Message } from "@meaku/core/types/chat";
import {
  FeedbackEnum,
  InitialFeedbackPayload,
} from "@meaku/core/types/feedback";
import { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { cn } from "../../lib/cn";
import UserAvatarIcon from "../icons/user";
import WrappedLogo from "../icons/wrapped-logo";
import FeedbackButton from "./feedback-button";

type Props = {
  message: Message;
  handleShareInitialFeedback?: (payload: InitialFeedbackPayload) => void;
};

const MessageItem = (props: Props) => {
  const { message, handleShareInitialFeedback } = props;

  const isSenderBot = message.role === "ai";
  const isLoading = message.is_loading;
  const isComplete = message.is_complete;
  const videoURL = message.media?.type === "VIDEO" && message.media.url;
  // const showFeedbackButtons = showFeedback && isSenderBot && isComplete;
  const showFeedbackButtons =
    message.showFeedbackOptions && isSenderBot && isComplete;
  const isFeedbackThumbUp = message.feedback_type === FeedbackEnum.THUMBS_UP;
  const isFeedbackThumbDown =
    message.feedback_type === FeedbackEnum.THUMBS_DOWN;

  const handleSendResponseFeedback = useCallback(
    (feedback: FeedbackEnum) => {
      if (!handleShareInitialFeedback) return;

      handleShareInitialFeedback({
        responseId: message.id.toString(),
        feedbackType: feedback,
      });
    },
    [message.id],
  );

  return (
    <div
      id={`message-${message.id}`}
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
          autoPlay={!message.isPartOfHistory}
        >
          <source src={videoURL} type="video/mp4" />
          Your browser does not support viewing this video.
        </video>
      )}

      {showFeedbackButtons && (
        <div className="ui-mt-2 ui-flex ui-items-center ui-gap-2">
          <FeedbackButton
            isFilled={isFeedbackThumbUp}
            onClick={() => handleSendResponseFeedback(FeedbackEnum.THUMBS_UP)}
          />
          <FeedbackButton
            isFilled={isFeedbackThumbDown}
            isInverted={true}
            onClick={() => handleSendResponseFeedback(FeedbackEnum.THUMBS_DOWN)}
          />
        </div>
      )}
    </div>
  );
};

export default MessageItem;
