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
        className="h-[52px] rounded-xl !border-muted py-[6px] pr-12 focus-visible:ring-1 focus-visible:ring-gray-200 focus-visible:ring-offset-0"
        disabled={disabled}
        autoComplete="off"
        aria-autocomplete="none"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Button className="absolute right-5 px-2" size="xs" disabled={disabled || !isInputValuePresent}>
        <Icons.SendHorizonal className="h-4 w-4" />
      </Button>
    </form>
  );
};
