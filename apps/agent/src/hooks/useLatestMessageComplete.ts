import { useMessageStore } from '../stores/useMessageStore';
import { isCompleteMessage, isTextMessage } from '@meaku/core/utils/messageUtils';
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
    console.log({ messages });
    if (!latestResponseId) return true;

    // Get all messages with the latest response ID
    const currentResponseMessages = messages.filter(
      (message) => message.response_id === latestResponseId && message.role === 'ai',
    );

    if (currentResponseMessages.length === 0) return false;

    // Check if any message is a complete stream message or a text message
    return currentResponseMessages.some((message) => isCompleteMessage(message) || isTextMessage(message));
  }, [store, latestResponseId]);

  return {
    isMessageComplete,
    latestResponseId,
  };
};

export default useLatestMessageComplete;
