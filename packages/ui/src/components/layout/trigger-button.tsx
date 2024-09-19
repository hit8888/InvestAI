import { XIcon } from "lucide-react";
import { memo } from "react";
import { cn } from "../../lib/cn";
import ChatIcon from "../icons/chat";
import SuggestedQuestion from "./suggested-question";

type Props = {
  isChatOpen: boolean;
  showTooltip: boolean;
  suggestedQuestions: string[];
  handleToggleChatOpenState: () => void;
  handleCloseTooltip: () => void;
  handleSuggestionsOnClick: (msg: string) => void;
};

const TriggerButton = (props: Props) => {
  const {
    isChatOpen,
    showTooltip,
    suggestedQuestions,
    handleToggleChatOpenState,
    handleCloseTooltip,
    handleSuggestionsOnClick,
  } = props;

  return (
    <div className="ui-flex ui-flex-col ui-items-end ui-justify-end ui-overflow-hidden ui-p-4">
      {showTooltip && (
        <div className="ui-max-w-80">
          <div className="ui-relative ui-mb-4 ui-rounded-md ui-border ui-bg-white ui-p-2 ui-text-gray-700">
            <button
              onClick={handleCloseTooltip}
              className="ui-absolute -ui-right-2 -ui-top-2 ui-flex ui-items-center ui-justify-center ui-rounded-full ui-border ui-bg-white ui-p-1"
            >
              <XIcon
                strokeWidth={2}
                className="ui-right-2 ui-top-2 ui-h-3 ui-w-3 ui-cursor-pointer ui-text-gray-700"
              />
            </button>

            <p className="ui-text-sm">
              Hey, I am your AI Companion – Experience the Future of Interaction
              with me!
            </p>
          </div>

          <div className="ui-mb-3 ui-space-y-2">
            {suggestedQuestions.map((question) => (
              <SuggestedQuestion
                handleOnClick={handleSuggestionsOnClick}
                key={question}
                question={question}
              />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleToggleChatOpenState}
        className={cn(
          "ui-flex ui-items-center ui-gap-2 ui-rounded-full ui-bg-gradient-to-br ui-from-primary/70 ui-to-primary ui-p-2 ui-opacity-100 ui-transition-all ui-duration-300 hover:ui-opacity-80",
          {
            "ui-w-14": isChatOpen,
            "ui-w-44": !isChatOpen,
          },
        )}
      >
        {!isChatOpen ? (
          <>
            <div className="ui-rounded-full ui-bg-primary-foreground">
              <div className="ui-rounded-full ui-bg-primary/50 ui-p-2">
                <ChatIcon className="ui-h-4 ui-w-4 ui-text-primary-foreground" />
              </div>
            </div>
            <div className="ui-flex ui-items-center ui-gap-2 ui-text-[15px] ui-font-medium ui-text-primary-foreground">
              <h3 className="ui-text-nowrap">Let&apos;s Chat!</h3>
              <span className="ui-animate-wave">👋</span>
            </div>
          </>
        ) : (
          <div className="ui-rounded-full ui-p-1">
            <XIcon
              strokeWidth={2}
              className="ui-h-8 ui-w-8 ui-text-primary-foreground"
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default memo(TriggerButton);
