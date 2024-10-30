import { useState } from "react";
import { cn } from "@meaku/ui/lib/cn";
import SendIcon from "@meaku/ui/components/icons/send";
import SparkleIcon from "@meaku/ui/components/icons/sparkle";
import Input from "@meaku/ui/components/layout/input";

interface IProps {
  isChatOpen: boolean;
  suggestedQuestions: string[];
  hasFirstUserMessageBeenSent: boolean;
  handleSendUserMessage: (message: string) => void;
  handleOpenChat: () => void;
}

const BottomBar = (props: IProps) => {
  const {
    isChatOpen,
    suggestedQuestions,
    hasFirstUserMessageBeenSent,
    handleSendUserMessage,
    handleOpenChat,
  } = props;

  const [inputValue, setInputValue] = useState("");

  const showSuggestedQuestions =
    suggestedQuestions.length > 0 && inputValue.length <= 0;

  const handleSuggestedQuestionOnClick = (msg: string) => {
    handleSendUserMessage(msg);
  };

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue.length <= 0) return;

    handleSendUserMessage(trimmedInputValue);
    setInputValue("");
  };

  return (
    <div
      className={cn(
        "bottom-bar-shadow ui-absolute ui-bottom-4 ui-left-1/2 ui-z-10 ui-flex ui-min-w-[950px] -ui-translate-x-1/2 ui-transform ui-animate-gradient-rotate ui-items-center ui-justify-center ui-rounded-md ui-bg-gradient-to-bl ui-from-primary/50 ui-via-transparent ui-to-primary/50 ui-p-1 ui-backdrop-blur-lg",
        {
          "ui-hidden": isChatOpen,
          "ui-min-w-[700px]": hasFirstUserMessageBeenSent,
        },
      )}
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      <div className="ui-w-full ui-rounded-md ui-bg-gray-50 ui-p-1">
        <form
          onSubmit={handleFormSubmission}
          className="ui-flex ui-items-center ui-gap-2 ui-rounded-md ui-bg-white ui-p-[2px]"
        >
          <div className="ui-flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="ui-w-full ui-min-w-80 ui-border-none ui-text-gray-900 ui-outline-none ui-ring-0 placeholder:ui-text-gray-900 focus:ui-ring-0"
              placeholder="Ready to explore skills or hackathons?"
            />
          </div>

          <div
            className={cn(
              "ui-flex ui-items-center ui-gap-1 ui-overflow-hidden ui-transition-[width] ui-duration-150 ui-ease-in-out",
              {
                "ui-w-0": !showSuggestedQuestions,
                "ui-w-[710px]": showSuggestedQuestions,
              },
            )}
          >
            {suggestedQuestions.map((question) => (
              <div key={question} className="ui-rounded-full ui-bg-primary">
                <button
                  onClick={() => handleSuggestedQuestionOnClick(question)}
                  className="ui-flex ui-items-center ui-justify-center ui-gap-1 ui-rounded-full ui-border-2 ui-border-white ui-border-opacity-60 ui-bg-gradient-to-br ui-from-transparent ui-via-white/10 ui-to-white/40 ui-p-2 ui-text-white ui-transition-all ui-duration-300 ui-ease-in-out hover:ui-from-white/10 hover:ui-to-white/40"
                >
                  <span className="ui-min-w-max ui-text-sm ui-font-medium">
                    {question}
                  </span>
                  <SparkleIcon className="!ui-h-4 !ui-w-4 ui-text-white" />
                </button>
              </div>
            ))}
          </div>

          <div className="ui-flex ui-items-center ui-justify-center">
            <button className="ui-flex ui-h-9 ui-w-9 ui-items-center ui-justify-center ui-rounded-md ui-bg-primary ui-text-primary-foreground ui-transition-colors ui-duration-300 ui-ease-in-out hover:ui-bg-primary/80">
              <SendIcon className="ui-text-primary-foreground" />
            </button>
          </div>
        </form>
      </div>

      {hasFirstUserMessageBeenSent && (
        <button
          className="ui-absolute ui-inset-0 ui-rounded-md"
          onClick={handleOpenChat}
        ></button>
      )}
    </div>
  );
};

export default BottomBar;
