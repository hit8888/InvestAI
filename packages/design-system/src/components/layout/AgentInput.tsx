import TextArea from '@breakout/design-system/components/TextArea/index';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { isStreamMessageComplete } from '@meaku/core/utils/messageUtils';
import { useEffect, useRef, useState } from 'react';
import SendButtonWithTooltip from './SendButtonWithTooltip';
import ChatInputSendButton from './ChatInputSendButton';
import { AGENT_INPUT_SEND_BUTTON_TOOLTIP_TEXT } from '@meaku/core/constants/index';
import { cn } from '../../lib/cn';
import { useIsMobile } from '@meaku/core/contexts/DeviceManagerProvider';

interface IProps {
  handleSendMessage: (message: string) => void;
  disableMessageSend: boolean;
  messages: WebSocketMessage[];
  invertTextColor?: boolean;
}

const AgentInput = ({ handleSendMessage, disableMessageSend, messages, invertTextColor }: IProps) => {
  const isMobile = useIsMobile();
  const [inputValue, setInputValue] = useState<string>('');

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const isSendButtonDisabled = inputValue?.length === 0;

  const handleInputValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmission = () => {
    if (disableMessageSend) return;

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
    if (textAreaRef.current && lastMessage && isStreamMessageComplete(lastMessage)) {
      textAreaRef.current.focus();
    }
  }, [messages.length, textAreaRef]);

  // This condition is used to show the tooltip and disable the button when the user is typing and the AI messages is streaming
  const conditionForShowingTooltipAndDisabledButton = !isSendButtonDisabled && disableMessageSend;

  return (
    <div className={cn(['input-bar-bg flex w-full rounded-b-2xl', isMobile && 'p-0'])}>
      <form className="flex w-full items-center justify-between" onSubmit={handleSubmission}>
        <div
          className={cn(['relative z-10 flex w-full rounded-2xl', !isMobile && 'border border-gray-200 bg-white p-1'])}
        >
          <TextArea
            className={cn(
              'rounded-xl border py-3 pl-3 pr-16 text-base text-customPrimaryText ring-0 placeholder:pt-0.5 placeholder:text-gray-400 focus:ring-1 focus:ring-primary/70',
              {
                'caret-gray-400': inputValue.length === 0,
                'caret-customPrimaryText': inputValue.length > 0,
              },
            )}
            placeholder="Ask anything here..."
            value={inputValue}
            id="agent-input"
            onChange={handleInputValueChange}
            onKeyDown={handleKeyDown}
            ref={textAreaRef}
          />
          <SendButtonWithTooltip
            showTooltip={conditionForShowingTooltipAndDisabledButton}
            tooltipText={AGENT_INPUT_SEND_BUTTON_TOOLTIP_TEXT}
          >
            <ChatInputSendButton
              showButton={!isSendButtonDisabled}
              onClick={handleSubmission}
              disabled={conditionForShowingTooltipAndDisabledButton}
              btnClassName="absolute right-2 top-1/2 -translate-y-1/2 flex h-12 w-12 transform items-center justify-center !p-0"
              invertTextColor={invertTextColor}
            />
          </SendButtonWithTooltip>
        </div>
      </form>
    </div>
  );
};

export default AgentInput;
