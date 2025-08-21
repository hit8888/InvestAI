import { useEffect } from 'react';
import { Message, MessageEventType } from '../types/message';
import { InitSessionResponse } from '../types/responses';
import { convertBookMeetingFormDataToFormArtifactMessage } from '../utils/common';
import useBookMeetingFormQuery from '../network/http/queries/useBookMeetingFormQuery';

interface UseFormArtifactMessageProps {
  messages: Message[];
  sessionData: InitSessionResponse | null;
  addMessage: (message: Omit<Message, 'timestamp'>) => void;
  /**
   * Event types that should be considered as artifact messages
   * Defaults to BOOK_MEETING and FORM_ARTIFACT
   */
  artifactEventTypes?: string[];
  /**
   * Whether to check for form filled messages
   * Defaults to true
   */
  checkFormFilled?: boolean;
  queryEnabled: boolean;
}

/**
 * Custom hook that manages form artifact message creation
 * Adds a form artifact message if:
 * 1. Form data exists
 * 2. No artifact messages exist for the specified event types
 * 3. Session data is available
 *
 * Optionally considers form filled messages when creating the artifact
 */
export const useFormArtifactMessage = ({
  messages,
  sessionData,
  addMessage,
  artifactEventTypes = [MessageEventType.BOOK_MEETING, MessageEventType.FORM_ARTIFACT],
  checkFormFilled = true,
  queryEnabled,
}: UseFormArtifactMessageProps) => {
  // Filter for artifact event messages
  const artifactEventMessages = messages.filter((message) => artifactEventTypes.includes(message.event_type));

  // Fetch book meeting form data for consistency
  const { data: bookMeetingFormData, isLoading: isFormDataLoading } = useBookMeetingFormQuery(
    {
      agentId: sessionData?.agent_id ?? '',
      prospectId: sessionData?.prospect_id ?? '',
    },
    {
      enabled: !!sessionData?.agent_id && queryEnabled && artifactEventMessages.length === 0,
    },
  );

  useEffect(() => {
    if (!bookMeetingFormData || !sessionData?.session_id) {
      return;
    }

    // Check if any artifact messages exist
    if (artifactEventMessages.length > 0) {
      return;
    }

    // Find form filled message if checking is enabled
    let formFilledMessage: Message | undefined;
    if (checkFormFilled) {
      formFilledMessage = messages.find((message) => message.event_type === MessageEventType.FORM_FILLED);
    }

    // Create and add the form artifact message
    const formArtifactMessage = convertBookMeetingFormDataToFormArtifactMessage(
      bookMeetingFormData,
      sessionData?.session_id,
      formFilledMessage?.response_id,
    );

    addMessage(formArtifactMessage);
  }, [bookMeetingFormData, messages, sessionData, addMessage, artifactEventTypes, checkFormFilled]);

  return {
    isFormDataLoading,
  };
};
