import SendIcon from '@breakout/design-system/components/icons/send';
import Button from '@breakout/design-system/components/layout/button';
import TextArea from '@breakout/design-system/components/layout/textarea';
import useAutoResizeTextArea from '@breakout/design-system/hooks/useAutoResizeTextArea';
import { useEffect, useState } from 'react';
import { Message } from '@meaku/core/types/chat';

interface IProps {
  handleOnChange: () => void;
  handleSendMessage: (message: string) => void;
  isAMessageBeingProcessed: boolean;
  messages: Message[];
}

const INITIAL_INPUT_HEIGHT = 40; // px
const MAX_INPUT_HEIGHT = 100; // px

const ChatInput = ({ handleOnChange, handleSendMessage, isAMessageBeingProcessed, messages }: IProps) => {
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

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (textAreaRef.current && isSubmissionDisabled) {
      textAreaRef.current.blur();
    }
    if (textAreaRef.current && lastMessage && lastMessage.is_complete) {
      textAreaRef.current.focus();
    }
  }, [messages, textAreaRef, isSubmissionDisabled]);

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
          autoFocus
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
