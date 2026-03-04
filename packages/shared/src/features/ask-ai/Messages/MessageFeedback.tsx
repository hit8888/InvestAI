import React, { useState } from 'react';
import { cn } from '@neuraltrade/saral';
import { Button } from '@neuraltrade/saral';
import { Popover, PopoverContent, PopoverTrigger } from '@neuraltrade/saral';
import { TextArea, LucideIcon } from '@neuraltrade/saral';
import { Message, Message as MessageType } from '../../../types/message';
import { usePopoverPortal } from '../../../hooks/usePortal';
import useResponseFeedback from '@neuraltrade/core/queries/mutation/useResponseFeedback';
import { ViewType } from '@neuraltrade/core/types/common';

interface MessageFeedbackProps {
  message: Message;
  onFeedbackSubmit?: (feedback: { type: 'good' | 'bad'; comment?: string }) => void;
}

type FeedbackState = {
  type: 'good' | 'bad' | null;
  isPopoverOpen: boolean;
  comment: string;
  isSubmitted: boolean;
};

export const MessageFeedback: React.FC<MessageFeedbackProps> = ({ message, onFeedbackSubmit }) => {
  const { portalContainer, getZIndexClass } = usePopoverPortal();
  const [state, setState] = useState<FeedbackState>({
    type: null,
    isPopoverOpen: false,
    comment: '',
    isSubmitted: false,
  });

  const handleFeedbackClick = (type: 'good' | 'bad') => {
    setState({
      type,
      isPopoverOpen: true,
      comment: '',
      isSubmitted: false,
    });
  };

  const resetState = () => {
    setState({
      type: null,
      isPopoverOpen: false,
      comment: '',
      isSubmitted: false,
    });
  };

  const { mutate: handlePostResponseFeedback } = useResponseFeedback();

  const getMessageContent = (message: MessageType): string => {
    if (message.event_data && typeof message.event_data === 'object') {
      if ('content' in message.event_data && typeof message.event_data.content === 'string') {
        return message.event_data.content;
      }
    }
    return '';
  };

  const handleSubmit = async () => {
    if (state.type && onFeedbackSubmit) {
      onFeedbackSubmit({
        type: state.type,
        comment: state.comment.trim() || undefined,
      });
    }

    if (state.type) {
      handlePostResponseFeedback({
        viewType: ViewType.USER,
        sessionId: message.session_id.toString(),
        payload: {
          response_id: message.response_id.toString(),
          positive_feedback: state.type === 'good',
          category: '', // You can add category selection if needed
          remarks: state.comment.trim() || '',
          user_message: '', // You might need to pass the user message if available
          ai_message: getMessageContent(message),
        },
      });

      setState((prev) => ({
        ...prev,
        isSubmitted: true,
        isPopoverOpen: false,
        comment: '',
      }));
    }
  };

  // Only show for AI messages
  if (message.role !== 'ai') {
    return null;
  }

  const renderFeedbackButton = (type: 'good' | 'bad') => {
    const isSelected = state.type === type;
    const icon = type === 'good' ? 'thumbs-up' : 'thumbs-down';
    const label = type === 'good' ? 'Good' : 'Bad';

    return (
      <Popover
        open={state.isPopoverOpen && state.type === type}
        onOpenChange={(open) => {
          if (!open && !state.isSubmitted) {
            resetState();
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleFeedbackClick(type)}
            className={cn('flex items-center gap-2 px-2 py-1 h-8 rounded-lg border transition-all', {
              'bg-[#EAECF0] border-transparent text-[#101828]': isSelected,
              'bg-[#FCFCFD] border-[#EAECF0] text-[#475467]': !isSelected,
            })}
          >
            <LucideIcon
              name={icon}
              strokeWidth={2}
              className={cn('h-3.5 w-3.5', isSelected ? 'text-[#101828]' : 'text-[#475467]')}
            />
            <span className="text-xs font-medium">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            'bg-white border border-gray-200 rounded-2xl shadow-lg w-[316px] p-3 pointer-events-auto',
            getZIndexClass(),
          )}
          portalContainer={portalContainer}
          side="bottom"
          align="start"
          sideOffset={8}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <TextArea
              required
              placeholder="Tell us what you liked about the response or how it could be improved."
              value={state.comment}
              onChange={(e) => setState((prev) => ({ ...prev, comment: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  if (state.comment.trim()) {
                    handleSubmit();
                  }
                }
              }}
              className="resize-none mb-4"
              style={{
                height: '72',
              }}
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!state.comment.trim()}
                size="sm"
                className="text-white border-2 border-white/24 px-3 py-2 h-8 rounded-lg flex items-center gap-2"
              >
                <span className="text-sm font-semibold">Send</span>
                <LucideIcon name="send" className="h-3.5 w-3.5 text-white" />
              </Button>
            </div>
          </form>
        </PopoverContent>
      </Popover>
    );
  };

  if (state.isSubmitted) {
    return (
      <div className="relative flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1 h-8 rounded-lg bg-green-50 border border-green-200">
          <LucideIcon name="check-circle" className="h-3.5 w-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-700">Thank you for your feedback!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2">
      {renderFeedbackButton('good')}
      {renderFeedbackButton('bad')}
    </div>
  );
};
