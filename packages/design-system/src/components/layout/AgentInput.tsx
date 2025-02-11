import SendIcon from '@breakout/design-system/components/icons/send';
import Button from '@breakout/design-system/components/layout/button';
import TextArea from '@breakout/design-system/components/layout/textarea';
import { useEffect, useRef, useState } from 'react';
import { Message } from '@meaku/core/types/agent';

interface IProps {
  handleSendMessage: (message: string) => void;
  isAMessageBeingProcessed: boolean;
  messages: Message[];
}

const AgentInput = ({ handleSendMessage, isAMessageBeingProcessed, messages }: IProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isSubmissionDisabled = isAMessageBeingProcessed || inputValue?.length === 0;

  const handleInputValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
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
  }, [messages.length, textAreaRef, isSubmissionDisabled]);

  return (
    <div className="flex w-full items-center gap-2 overflow-hidden rounded-2xl p-2">
      {/* TODO: Add a switch inside this div when we're adding audio capabilities */}
      {/* <div></div> */}
      <form className="relative flex-1" onSubmit={handleSubmission}>
        <div className="bottom-bar-shadow z-10 flex rounded-2xl bg-white p-2">
          <TextArea
            className="border-1 p-4 rounded-xl"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={handleInputValueChange}
            onKeyDown={handleKeyDown}
            ref={textAreaRef}
          />
        </div>
        {!isSubmissionDisabled && (
          <Button
            className="absolute bottom-[12px] right-3 flex h-12 w-12 transform items-center justify-center !p-0"
            disabled={isSubmissionDisabled}
            onClick={handleSubmission}
          >
            <SendIcon className="text-primary-foreground" />
          </Button>
        )}
      </form>
    </div>
  );
};

export default AgentInput;
