import { AIResponse } from '@meaku/core/types/chat';
import useWebSocketChat from './useWebSocketChat';

const useDemoDetails = () => {
  const { lastMessage } = useWebSocketChat();

  const parsedLastMessage = lastMessage ? (JSON.parse(lastMessage.data) as AIResponse) : null;

  const demoDetails = parsedLastMessage?.script_step ?? null;

  const demoFeatures = parsedLastMessage?.features ?? [];

  const isDemoAvailable = !!parsedLastMessage?.demo_available;

  return {
    demoDetails,
    demoFeatures,
    isDemoAvailable,
  };
};

export { useDemoDetails };
