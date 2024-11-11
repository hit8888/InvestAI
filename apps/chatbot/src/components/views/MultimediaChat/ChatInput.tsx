import SendIcon from "@breakout/design-system/components/icons/send";
import Button from "@breakout/design-system/components/layout/button";
import TextArea from "@breakout/design-system/components/layout/textarea";
import { useState } from "react";
import useAutoResizeTextArea from "../../../../../../packages/design-system/src/hooks/useAutoResizeTextArea";

interface IProps {
  handleOnChange: () => void;
  handleSendMessage: (message: string) => void;
  isAMessageBeingProcessed: boolean;
}

const INITIAL_INPUT_HEIGHT = 40; // px
const MAX_INPUT_HEIGHT = 100; // px

const ChatInput = (props: IProps) => {
  const { handleOnChange, handleSendMessage, isAMessageBeingProcessed } = props;

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

    if (typeof handleOnChange === "function") {
      handleOnChange();
    }
  };

  const handleSubmission = () => {
    if (isSubmissionDisabled) return;

    handleSendMessage(inputValue);
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
    <div className="flex w-full items-center gap-2 overflow-hidden rounded-lg bg-white bg-opacity-60 p-2">
      {/* TODO: Add a switch inside this div when we're adding audio capabilities */}
      {/* <div></div> */}
      <form className="relative flex-1" onSubmit={handleSubmission}>
        <TextArea
          ref={textAreaRef}
          className="w-full"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={handleInputValueChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          className="absolute bottom-[11px] right-1 flex h-8 w-8 transform items-center justify-center !p-0"
          disabled={isSubmissionDisabled}
        >
          <SendIcon className="text-primary-foreground" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
