import SendIcon from '@breakout/design-system/components/icons/send';
import { cn } from '@breakout/design-system/lib/cn';
import { useState } from 'react';
import AICopilotInsideInputBar from './AICopilotInsideInputBar';
import TextArea from '@breakout/design-system/components/layout/textarea';

const InputBarAfterAdminJoinConversation = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleClickOnAIResponseMessage = (value: string) => {
    setInputValue(value);
  };

  const handleFormSubmission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedInputValue = inputValue.trim();
    if (trimmedInputValue.length <= 0) return;
    // handleSendUserMessage({ message: { content: trimmedInputValue }, message_type: 'TEXT' });
    setInputValue('');
  };

  return (
    <div className="flex w-full items-start gap-2 self-stretch rounded-2xl border border-gray-200 bg-white p-2">
      <div
        className={cn(
          'flex w-full items-center gap-3 rounded-xl bg-gray-25 pb-2 pl-4 pr-2 pt-1 ring-1 ring-primary/40',
          {
            'ring-2 ring-primary/20': inputValue,
          },
        )}
      >
        <AICopilotInsideInputBar handleClickOnAIResponseMessage={handleClickOnAIResponseMessage} />
        <form onSubmit={handleFormSubmission} className="flex w-full items-center gap-3">
          <TextArea
            className={cn(
              `flex w-full items-center border-none bg-transparent px-0 py-2.5 
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
    </div>
  );
};

export default InputBarAfterAdminJoinConversation;
