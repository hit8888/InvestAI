import { WebSocketMessage, ScriptStepType, AgentEventType } from '@meaku/core/types/webSocketData';
import useWebSocketChat from './useWebSocketChat';
import { useEffect, useState, useRef } from 'react';
import { useMessageStore } from '../stores/useMessageStore';

interface ISwitchToDemo {
  feature_ids: number[];
}

interface DemoEventDataShape {
  script_step: ScriptStepType | null;
  features: Array<{ id: number; name: string; description: string }>;
  demo_available: boolean;
}

const isDemoEventData = (message: WebSocketMessage | null): DemoEventDataShape | undefined => {
  if (!message || message.message_type !== 'EVENT' || !('event_data' in message.message)) {
    return undefined;
  }
  const eventData = message.message.event_data;
  if ('script_step' in eventData || 'features' in eventData || 'demo_available' in eventData) {
    return eventData as DemoEventDataShape;
  }

  return undefined;
};

const useDemoDetails = () => {
  const { lastMessage, handleSendUserMessage } = useWebSocketChat();
  const queueRef = useRef<ScriptStepType[]>([]);
  const [demoDetails, setDemoDetails] = useState<ScriptStepType | null>(null);

  const parsedLastMessage = lastMessage ? (JSON.parse(lastMessage.data) as WebSocketMessage) : null;

  const latestResponseId = useMessageStore((state) => state.latestResponseId);
  const messages = useMessageStore((state) => state.messages);
  const eventData = isDemoEventData(parsedLastMessage);

  const draftDemoDetails = eventData?.script_step ?? null;

  const demoFeatures = eventData?.features ?? [];

  const isDemoAvailable = messages
    .filter((msg) => msg.response_id === latestResponseId)
    .some((message) => {
      const hasCompleteMessage = messages
        .filter((msg) => msg.response_id === latestResponseId)
        .some((msg) => msg.message_type === 'STREAM' && msg.message.is_complete);

      if (!hasCompleteMessage) return false;

      if (message.message_type === 'EVENT' && 'event_type' in message.message) {
        const eventMessage = message.message;
        if (eventMessage.event_type === 'DEMO_AVAILABLE') {
          return eventMessage.event_data.demo_available;
        }
      }
      return false;
    });

  useEffect(() => {
    if (draftDemoDetails) {
      // Add to queue
      queueRef.current.push(draftDemoDetails);

      // Preload the asset if it exists
      if (draftDemoDetails.asset_url) {
        if (draftDemoDetails.asset_url.match(/\.(jpg|jpeg|png|gif)$/i)) {
          const img = new Image();
          img.src = draftDemoDetails.asset_url;
        } else if (draftDemoDetails.asset_url.match(/\.(mp4|webm)$/i)) {
          const video = document.createElement('video');
          video.src = draftDemoDetails.asset_url;
          video.preload = 'auto';
        }
      }

      // Set demo details immediately if it's the first item
      if (!demoDetails) {
        setDemoDetails(draftDemoDetails);
      }

      // Request next demo if queue has less than 2 elements and is not last step
      if (queueRef.current.length < 2 && !draftDemoDetails.is_end) {
        handleSendUserMessage({
          message: {
            content: '',
            event_type: AgentEventType.DEMO_NEXT,
            event_data: {},
          },
          message_type: 'EVENT',
        });
      }
    }
  }, [draftDemoDetails?.audio_url]);

  const onStepEnd = () => {
    // Remove the current item from queue
    queueRef.current.shift();

    // Get the next item
    const nextStep = queueRef.current[0];

    // Set it as current demo details
    setDemoDetails(nextStep || null);

    // Request next demo if queue has less than 2 elements and current step is not the last
    if (queueRef.current.length < 2 && nextStep && !nextStep.is_end) {
      handleSendUserMessage({
        message: {
          content: '',
          event_type: AgentEventType.DEMO_NEXT,
          event_data: {},
        },
        message_type: 'EVENT',
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
      message: {
        content: '',
        event_type: AgentEventType.DEMO_NEXT,
        event_data: eventData ? { feature_ids: eventData.feature_ids } : {},
      },
      message_type: 'EVENT',
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
