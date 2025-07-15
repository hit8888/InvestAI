import SendIcon from '@breakout/design-system/components/icons/send';
import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useState } from 'react';
import TextArea from '@breakout/design-system/components/TextArea/index';
import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import { useMessageStore } from '../../hooks/useMessageStore';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { LogOut, LoaderCircle } from 'lucide-react';
import Button from '@breakout/design-system/components/Button/index';
import { AdminConversationJoinStatus } from '@meaku/core/types/index';
import { SendAdminMessageFn } from '../../hooks/useAdminConversationWebSocket';
import AttachmentPopover from './AttachmentPopover';
import AttachmentSelectionDialog from './AttachmentSelectionDialog';
import { ActiveConversationAttachmentOption } from '../../utils/admin-types';

type ChatInputContainerProps = {
  onSendMessage: SendAdminMessageFn;
  onAIResponseGenerationRequest: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
};

type ExitButtonProps = {
  onExit: () => void;
};

type JoinButtonsProps = {
  status: AdminConversationJoinStatus;
  onJoin: () => void;
  onClose?: () => void;
};

export const ExitButton = ({ onExit }: ExitButtonProps) => (
  <Button onClick={onExit} variant="destructive_secondary" size="small" rightIcon={<LogOut size={16} />}>
    Exit Convo
  </Button>
);

export const JoinButtons = ({ status, onJoin, onClose }: JoinButtonsProps) => {
  const isPending = status === AdminConversationJoinStatus.PENDING;

  return (
    <div className="flex gap-2">
      <Button onClick={onJoin} variant="primary" size="small" disabled={isPending} className="h-9 w-14">
        {isPending ? <LoaderCircle size={16} className="animate-spin" /> : 'Join'}
      </Button>
      <Button onClick={onClose} variant="destructive_secondary" size="small">
        Close
      </Button>
    </div>
  );
};

const AdminChatInput = ({
  onSendMessage,
  onAIResponseGenerationRequest,
  disabled = false,
  children,
}: ChatInputContainerProps) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedAttachmentOption, setSelectedAttachmentOption] = useState<ActiveConversationAttachmentOption>(
    ActiveConversationAttachmentOption.NONE,
  );
  const aiSuggestionMessage = useMessageStore((state) => state.aiSuggestionMessage);
  const setAISuggestionMessage = useMessageStore((state) => state.setAISuggestionMessage);
  const { isGeneratingAIResponse } = useJoinConversationStore();

  useEffect(() => {
    if (aiSuggestionMessage && !disabled) {
      setInputValue(aiSuggestionMessage);
      setAISuggestionMessage('');
    }
  }, [aiSuggestionMessage, setAISuggestionMessage, disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!disabled) {
      setInputValue(e.target.value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled) return;

    const isShiftKeyPressed = event.shiftKey;
    const isEnterKeyPressed = event.key === 'Enter' || event.key === 'Return';

    if (!isShiftKeyPressed && isEnterKeyPressed) {
      event.preventDefault();
      handleFormSubmission();
    }
  };

  const handleFormSubmission = () => {
    if (disabled) return;

    const trimmedInputValue = inputValue.trim();

    if (trimmedInputValue.length <= 0) return;

    onSendMessage({
      content: trimmedInputValue,
    });
    setInputValue('');
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!disabled) {
      handleFormSubmission();
    }
  };

  const handleAIResponseGenerationRequest = () => {
    if (disabled || isGeneratingAIResponse) return;
    onAIResponseGenerationRequest();
  };

  const handleAttachmentOptionSelect = (option: ActiveConversationAttachmentOption) => {
    setSelectedAttachmentOption(option);
  };

  const handleCloseDialog = () => {
    setSelectedAttachmentOption(ActiveConversationAttachmentOption.NONE);
  };

  const tooltipText = isGeneratingAIResponse ? 'Drafting AI response...' : 'Let AI draft a reply';

  return (
    <div className="flex w-full items-center gap-4">
      <div className={cn('flex flex-grow items-center gap-3 rounded-xl border border-gray-300 bg-white p-3')}>
        {!disabled && (
          <TooltipWrapperDark
            trigger={
              <div
                className={cn('cursor-pointer', disabled && 'cursor-not-allowed')}
                onClick={handleAIResponseGenerationRequest}
              >
                <AiSparklesIcon
                  className={cn('h-6 w-5', isGeneratingAIResponse && 'animate-bounce', disabled && 'text-gray-400')}
                />
              </div>
            }
            content={tooltipText}
            showTooltip={!disabled}
          />
        )}
        <form onSubmit={onSubmit} className="flex w-full items-center gap-3">
          <TextArea
            autoFocus={!disabled}
            initialHeight={36}
            disabled={disabled}
            className={cn(
              `flex w-full items-center border-none bg-transparent p-2
            placeholder:text-gray-400 focus:border-none focus:outline-none focus:ring-0`,
              disabled && 'cursor-not-allowed',
            )}
            placeholder="Type your message here..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {inputValue && !disabled && (
            <button
              type="submit"
              className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors duration-300 ease-in-out hover:bg-primary/80"
            >
              <SendIcon className="text-primary-foreground" />
            </button>
          )}
        </form>
        <AttachmentPopover disabled={disabled} onAttachmentOptionSelect={handleAttachmentOptionSelect} />
      </div>
      <AttachmentSelectionDialog
        selectedOption={selectedAttachmentOption}
        onSendMessage={onSendMessage}
        onClose={handleCloseDialog}
      />
      {children}
    </div>
  );
};

export default AdminChatInput;
