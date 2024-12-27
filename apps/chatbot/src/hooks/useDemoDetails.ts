import { useMessageStore } from '../stores/useMessageStore';
import { useEffect, useState } from 'react';
import { AIResponse, ScriptStepType } from '@meaku/core/types/chat';
import useWebSocketChat from './useWebSocketChat';

const useDemoDetails = () => {
  const setMediaTakeFullScreenWidth = useMessageStore((state) => state.setMediaTakeFullScreenWidth);
  const isMediaTakingFullWidth = useMessageStore((state) => state.isMediaTakingFullWidth);
  const { lastMessage } = useWebSocketChat();

  const parsedLastMessage = lastMessage ? (JSON.parse(lastMessage.data) as AIResponse) : null;

  const [draftDemoDetails, setDemoDetails] = useState<ScriptStepType | null>(null);
  const [isDemoAvailable, setIsDemoAvailable] = useState(false);

  const demoDetails = parsedLastMessage ? parsedLastMessage.script_step : null;

  const demo_available = parsedLastMessage ? !!parsedLastMessage.demo_available : false;

  useEffect(() => {
    setIsDemoAvailable(demo_available);
  }, [demo_available]);

  useEffect(() => {
    if (demoDetails) {
      setDemoDetails(demoDetails);
      if (!isMediaTakingFullWidth) {
        setMediaTakeFullScreenWidth(true);
      }
    }
  }, [demoDetails?.audio_url]);

  return {
    draftDemoDetails,
    isDemoAvailable,
  };
};

export { useDemoDetails };
