import { Button, Icons, Input } from '@meaku/saral';
import { useState } from 'react';
import { Message } from '../../types/message';

interface AskAiInputProps {
  disabled: boolean;
  sendUserMessage?: (message: string, overrides?: Partial<Message>) => void;
}

export const AskAiInput = ({ disabled, sendUserMessage }: AskAiInputProps) => {
  const [message, setMessage] = useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendUserMessage?.(message);
    setMessage('');
  };

  const isInputValuePresent = message.trim() !== '';
  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2 p-3">
      <Input
        placeholder="Type your message..."
        name="message"
        className="h-[56px] rounded-xl border py-2 pr-14 pl-4 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0"
        disabled={disabled}
        autoComplete="off"
        aria-autocomplete="none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button
        className="absolute size-10 right-5 px-2 rounded-lg"
        size="xs"
        disabled={disabled || !isInputValuePresent}
      >
        <Icons.SendHorizonal className="size-5" />
      </Button>
    </form>
  );
};
