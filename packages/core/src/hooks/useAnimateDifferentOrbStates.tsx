import { useCallback, useEffect, useRef } from 'react';
import { AIResponse } from '../types';
import { getProcessingMessageSequence, setMessageIndexForAddingAIMessage } from '../utils';

const PROCESSING_MESSAGE_CHANGE_INTERVAL = 4000;

type useAnimateDifferentOrbStatesProps = {
  handleAddAIMessage: (response: AIResponse) => void;
}
const useAnimateDifferentOrbStates = ({handleAddAIMessage}: useAnimateDifferentOrbStatesProps) => {
  const processingMessageInterval = useRef<NodeJS.Timeout | null>(null);

  const PROCESSING_MESSAGE_SEQUENCE = getProcessingMessageSequence();

  const getAIMessage = useCallback(
    (messageIndex: number, messageId: string) => {
      return {
        response_id: messageId,
        message: messageIndex === -1 ? `Thinking` : PROCESSING_MESSAGE_SEQUENCE[messageIndex],
        documents: [],
        is_complete: false,
        is_loading: true,
        suggested_questions: [],
        analytics: {},
        artifacts: [],
        demo_available: false,
        role: 'ai' as 'user' | 'ai',
      };
    },
    [PROCESSING_MESSAGE_SEQUENCE],
  );

  const handleAnimatedOrb = (messageId: string) => {
    let messageIndex = -1;

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
