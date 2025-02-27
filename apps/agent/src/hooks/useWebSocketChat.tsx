import { AgentParams, OrbStatusEnum } from '@meaku/core/types/config';
import { useAnimateDifferentOrbStates } from '@meaku/core/hooks/useAnimateDifferentOrbStates';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ENV } from '@meaku/core/types/env';
import { useMessageStore } from '../stores/useMessageStore.ts';
import { trackError } from '../utils/error.ts';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import useGetMessagePayload from '@meaku/core/hooks/useGetMessagePayload';
import { EventMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
import { isMessageAnalyticsEvent } from '@meaku/core/utils/messageUtils';
import useLatestMessageComplete from './useLatestMessageComplete.ts';

const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;

const useWebSocketChat = () => {
  const { orgName = '' } = useParams<AgentParams>();

  const getMessagePayload = useGetMessagePayload();

  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const setHasFirstUserMessageBeenSent = useMessageStore((state) => state.setHasFirstUserMessageBeenSent);
  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState);

  const handleAddUserMessage = useMessageStore((state) => state.handleAddUserMessage);
  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);
  const setIsAMessageBeingProcessed = useMessageStore((state) => state.setIsAMessageBeingProcessed);
  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const { isMessageComplete } = useLatestMessageComplete();

  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);

  const messageQueue = useRef<WebSocketMessage[]>([]);

  const sessionApiResponseManager = useSessionApiResponseManager();
  const { trackAgentbotEvent: trackEvent } = useAgentbotAnalytics();
  const { handleStopOrbAnimation, handleAnimatedOrb } = useAnimateDifferentOrbStates({ handleAddAIMessage });

  const sessionId = sessionApiResponseManager?.getSessionId() ?? '';
  const wsUrl = orgName ? `${ENV.VITE_WEBSOCKET_URL}?tenant=${orgName.toLowerCase()}` : '';

  const { readyState, sendMessage, lastMessage, getWebSocket } = useWebSocket(
    wsUrl,
    {
      share: true,
      shouldReconnect: () => true,
      reconnectAttempts: MAX_RETRIES,
      reconnectInterval: (retryCount) => {
        const interval = Math.min(retryInterval * Math.pow(2, retryCount - 1), MAX_RETRY_INTERVAL);
        setRetryInterval(interval);
        return interval;
      },
      filter: () => !!sessionId,
    },
    !!sessionId,
  );
  const handleSendUserMessage = useCallback(
    async ({ message, message_type }: Pick<WebSocketMessage, 'message' | 'message_type'>) => {
      if (isAMessageBeingProcessed) {
        return;
      }
      const isMsgComplete = isMessageComplete();

      if (!isMsgComplete) {
        return;
      }

      const response_id = nanoid();

      const payload = getMessagePayload({ message, response_id, message_type });

      //This is for event messages where the message_type is EVENT
      if ('event_type' in message && 'event_data' in message && !message.content) {
        sendMessage(JSON.stringify(payload));
        return;
      }

      handleUpdateOrbState(OrbStatusEnum.thinking);

      if (!hasFirstUserMessageBeenSent) {
        trackEvent(ANALYTICS_EVENT_NAMES.USER_SENT_FIRST_MESSAGE);
        setHasFirstUserMessageBeenSent(true);
      }

      if (!sessionId) {
        messageQueue.current.push(payload);
      } else {
        handleAddUserMessage(payload);
        setIsAMessageBeingProcessed(true);
        sendMessage(JSON.stringify(payload));
        handleAnimatedOrb(response_id);
      }
    },
    [readyState, sessionId, isAMessageBeingProcessed],
  );

  const handlePrimaryCta = () => {
    handleSendUserMessage({
      message: { content: 'I want to book a demo for the product.' },
      message_type: 'TEXT',
    });
  };

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const response = JSON.parse(lastMessage.data) as WebSocketMessage;

      if (isMessageAnalyticsEvent(response)) {
        return;
      }

      handleStopOrbAnimation();

      // First check if it's an event message
      if (response.message_type === 'EVENT' && 'event_type' in response.message) {
        const eventMessageContent = response.message as EventMessageContent;
        if (
          'event_data' in eventMessageContent &&
          'demo_available' in eventMessageContent.event_data &&
          eventMessageContent.event_data.demo_available
        ) {
          const demoEventData = eventMessageContent.event_data;
          if (
            (demoEventData.demo_available &&
              (demoEventData.script_step || (demoEventData.features && !!demoEventData.features.length))) ||
            demoEventData.response_audio_url
          ) {
            return;
          }
        }
      }

      handleUpdateOrbState(OrbStatusEnum.responding);
      setIsAMessageBeingProcessed(false);
      handleAddAIMessage(response);
    } catch (error) {
      trackError(error, {
        action: 'useEffect | handleAddAIMessage',
        component: 'useWebSocketChat',
        sessionId: sessionApiResponseManager?.getSessionId(),
      });
    }
  }, [lastMessage]);

  useEffect(() => {
    if (readyState !== ReadyState.OPEN) {
      return;
    }

    if (!messageQueue.current.length) {
      return;
    }

    if (!sessionId) {
      return;
    }

    messageQueue.current.forEach((payload) => {
      const updatedPayload = { ...payload, session_id: sessionId };
      handleAddUserMessage(updatedPayload);
      setIsAMessageBeingProcessed(true);
      handleAnimatedOrb(updatedPayload.response_id);
      sendMessage(JSON.stringify(updatedPayload));
    });

    messageQueue.current = [];
  }, [readyState, sendMessage, sessionId]);

  useEffect(() => {
    return () => {
      const ws = getWebSocket();
      if (ws) {
        ws.close();
      }
    };
  }, []); //Cleanup effect

  return { readyState, handleSendUserMessage, handlePrimaryCta, sendMessage, lastMessage };
};

export default useWebSocketChat;
