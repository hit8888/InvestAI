import SendIcon from "@breakout/design-system/components/icons/send";
import SparkleIcon from "@breakout/design-system/components/icons/sparkle";
import BotIndicator from "@breakout/design-system/components/layout/bot-indicator";
import Input from "@breakout/design-system/components/layout/input";
import { cn } from "@breakout/design-system/lib/cn";
import { useState } from "react";

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
        "bottom-bar-shadow absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform animate-gradient-rotate items-center justify-center rounded-md bg-gradient-to-bl from-primary/90 via-transparent to-primary/90 p-1 backdrop-blur-lg",
        {
          hidden: isChatOpen,
          "w-10/12": !hasFirstUserMessageBeenSent,
          "min-w-[300px]": hasFirstUserMessageBeenSent,
        },
      )}
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      <div className="w-full rounded-md bg-gray-50 p-1">
        <form
          onSubmit={handleFormSubmission}
          className="flex items-center gap-2 rounded-md bg-white p-[2px]"
        >
          <div className="flex-1">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={cn(
                "w-full min-w-80 border-none text-gray-900 outline-none ring-0 focus:ring-0",
                {
                  "placeholder:text-gray-600": !hasFirstUserMessageBeenSent,
                  "placeholder:text-gray-900": hasFirstUserMessageBeenSent,
                },
              )}
              placeholder={
                hasFirstUserMessageBeenSent
                  ? "Have a question? Ask here"
                  : "Ready to explore skills or hackathons?"
              }
            />
          </div>

          <div
            className={cn(
              "flex items-center gap-1 overflow-hidden transition-[width] duration-150 ease-in-out",
              {
                "w-0": !showSuggestedQuestions,
                "w-[710px]": showSuggestedQuestions,
              },
            )}
          >
            {suggestedQuestions.map((question) => (
              <div key={question} className="rounded-full bg-white">
                <button
                  type="button"
                  onClick={() => handleSuggestedQuestionOnClick(question)}
                  className="group flex items-center justify-center gap-1 rounded-full border-2 border-primary/10 bg-primary/15 p-2 text-primary transition-all duration-300 ease-in-out hover:bg-primary hover:text-white"
                >
                  <SparkleIcon className="!h-4 !w-4 fill-primary/60 transition-colors duration-300 ease-in-out group-hover:fill-white/60" />
                  <span className="min-w-max text-sm font-medium">
                    {question}
                  </span>
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-md",
                {
                  "bg-primary text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80":
                    !hasFirstUserMessageBeenSent,
                },
              )}
            >
              {hasFirstUserMessageBeenSent ? (
                <>
                  <BotIndicator size="md" />
                </>
              ) : (
                <SendIcon className="text-primary-foreground" />
              )}
            </button>
          </div>
        </form>
      </div>

      {hasFirstUserMessageBeenSent && (
        <button
          className="absolute inset-0 rounded-md"
          onClick={handleOpenChat}
        ></button>
      )}
    </div>
  );
};

export default BottomBar;
