import { AIResponse, ScriptStepType } from '@meaku/core/types/agent';
import useWebSocketChat from './useWebSocketChat';
import { useEffect, useState, useRef } from 'react';
import { DemoEvent } from '@meaku/core/types/webSocket';

interface ISwitchToDemo {
  feature_ids: number[];
}

const useDemoDetails = () => {
  const { lastMessage, handleSendUserMessage } = useWebSocketChat();
  const queueRef = useRef<ScriptStepType[]>([]);
  const [demoDetails, setDemoDetails] = useState<ScriptStepType | null>(null);

  const parsedLastMessage = lastMessage ? (JSON.parse(lastMessage.data) as AIResponse) : null;

  const draftDemoDetails = parsedLastMessage?.script_step ?? null;

  const demoFeatures = parsedLastMessage?.features ?? [];

  const isDemoAvailable = !!parsedLastMessage?.demo_available;

  useEffect(() => {
    if (draftDemoDetails) {
      queueRef.current.push(draftDemoDetails);

      if (!demoDetails) {
        setDemoDetails(draftDemoDetails);
      }

      // Request next demo if queue has less than 2 elements and is not last step
      if (queueRef.current.length < 2 && !draftDemoDetails.is_end) {
        handleSendUserMessage({
          message: '',
          eventType: DemoEvent.DEMO_NEXT,
          eventData: {},
        });
      }
    }
  }, [draftDemoDetails?.audio_url]);

  const onStepEnd = () => {
    queueRef.current.shift();
    const nextStep = queueRef.current[0];
    setDemoDetails(nextStep || null);

    // Request next demo if queue has less than 2 elements and current step is not the last
    if (queueRef.current.length < 2 && nextStep && !nextStep.is_end) {
      handleSendUserMessage({
        message: '',
        eventType: DemoEvent.DEMO_NEXT,
        eventData: {},
      });
    }
  };

  const switchToDemo = (eventData?: ISwitchToDemo) => {
    // Clear the existing queue
    queueRef.current = [];
    // Reset demo details
    setDemoDetails(null);
    // Send request to switch to demo mode
    handleSendUserMessage({
      message: '',
      eventType: DemoEvent.DEMO_NEXT,
      eventData: eventData ? { feature_ids: eventData.feature_ids } : {},
    });
  };

  return {
    demoDetails,
    demoFeatures,
    isDemoAvailable,
    switchToDemo,
    onStepEnd,
  };
};

export { useDemoDetails };
