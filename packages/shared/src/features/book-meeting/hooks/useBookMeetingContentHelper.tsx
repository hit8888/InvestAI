import { useEffect, useMemo } from 'react';
import { MessageEventType } from '../../../types/message';
import { useCommandBarStore } from '../../../stores';
import { checkIfSubmissionEventsPresent } from '../../../utils/common';
import { useFormArtifactMessage } from '../../../hooks/useFormArtifactMessage';
import { BOOK_MEETING_EVENTS } from '../utils';

type UseBookMeetingContentHelperProps = {
  onClose: (() => void) | undefined;
};

const CLOSE_DELAY = 5000;

const useBookMeetingContentHelper = ({ onClose }: UseBookMeetingContentHelperProps) => {
  const { messages, sessionData, addMessage } = useCommandBarStore();

  const shouldBookMeetingContentClose = useMemo(() => !checkIfSubmissionEventsPresent(messages, true), [messages]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (shouldBookMeetingContentClose && onClose) {
      timeout = setTimeout(() => {
        onClose();
      }, CLOSE_DELAY);
    }
    return () => clearTimeout(timeout);
  }, [shouldBookMeetingContentClose, onClose]);

  const filteredMessages = useMemo(
    () =>
      messages.filter((message) =>
        BOOK_MEETING_EVENTS.includes(message.event_type as (typeof BOOK_MEETING_EVENTS)[number]),
      ),
    [messages],
  );

  const hasFilteredMessages = filteredMessages.length > 0;

  // Add form artifact message if it doesn't exist, when directly clicked on book meeting module and get the data from api
  const { isFormDataLoading } = useFormArtifactMessage({
    messages: filteredMessages,
    sessionData,
    addMessage,
    artifactEventTypes: [MessageEventType.BOOK_MEETING, MessageEventType.FORM_ARTIFACT],
    checkFormFilled: true,
    queryEnabled: !hasFilteredMessages,
  });

  return {
    isFormDataLoading,
    filteredMessages,
    hasFilteredMessages,
  };
};

export default useBookMeetingContentHelper;
