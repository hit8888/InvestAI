import { useEffect, useRef, useState } from "react";
import SendIcon from "../icons/send";
import UserAvatarIcon from "../icons/user";
import WrappedLogo from "../icons/wrapped-logo";

type Props = {
  disclaimerText: string;
  isAMessageBeingProcessed: boolean;
  handleSendUserMessage: (message: string) => void;
};

const INITIAL_INPUT_HEIGHT = 40; // px
const MAX_INPUT_HEIGHT = 100; // px

const ChatInput = (props: Props) => {
  const { disclaimerText, isAMessageBeingProcessed, handleSendUserMessage } =
    props;

  const [inputValue, setInputValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isSubmissionDisabled =
    isAMessageBeingProcessed || inputValue?.length === 0;

  const handleInputValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value);
  };

  const handleSubmission = () => {
    if (isSubmissionDisabled) return;
    handleSendUserMessage(inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isShiftKeyPressed = e.shiftKey;
    const isEnterKeyPressed = e.key === "Enter" || e.key === "Return";

    if (!isShiftKeyPressed && isEnterKeyPressed) {
      e.preventDefault();
      handleSubmission();
    }
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = `${INITIAL_INPUT_HEIGHT}px`;
      const padding =
        textAreaRef.current.offsetHeight - textAreaRef.current.clientHeight;

      const scrollHeight = textAreaRef.current.scrollHeight;
      const newHeight = Math.min(
        Math.max(scrollHeight - padding, INITIAL_INPUT_HEIGHT),
        MAX_INPUT_HEIGHT,
      );

      textAreaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  return (
    <div>
      <div className="ui-flex ui-items-center ui-gap-2 ui-border-t ui-border-gray-200 ui-p-4 ui-shadow-2xl ui-shadow-primary">
        <div className="ui-hidden ui-items-center -ui-space-x-3 sm:ui-flex">
          <WrappedLogo />
          <UserAvatarIcon className="ui-relative ui-z-20 !ui-h-11 !ui-w-11 ui-rounded-full ui-border-[3px] ui-border-white" />
        </div>
        <textarea
          ref={textAreaRef}
          value={inputValue}
          onChange={handleInputValueChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your questions here."
          className="ui-h-10 ui-flex-1 ui-resize-none ui-overflow-y-auto ui-rounded-md ui-border-gray-300 ui-text-sm focus:ui-ring-primary"
        />
        <button
          disabled={isSubmissionDisabled}
          onClick={handleSubmission}
          className="ui-flex ui-h-10 ui-w-10 ui-items-center ui-justify-center ui-rounded-md ui-bg-primary ui-opacity-100 ui-transition-opacity ui-duration-300 hover:ui-opacity-80 disabled:ui-pointer-events-none disabled:ui-cursor-not-allowed disabled:ui-opacity-50"
        >
          <SendIcon className="ui-text-primary-foreground" />
        </button>
      </div>

      {/* {Boolean(disclaimerText) && (
        <div className="ui-flex ui-items-center ui-gap-2 ui-bg-white ui-px-4">
          <DisclaimerIcon className="ui-h-4 ui-w-4" />
          <p>{disclaimerText}</p>
        </div>
      )} */}
    </div>
  );
};

export default ChatInput;
