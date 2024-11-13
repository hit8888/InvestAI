import { useEffect, useMemo, useRef } from 'react';
import useUnifiedConfigurationResponseManager from '../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { getProcessingMessageSequence } from '../utils/common';
import { useMessageStore } from '../stores/useMessageStore';

const PROCESSING_MESSAGE_CHANGE_INTERVAL = 5000; //Discuss with the team about the value of this constant

const useAnimateDIfferentOrbStates = () => {
  const processingMessageInterval = useRef<NodeJS.Timeout | null>(null);

  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();

  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? '';

  const PROCESSING_MESSAGE_SEQUENCE = useMemo(() => {
    return getProcessingMessageSequence(agentName);
  }, [agentName]);

  const handleAnimatedOrb = (messageId: string) => {
    let messageIndex = 0;
    processingMessageInterval.current = setInterval(() => {
      if (messageIndex >= PROCESSING_MESSAGE_SEQUENCE.length) {
        clearInterval(processingMessageInterval.current as NodeJS.Timeout);
        return;
      }

      handleAddAIMessage({
        response_id: messageId,
        message: PROCESSING_MESSAGE_SEQUENCE[messageIndex],
        media: null,
        documents: [],
        is_complete: false,
        is_loading: true,
        suggested_questions: [],
        analytics: {},
        artifacts: [],
      });

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
