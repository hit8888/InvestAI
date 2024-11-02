import { memo, useState } from "react";
import useAutoResizeTextArea from "../../hooks/useAutoResizeTextArea";
import SendIcon from "../icons/send";
import UserAvatarIcon from "../icons/user";
import WrappedLogo from "../icons/wrapped-logo";

type Props = {
  disclaimerText?: string;
  disabled?: boolean;
  isAMessageBeingProcessed: boolean;
  handleChatInputOnChangeCallback?: () => void;
  handleSendUserMessage: (message: string) => void;
};

const INITIAL_INPUT_HEIGHT = 40; // px
const MAX_INPUT_HEIGHT = 100; // px

const ChatInput = (props: Props) => {
  const {
    disclaimerText,
    disabled = false,
    isAMessageBeingProcessed,
    handleChatInputOnChangeCallback,
    handleSendUserMessage,
  } = props;

  const [inputValue, setInputValue] = useState<string>("");
  const textAreaRef = useAutoResizeTextArea({
    textAreaValue: inputValue,
    initialHeight: INITIAL_INPUT_HEIGHT,
    maxHeight: MAX_INPUT_HEIGHT,
  });

  const isSubmissionDisabled =
    isAMessageBeingProcessed || inputValue?.length === 0;

  const handleInputValueChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInputValue(e.target.value);

    if (typeof handleChatInputOnChangeCallback === "function") {
      handleChatInputOnChangeCallback();
    }
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

  return (
    <div className="bg-white">
      <div className="flex items-center gap-2 border-t border-gray-200 p-4 shadow-2xl shadow-primary">
        <div className="hidden items-center -space-x-3 sm:flex">
          <WrappedLogo />
          <UserAvatarIcon className="relative z-20 !h-11 !w-11 rounded-full border-[3px] border-white" />
        </div>
        <textarea
          disabled={disabled}
          ref={textAreaRef}
          value={inputValue}
          onChange={handleInputValueChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your questions here."
          className="h-10 flex-1 resize-none overflow-y-auto rounded-md border-gray-300 text-sm focus:border-primary focus:ring-primary disabled:opacity-40"
        />
        <button
          disabled={isSubmissionDisabled || disabled}
          onClick={handleSubmission}
          className="flex h-10 w-10 items-center justify-center rounded-md bg-primary opacity-100 transition-opacity duration-300 hover:opacity-80 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <SendIcon className="text-primary-foreground" />
        </button>
      </div>

      {Boolean(disclaimerText) && (
        <div className="flex items-center gap-2 bg-white px-4 pb-1">
          <p className="text-sm text-gray-400">
            <span className="font-semibold">Note: </span>
            {disclaimerText}
          </p>
        </div>
      )}
    </div>
  );
};

export default memo(ChatInput);
