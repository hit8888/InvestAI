import SendIcon from '@breakout/design-system/components/icons/send';
import Button from '@breakout/design-system/components/layout/button';
import TextArea from '@breakout/design-system/components/layout/textarea';
import useAutoResizeTextArea from '@breakout/design-system/hooks/useAutoResizeTextArea';
import { useState } from 'react';

interface IProps {
  handleOnChange: () => void;
  handleSendMessage: (message: string) => void;
  isAMessageBeingProcessed: boolean;
}

const INITIAL_INPUT_HEIGHT = 56; // px
const MAX_INPUT_HEIGHT = 100; // px

const ChatInput = ({ handleOnChange, handleSendMessage, isAMessageBeingProcessed }: IProps) => {
  const [inputValue, setInputValue] = useState<string>('');
  const textAreaRef = useAutoResizeTextArea({
    textAreaValue: inputValue,
    initialHeight: INITIAL_INPUT_HEIGHT,
    maxHeight: MAX_INPUT_HEIGHT,
  });

  const isSubmissionDisabled = isAMessageBeingProcessed || inputValue?.length === 0;

  const handleInputValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    handleOnChange();
  };

  const handleSubmission = () => {
    if (isSubmissionDisabled) return;

    handleSendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isShiftKeyPressed = e.shiftKey;
    const isEnterKeyPressed = e.key === 'Enter' || e.key === 'Return';

    if (!isShiftKeyPressed && isEnterKeyPressed) {
      e.preventDefault();
      handleSubmission();
    }
  };

  return (
    <div className="flex w-full items-center gap-2 overflow-hidden rounded-lg bg-gray-100 p-2">
      {/* TODO: Add a switch inside this div when we're adding audio capabilities */}
      {/* <div></div> */}
      <form className="relative flex-1" onSubmit={handleSubmission}>
        <div className="z-10 rounded-2xl bg-white p-4">
          <TextArea
            ref={textAreaRef}
            className=" w-full rounded-xl border-2 border-gray-200 p-4"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={handleInputValueChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        {!isSubmissionDisabled && (
          <Button
            type="submit"
            className="absolute bottom-[26px] right-5 flex h-12 w-12 transform items-center justify-center !p-0"
            disabled={isSubmissionDisabled}
          >
            <SendIcon className="text-primary-foreground" />
          </Button>
        )}
      </form>
    </div>
  );
};

export default ChatInput;
