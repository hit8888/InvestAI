import { Button, LucideIcon, Input } from '@meaku/saral';
import { useCallback, useState } from 'react';
import { Message, MessageEventType } from '../../types/message';
import { useDebouncedTyping } from '../../hooks/useDebouncedTyping';

interface AskAiInputProps {
  disabled: boolean;
  sendUserMessage?: (message: string, overrides?: Partial<Message>) => void;
  hasActiveAdminSession?: boolean;
}

export const AskAiInput = ({ disabled, sendUserMessage, hasActiveAdminSession }: AskAiInputProps) => {
  const [message, setMessage] = useState('');

  const sendTypingEvent = useCallback(
    (isTyping: boolean) => {
      if (isTyping && hasActiveAdminSession) {
        sendUserMessage?.('', {
          event_data: {},
          event_type: MessageEventType.USER_TYPING,
        });
      }
    },
    [sendUserMessage, hasActiveAdminSession],
  );

  const { debouncedTypingDetection, stopTyping } = useDebouncedTyping({
    onSendTypingEvent: sendTypingEvent,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendUserMessage?.(message);
    setMessage('');
    stopTyping();
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
        onChange={(e) => {
          setMessage(e.target.value);
          debouncedTypingDetection();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleSubmit(e as any);
          }
        }}
      />
      <Button
        className="absolute size-10 right-5 px-2 rounded-lg"
        size="xs"
        disabled={disabled || !isInputValuePresent}
      >
        <LucideIcon name="send-horizontal" className="size-5" />
      </Button>
    </form>
  );
};
