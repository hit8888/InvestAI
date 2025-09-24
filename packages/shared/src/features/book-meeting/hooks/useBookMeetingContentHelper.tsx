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
  const { getRenderableMessages, sessionData, addMessage, config } = useCommandBarStore();
  const messages = getRenderableMessages();

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
    moduleId: config.command_bar?.modules.find((m) => m.module_type === 'BOOK_MEETING')?.id ?? 2, // BOOK_MEETING Module ID
    artifactEventTypes: [MessageEventType.BOOK_MEETING, MessageEventType.FORM_ARTIFACT, MessageEventType.FORM_FILLED],
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
