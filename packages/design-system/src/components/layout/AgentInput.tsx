import TextArea from '@breakout/design-system/components/layout/textarea';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { isStreamMessageComplete } from '@meaku/core/utils/messageUtils';
import { useEffect, useRef, useState } from 'react';
import SendButtonWithTooltip from './SendButtonWithTooltip';
import ChatInputSendButton from './ChatInputSendButton';
import { AGENT_INPUT_SEND_BUTTON_TOOLTIP_TEXT } from '@meaku/core/constants/index';
import PoweredByBreakout from './PoweredByBreakout';
import { cn } from '../../lib/cn';

interface IProps {
  handleSendMessage: (message: string) => void;
  disableMessageSend: boolean;
  messages: WebSocketMessage[];
  isCollapsible: boolean;
}

const AgentInput = ({ handleSendMessage, disableMessageSend, messages, isCollapsible }: IProps) => {
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
    <div className="input-bar-bg flex w-full flex-col items-center gap-2 rounded-b-2xl p-4 pb-2">
      <form className="relative w-full flex-1" onSubmit={handleSubmission}>
        <div className="z-10 flex rounded-2xl border border-gray-200 bg-white p-1">
          <TextArea
            autoFocus={isCollapsible}
            className={cn(
              'rounded-xl border py-3 pl-3 pr-16 text-base text-customPrimaryText placeholder:text-gray-400',
              {
                'ring-2 ring-primary/60 focus:ring-2 focus:ring-primary/60': inputValue.length > 0,
              },
            )}
            placeholder="Type your message here..."
            value={inputValue}
            onChange={handleInputValueChange}
            onKeyDown={handleKeyDown}
            ref={textAreaRef}
          />
        </div>
        <SendButtonWithTooltip
          showTooltip={conditionForShowingTooltipAndDisabledButton}
          tooltipText={AGENT_INPUT_SEND_BUTTON_TOOLTIP_TEXT}
        >
          <ChatInputSendButton
            showButton={!isSendButtonDisabled}
            onClick={handleSubmission}
            disabled={conditionForShowingTooltipAndDisabledButton}
            btnClassName="absolute bottom-2 right-3 flex h-12 w-12 transform items-center justify-center !p-0"
          />
        </SendButtonWithTooltip>
      </form>
      {/* Powered By Breakout - Only visible when the agent is open for all conditions */}
      <PoweredByBreakout />
    </div>
  );
};

export default AgentInput;
