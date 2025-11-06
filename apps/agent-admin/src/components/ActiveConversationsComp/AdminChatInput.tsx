import SendIcon from '@breakout/design-system/components/icons/send';
import { cn } from '@breakout/design-system/lib/cn';
import { useEffect, useState, useCallback, useRef } from 'react';
import TextArea from '@breakout/design-system/components/TextArea/index';
import AiSparklesIcon from '@breakout/design-system/components/icons/ai-sparkles-icon';
import { useMessageStore } from '../../hooks/useMessageStore';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { LoaderCircle, ArrowLeft, Plus } from 'lucide-react';
import Button from '@breakout/design-system/components/Button/index';
import { AdminConversationJoinStatus } from '@meaku/core/types/index';
import { SendAdminMessageFn } from '../../hooks/useAdminConversationWebSocket';
import AttachmentPopover from './AttachmentPopover';
import AttachmentSelectionDialog from './AttachmentSelectionDialog';

import { ActiveConversationAttachmentOption } from '../../utils/admin-types';
import { useDebouncedTyping } from '@meaku/shared/hooks/useDebouncedTyping';
import { useAuth } from '../../context/AuthProvider';

type ChatInputContainerProps = {
  onSendMessage: SendAdminMessageFn;
  onAIResponseGenerationRequest: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  onTypingChange?: (isTyping: boolean) => void;
};

type JoinButtonsProps = {
  status: AdminConversationJoinStatus;
  onJoin: () => void;
  onClose?: () => void;
  disableJoinButton?: boolean;
};

export const JoinButtons = ({ status, onJoin, onClose, disableJoinButton = false }: JoinButtonsProps) => {
  const isPending = status === AdminConversationJoinStatus.PENDING;

  return (
    <div className="flex gap-4">
      <Button
        onClick={onClose}
        variant="destructive_secondary"
        buttonStyle="leftIcon"
        className="font-normal"
        leftIcon={<ArrowLeft size={16} />}
      >
        Back to All Chats
      </Button>
      <Button
        onClick={onJoin}
        variant="primary"
        disabled={isPending || disableJoinButton}
        buttonStyle="rightIcon"
        className="font-normal"
        rightIcon={isPending ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}
      >
        {isPending ? 'Joining...' : 'Join Conversation'}
      </Button>
    </div>
  );
};

const AdminChatInput = ({
  onSendMessage,
  onAIResponseGenerationRequest,
  disabled = false,
  children,
  onTypingChange,
}: ChatInputContainerProps) => {
  const { userInfo } = useAuth();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState(userInfo?.default_hitl_join_message || '');
  const [selectedAttachmentOption, setSelectedAttachmentOption] = useState<ActiveConversationAttachmentOption>(
    ActiveConversationAttachmentOption.NONE,
  );
  const aiSuggestionMessage = useMessageStore((state) => state.aiSuggestionMessage);
  const setAISuggestionMessage = useMessageStore((state) => state.setAISuggestionMessage);
  const { isGeneratingAIResponse } = useJoinConversationStore();

  const sendTypingEvent = useCallback(
    (isTyping: boolean) => {
      if (isTyping) {
        // Send ADMIN_TYPING event
        onSendMessage({
          event_type: 'ADMIN_TYPING',
          content: '',
          event_data: {},
        });
      }
    },
    [onSendMessage],
  );

  const { debouncedTypingDetection, stopTyping } = useDebouncedTyping({
    onTypingChange,
    onSendTypingEvent: sendTypingEvent,
  });

  useEffect(() => {
    if (aiSuggestionMessage && !disabled) {
      setInputValue(aiSuggestionMessage);
      setAISuggestionMessage('');
    }
  }, [aiSuggestionMessage, setAISuggestionMessage, disabled]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!disabled) {
      setInputValue(e.target.value);
      debouncedTypingDetection();
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

    // Clear typing indicator when sending message
    stopTyping();

    // Send the actual message
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

  useEffect(() => {
    if (!disabled && !isGeneratingAIResponse && textAreaRef.current) {
      textAreaRef.current?.focus();
      const length = textAreaRef.current.value.length;
      textAreaRef.current.setSelectionRange(length, length);
    }
  }, [disabled, isGeneratingAIResponse]);

  return (
    <div className="flex w-full items-center gap-4 p-2 pt-0">
      <div className={cn('flex flex-grow items-center gap-3 rounded-xl border border-gray-300 bg-white p-3')}>
        {!disabled && (
          <TooltipWrapperDark
            trigger={
              <button
                type="button"
                className={cn(
                  'group flex cursor-pointer items-center justify-center rounded-lg border border-white bg-gray-50 px-2 py-1.5',
                  disabled && 'cursor-not-allowed',
                )}
                onClick={handleAIResponseGenerationRequest}
              >
                <AiSparklesIcon
                  className={cn(
                    'h-6 w-5 transition-all duration-300',
                    'group-hover:scale-125',
                    isGeneratingAIResponse && 'scale-pulse',
                    disabled && 'text-gray-400',
                  )}
                />
              </button>
            }
            content={tooltipText}
            showTooltip={!disabled}
            tooltipSide="top"
            tooltipAlign="start"
            tooltipArrowClassName="left-0"
          />
        )}
        <form onSubmit={onSubmit} className="flex w-full items-center gap-3">
          <TextArea
            ref={textAreaRef}
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
