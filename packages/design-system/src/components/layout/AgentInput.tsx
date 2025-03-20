import TextArea from '@breakout/design-system/components/layout/textarea';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { isStreamMessageComplete } from '@meaku/core/utils/messageUtils';
import { useEffect, useRef, useState } from 'react';
import ChatInputSendButton from './ChatInputSendButton';

interface IProps {
  handleSendMessage: (message: string) => void;
  disableMessageSend: boolean;
  messages: WebSocketMessage[];
}

const AgentInput = ({ handleSendMessage, disableMessageSend, messages }: IProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isSubmissionDisabled = disableMessageSend || inputValue?.length === 0;

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
    // if (textAreaRef.current && isSubmissionDisabled) {
    //   textAreaRef.current.blur();
    // }
    if (textAreaRef.current && lastMessage && isStreamMessageComplete(lastMessage)) {
      textAreaRef.current.focus();
    }
  }, [messages.length, textAreaRef]);

  return (
    <div className="flex w-full items-center gap-2 overflow-hidden rounded-2xl p-2">
      {/* TODO: Add a switch inside this div when we're adding audio capabilities */}
      {/* <div></div> */}
      <form className="relative flex-1" onSubmit={handleSubmission}>
        <div className="bottom-bar-shadow z-10 flex rounded-2xl bg-white p-2">
          <TextArea
            autoFocus
            className="border-1 rounded-xl p-4 pr-16"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={handleInputValueChange}
            onKeyDown={handleKeyDown}
            ref={textAreaRef}
          />
        </div>
        <ChatInputSendButton
          onClick={handleSubmission}
          showButton={!isSubmissionDisabled}
          disabled={isSubmissionDisabled}
          btnClassName="absolute bottom-[12px] right-3 flex h-12 w-12 transform items-center justify-center !p-0"
        />
      </form>
    </div>
  );
};

export default AgentInput;
