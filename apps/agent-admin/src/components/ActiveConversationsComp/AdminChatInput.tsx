import SendIcon from '@breakout/design-system/components/icons/send';
import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useState } from 'react';
import TextArea from '@breakout/design-system/components/TextArea/index';
import ActiveConvJoinAICopilotIcon from '@breakout/design-system/components/icons/join-conv-aicopilot-icon';
import { useMessageStore } from '../../hooks/useMessageStore';

type AdminChatInputProps = {
  onSendMessage: (message: string) => void;
  onAIResponseGenerationRequest: () => void;
};

const AdminChatInput = ({ onSendMessage, onAIResponseGenerationRequest }: AdminChatInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const aiSuggestionMessage = useMessageStore((state) => state.aiSuggestionMessage);

  useEffect(() => {
    if (aiSuggestionMessage) {
      setInputValue(aiSuggestionMessage);
    }
  }, [aiSuggestionMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isShiftKeyPressed = event.shiftKey;
    const isEnterKeyPressed = event.key === 'Enter' || event.key === 'Return';

    if (!isShiftKeyPressed && isEnterKeyPressed) {
      event.preventDefault();
      handleFormSubmission();
    }
  };

  const handleFormSubmission = () => {
    const trimmedInputValue = inputValue.trim();

    if (trimmedInputValue.length <= 0) return;

    onSendMessage(trimmedInputValue);
    setInputValue('');
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleFormSubmission();
  };

  return (
    <div className="flex w-full items-center">
      <div className="cursor-pointer px-2 py-1" onClick={onAIResponseGenerationRequest}>
        <ActiveConvJoinAICopilotIcon className="h-6 w-5" />
      </div>

      <form onSubmit={onSubmit} className="flex w-full items-center gap-3">
        <TextArea
          autoFocus={true}
          initialHeight={36}
          className={cn(
            `flex w-full items-center border-none bg-transparent p-2
            placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-0`,
          )}
          placeholder="Type your message here..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
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
