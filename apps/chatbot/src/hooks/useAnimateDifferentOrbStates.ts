import { useCallback, useEffect, useRef } from 'react';
import { getProcessingMessageSequence, setMessageIndexForAddingAIMessage } from '../utils/common';
import { useMessageStore } from '../stores/useMessageStore';

const PROCESSING_MESSAGE_CHANGE_INTERVAL = 4000;

const useAnimateDifferentOrbStates = () => {
  const processingMessageInterval = useRef<NodeJS.Timeout | null>(null);

  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);

  const PROCESSING_MESSAGE_SEQUENCE = getProcessingMessageSequence();

  const getAIMessage = useCallback(
    (messageIndex: number, messageId: string) => {
      return {
        response_id: messageId,
        message: PROCESSING_MESSAGE_SEQUENCE[messageIndex],
        documents: [],
        is_complete: false,
        is_loading: true,
        suggested_questions: [],
        analytics: {},
        artifacts: [],
      };
    },
    [PROCESSING_MESSAGE_SEQUENCE],
  );

  const handleAnimatedOrb = (messageId: string) => {
    let messageIndex = 0;

    // Send first message immediately
    handleAddAIMessage(getAIMessage(messageIndex, messageId));

    // Start interval for remaining messages
    processingMessageInterval.current = setInterval(() => {
      if (messageIndex >= PROCESSING_MESSAGE_SEQUENCE.length) {
        clearInterval(processingMessageInterval.current as NodeJS.Timeout);
        return;
      }
      messageIndex = setMessageIndexForAddingAIMessage();
      handleAddAIMessage(getAIMessage(messageIndex, messageId));
    }, PROCESSING_MESSAGE_CHANGE_INTERVAL);
  };

  const handleStopOrbAnimation = () => {
    if (processingMessageInterval.current) {
      clearInterval(processingMessageInterval.current);
    }
  };

  useEffect(() => {
    return () => {
      if (processingMessageInterval.current) {
        clearInterval(processingMessageInterval.current);
      }
    };
  }, []); //Cleanup effect

  return { handleAnimatedOrb, handleStopOrbAnimation };
};

export { useAnimateDifferentOrbStates };
