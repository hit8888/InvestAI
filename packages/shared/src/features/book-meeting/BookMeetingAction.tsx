import React from 'react';
import { Button, Icons } from '@meaku/saral';
import { Message, MessageEventType } from '../../types/message';
import BlackTooltip from '../../components/BlackTooltip';

interface BookMeetingActionProps {
  isActive: boolean;
  isBookMeetingEventPresent: boolean;
  onClick: () => void;
  sendUserMessage: (message: string, overrides?: Partial<Message>) => void;
  actionId: string;
}

const BookMeetingAction: React.FC<BookMeetingActionProps> = ({
  isActive,
  onClick,
  sendUserMessage,
  isBookMeetingEventPresent,
  actionId,
}) => {
  const handleBookAMeeting = () => {
    // When clicked directly on book a meeting button, before init api initialised, below book a meeting event is not sent to the server
    // It should be in the queue, when init api is initialised, it should be sent to the server
    if (!isBookMeetingEventPresent) {
      sendUserMessage('', {
        event_type: MessageEventType.BOOK_MEETING,
      });
    }
    onClick();
  };

  const button = (
    <Button
      data-button-id={`action-${actionId}`}
      size="icon"
      variant={isActive ? 'default_active' : 'outline'}
      onClick={handleBookAMeeting}
      className={isActive ? 'rounded-2xl' : 'rounded-full'}
    >
      <Icons.Calendar className="size-5" />
    </Button>
  );

  if (isActive) {
    return button;
  }

  return <BlackTooltip content="Book a call">{button}</BlackTooltip>;
};

export default BookMeetingAction;
