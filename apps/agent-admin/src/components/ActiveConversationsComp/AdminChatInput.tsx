import SendIcon from '@breakout/design-system/components/icons/send';
import { cn } from '@breakout/design-system/lib/cn';
import { useState } from 'react';
import AICopilotInsideInputBar from './AICopilotInsideInputBar';
import TextArea from '@breakout/design-system/components/layout/textarea';
import { WebSocketTextMessage } from '../../hooks/useJoinConversationWebSocket';

type AdminChatInputProps = {
  onSendMessage: (message: WebSocketTextMessage) => void;
};

const AdminChatInput = ({ onSendMessage }: AdminChatInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleClickOnAIResponseMessage = (value: string) => {
    setInputValue(value);
  };

  const handleFormSubmission = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedInputValue = inputValue.trim();

    if (trimmedInputValue.length <= 0) return;

    onSendMessage({ message: { content: trimmedInputValue }, message_type: 'TEXT' });
    setInputValue('');
  };

  return (
    <div className="flex w-full items-center gap-2">
      <AICopilotInsideInputBar handleClickOnAIResponseMessage={handleClickOnAIResponseMessage} />
      <form onSubmit={handleFormSubmission} className="flex w-full items-center gap-3">
        <TextArea
          className={cn(
            `flex w-full items-center border-none bg-transparent px-2 py-0
            placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-0`,
            {
              'max-h-20': inputValue,
            },
          )}
          placeholder="Type your message here..."
          value={inputValue}
          onChange={handleInputChange}
        />
        {inputValue && (
          <button
            type="submit"
            className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80"
          >
            <SendIcon className="text-primary-foreground" />
          </button>
        )}
      </form>
    </div>
  );
};

export default AdminChatInput;
