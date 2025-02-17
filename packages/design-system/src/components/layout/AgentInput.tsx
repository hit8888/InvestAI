import SendIcon from '@breakout/design-system/components/icons/send';
import Button from '@breakout/design-system/components/layout/button';
import TextArea from '@breakout/design-system/components/layout/textarea';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useEffect, useRef, useState } from 'react';

interface IProps {
  handleSendMessage: (message: string) => void;
  isAMessageBeingProcessed: boolean;
  messages: WebSocketMessage[];
}

// Type guard for WebSocketMessage with is_complete
const isCompleteMessage = (message: WebSocketMessage): boolean => {
  return (
    'message' in message &&
    typeof message.message === 'object' &&
    message.message !== null &&
    'is_complete' in message.message &&
    typeof message.message.is_complete === 'boolean'
  );
};

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
    if (textAreaRef.current && lastMessage && isCompleteMessage(lastMessage)) {
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
            className="border-1 rounded-xl p-4 pr-16"
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
