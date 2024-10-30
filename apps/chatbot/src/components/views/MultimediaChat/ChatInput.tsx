import { useState } from "react";
import useAutoResizeTextArea from "../../../../../../packages/ui/src/hooks/useAutoResizeTextArea";
import SendIcon from "@meaku/ui/components/icons/send";
import Button from "@meaku/ui/components/layout/button";
import TextArea from "@meaku/ui/components/layout/textarea";

interface IProps {
  handleOnChange: () => void;
  handleSendMessage: (message: string) => void;
  isAMessageBeingProcessed: boolean;
}

const INITIAL_INPUT_HEIGHT = 40; // px
const MAX_INPUT_HEIGHT = 100; // px

const ChatInputNew = (props: IProps) => {
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
    <div className="ui-flex ui-w-full ui-items-center ui-gap-2 ui-overflow-hidden ui-rounded-lg ui-bg-white ui-bg-opacity-60 ui-p-2">
      {/* TODO: Add a switch inside this div when we're adding audio capabilities */}
      {/* <div></div> */}
      <form className="ui-relative ui-flex-1" onSubmit={handleSubmission}>
        <TextArea
          ref={textAreaRef}
          className="ui-w-full"
          placeholder="Type your message here..."
          value={inputValue}
          onChange={handleInputValueChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          className="ui-absolute ui-bottom-[11px] ui-right-1 ui-flex ui-h-8 ui-w-8 ui-transform ui-items-center ui-justify-center !ui-p-0"
          disabled={isSubmissionDisabled}
        >
          <SendIcon className="ui-text-primary-foreground" />
        </Button>
      </form>
    </div>
  );
};

export default ChatInputNew;
