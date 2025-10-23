import React, { useState } from 'react';
import { cn } from '@meaku/saral';
import { Button } from '@meaku/saral';
import { Popover, PopoverContent, PopoverTrigger } from '@meaku/saral';
import { TextArea, LucideIcon } from '@meaku/saral';
import { Message, Message as MessageType } from '../../../types/message';
import { usePopoverPortal } from '../../../hooks/usePortal';
import useResponseFeedback from '@meaku/core/queries/mutation/useResponseFeedback';
import { ViewType } from '@meaku/core/types/common';

interface MessageFeedbackProps {
  message: Message;
  onFeedbackSubmit?: (feedback: { type: 'good' | 'bad'; comment?: string }) => void;
}

export const MessageFeedback: React.FC<MessageFeedbackProps> = ({ message, onFeedbackSubmit }) => {
  const { portalContainer, getZIndexClass } = usePopoverPortal();
  const [feedbackType, setFeedbackType] = useState<'good' | 'bad' | null>(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFeedbackClick = (type: 'good' | 'bad') => {
    setFeedbackType(type);
    setIsPopoverOpen(true);
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
    if (feedbackType && onFeedbackSubmit) {
      onFeedbackSubmit({
        type: feedbackType,
        comment: comment.trim() || undefined,
      });
    }

    if (feedbackType) {
      handlePostResponseFeedback({
        viewType: ViewType.USER,
        sessionId: message.session_id.toString(),
        payload: {
          response_id: message.response_id.toString(),
          positive_feedback: feedbackType === 'good',
          category: '', // You can add category selection if needed
          remarks: comment.trim() || '',
          user_message: '', // You might need to pass the user message if available
          ai_message: getMessageContent(message),
        },
      });

      setIsSubmitted(true);
    }

    setIsPopoverOpen(false);
    setComment('');
  };

  // Only show for AI messages
  if (message.role !== 'ai') {
    return null;
  }

  const renderFeedbackButton = (type: 'good' | 'bad') => {
    const isSelected = feedbackType === type;
    const icon = type === 'good' ? 'thumbs-up' : 'thumbs-down';
    const label = type === 'good' ? 'Good' : 'Bad';

    return (
      <Popover open={isPopoverOpen && feedbackType === type} onOpenChange={(open) => !open && setIsPopoverOpen(false)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleFeedbackClick(type)}
            className={cn(
              'flex items-center gap-2 px-2 py-1 h-8 rounded-lg border transition-all',
              isSelected
                ? 'bg-[#FCFCFD] border-[#667085] text-[#475467] shadow-[0px_0px_0px_4px_rgba(234,236,240,1)]'
                : 'bg-[#FCFCFD] border-[#EAECF0] text-[#475467] hover:border-gray-300',
            )}
          >
            <LucideIcon name={icon} className="h-3.5 w-3.5 text-[#475467]" />
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
          <TextArea
            required
            placeholder="Tell us what you liked about the response or how it could be improved."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-16 resize-none mb-4"
          />

          <div className="flex justify-end">
            <Button
              disabled={!comment.trim()}
              size="sm"
              onClick={handleSubmit}
              className="text-white border-2 border-white/24 px-3 py-2 h-8 rounded-lg flex items-center gap-2"
            >
              <span className="text-sm font-semibold">Send</span>
              <LucideIcon name="send" className="h-3.5 w-3.5 text-white" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  if (isSubmitted) {
    return (
      <div className="relative flex items-center gap-2 pl-10 mt-2">
        <div className="flex items-center gap-2 px-3 py-1 h-8 rounded-lg bg-green-50 border border-green-200">
          <LucideIcon name="check-circle" className="h-3.5 w-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-700">Thank you for your feedback!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-2 pl-10 mt-2">
      {renderFeedbackButton('good')}
      {renderFeedbackButton('bad')}
    </div>
  );
};
