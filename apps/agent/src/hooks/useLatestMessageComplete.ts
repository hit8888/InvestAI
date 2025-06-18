import { useMessageStore } from '../stores/useMessageStore';
import {
  hasDemoEndMessage,
  isPrimaryGoalCompletedMessage,
  isStreamMessageComplete,
  isTextMessage,
  isCtaEvent,
} from '@meaku/core/utils/messageUtils';
import { useCallback } from 'react';

const useLatestMessageComplete = () => {
  // Get the store itself, not just the state
  const store = useMessageStore;

  // Use latestResponseId from the store for reactivity
  const latestResponseId = useMessageStore((state) => state.latestResponseId);

  // Use useCallback to create a stable function reference
  const isMessageComplete = useCallback(() => {
    // Get the latest messages directly from the store when the function is called
    const messages = store.getState().messages;
    if (!latestResponseId) return true;

    const lastMessageResponseID = messages[messages.length - 1]?.response_id;
    const demoEndMessageExist = hasDemoEndMessage(messages);

    const isDemoEndLastMessage = lastMessageResponseID === demoEndMessageExist?.response_id;
    if (isDemoEndLastMessage) return true;

    // Get all messages with the latest response ID
    const currentResponseMessages = messages.filter(
      (message) => message.response_id === latestResponseId && message.role === 'ai',
    );

    if (currentResponseMessages.length === 0) return true;

    // Check if any message is a complete stream message or a text message or a user event message with event_type as PRIMARY_GOAL_COMPLETED
    return currentResponseMessages.some(
      (message) =>
        isStreamMessageComplete(message) ||
        isTextMessage(message) ||
        isPrimaryGoalCompletedMessage(message) ||
        isCtaEvent(message),
    );
  }, [store, latestResponseId]);

  return {
    isMessageComplete,
    latestResponseId,
  };
};

export default useLatestMessageComplete;
