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
        "bottom-bar-shadow absolute bottom-4 left-1/2 z-10 flex min-w-[950px] -translate-x-1/2 transform animate-gradient-rotate items-center justify-center rounded-md bg-gradient-to-bl from-primary/50 via-transparent to-primary/50 p-1 backdrop-blur-lg",
        {
          "hidden": isChatOpen,
          "min-w-[700px]": hasFirstUserMessageBeenSent,
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
              className="w-full min-w-80 border-none text-gray-900 outline-none ring-0 placeholder:text-gray-900 focus:ring-0"
              placeholder="Ready to explore skills or hackathons?"
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
              <div key={question} className="rounded-full bg-primary">
                <button
                  onClick={() => handleSuggestedQuestionOnClick(question)}
                  className="flex items-center justify-center gap-1 rounded-full border-2 border-white border-opacity-60 bg-gradient-to-br from-transparent via-white/10 to-white/40 p-2 text-white transition-all duration-300 ease-in-out hover:from-white/10 hover:to-white/40"
                >
                  <span className="min-w-max text-sm font-medium">
                    {question}
                  </span>
                  <SparkleIcon className="!h-4 !w-4 text-white" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center">
            <button className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80">
              <SendIcon className="text-primary-foreground" />
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
