import { Button, LucideIcon, TextArea } from '@meaku/saral';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Message, MessageEventType } from '../../types/message';
import { useDebouncedTyping } from '../../hooks/useDebouncedTyping';

interface AskAiInputProps {
  disabled: boolean;
  sendUserMessage?: (message: string, overrides?: Partial<Message>) => void;
  hasActiveAdminSession?: boolean;
}

export const AskAiInput = ({ disabled, sendUserMessage, hasActiveAdminSession }: AskAiInputProps) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (!disabled) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  const isInputValuePresent = message.trim() !== '';
  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2 p-3">
      <TextArea
        ref={textareaRef}
        placeholder="Type your message..."
        name="message"
        className="text-foreground rounded-xl border pr-14 pl-4 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 max-lg:text-base"
        disabled={disabled}
        autoComplete="off"
        aria-autocomplete="none"
        value={message}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setMessage(e.target.value);
          debouncedTypingDetection();
        }}
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
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
