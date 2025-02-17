import { useCallback, useEffect, useRef } from 'react';
import { WebSocketMessage } from '../types';
import { getProcessingMessageSequence, setMessageIndexForAddingAIMessage } from '../utils';

const PROCESSING_MESSAGE_CHANGE_INTERVAL = 4000;

type useAnimateDifferentOrbStatesProps = {
  handleAddAIMessage: (response: WebSocketMessage) => void;
};
const useAnimateDifferentOrbStates = ({ handleAddAIMessage }: useAnimateDifferentOrbStatesProps) => {
  const processingMessageInterval = useRef<NodeJS.Timeout | null>(null);

  const PROCESSING_MESSAGE_SEQUENCE = getProcessingMessageSequence();

  const getAIMessage = useCallback(
    (messageIndex: number, messageId: string): WebSocketMessage => {
      return {
        response_id: messageId,
        session_id: messageId,
        timestamp: new Date().toISOString(),
        message_type: 'TEXT',
        message: {
          content: messageIndex === -1 ? 'Thinking' : PROCESSING_MESSAGE_SEQUENCE[messageIndex],
        },
        role: 'ai' as const,
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
