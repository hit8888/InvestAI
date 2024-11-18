import { useCallback, useEffect, useMemo, useRef } from 'react';
import useUnifiedConfigurationResponseManager from '../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { getProcessingMessageSequence } from '../utils/common';
import { useMessageStore } from '../stores/useMessageStore';

const PROCESSING_MESSAGE_CHANGE_INTERVAL = 2000; //Discuss with the team about the value of this constant

const useAnimateDIfferentOrbStates = () => {
  const processingMessageInterval = useRef<NodeJS.Timeout | null>(null);

  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? '';

  const PROCESSING_MESSAGE_SEQUENCE = useMemo(() => {
    return getProcessingMessageSequence(agentName);
  }, [agentName]);

  const getAIMessage = useCallback(
    (messageIndex: number, messageId: string) => {
      return {
        response_id: messageId,
        message: PROCESSING_MESSAGE_SEQUENCE[messageIndex],
        media: null,
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

    messageIndex++; // Increment for subsequent messages

    // Start interval for remaining messages
    processingMessageInterval.current = setInterval(() => {
      if (messageIndex >= PROCESSING_MESSAGE_SEQUENCE.length) {
        clearInterval(processingMessageInterval.current as NodeJS.Timeout);
        return;
      }

      handleAddAIMessage(getAIMessage(messageIndex, messageId));

      messageIndex++;
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

export { useAnimateDIfferentOrbStates };
