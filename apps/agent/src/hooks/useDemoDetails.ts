import { AIResponse, ScriptStepType } from '@meaku/core/types/agent';
import useWebSocketChat from './useWebSocketChat';
import { useEffect, useState } from 'react';

const useDemoDetails = () => {
  const { lastMessage } = useWebSocketChat();

  const [demoDetails, setDemoDetails] = useState<ScriptStepType | null>(null);

  const parsedLastMessage = lastMessage ? (JSON.parse(lastMessage.data) as AIResponse) : null;

  const draftDemoDetails = parsedLastMessage?.script_step ?? null;

  const demoFeatures = parsedLastMessage?.features ?? [];

  const isDemoAvailable = !!parsedLastMessage?.demo_available;

  useEffect(() => {
    if (draftDemoDetails) {
      setDemoDetails(draftDemoDetails);
    }
  }, [draftDemoDetails?.audio_url]);

  return {
    demoDetails,
    demoFeatures,
    isDemoAvailable,
  };
};

export { useDemoDetails };
