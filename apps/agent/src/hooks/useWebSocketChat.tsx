import useUnifiedConfigurationResponseManager from '../pages/shared/hooks/useUnifiedConfigurationResponseManager.ts';
import { AgentParams, OrbStatusEnum } from '@meaku/core/types/config';
import { useAnimateDifferentOrbStates } from './useAnimateDifferentOrbStates.ts';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { AIResponse } from '@meaku/core/types/agent';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ENV } from '../config/env.ts';
import { useMessageStore } from '../stores/useMessageStore.ts';
import { trackError } from '../utils/error.ts';
import { useIsAdmin } from '../shared/UrlDerivedDataProvider/index.tsx';
import useAgentbotAnalytics from './useAgentbotAnalytics.tsx';
import useGetMessagePayload from './useGetMessagePayload.tsx';

//TODO: Krishna refactor useEffect logic in next PR
const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;

export interface IWebSocketHandleMessage {
  message: string;
  eventType?: string;
  eventData?: Record<string, unknown>;
}

const useWebSocketChat = () => {
  const { orgName = '' } = useParams<AgentParams>();

  const getMessagePayload = useGetMessagePayload();

  const isAdmin = useIsAdmin();

  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const setHasFirstUserMessageBeenSent = useMessageStore((state) => state.setHasFirstUserMessageBeenSent);
  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState);

  const handleAddUserMessage = useMessageStore((state) => state.handleAddUserMessage);
  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);
  const setIsAMessageBeingProcessed = useMessageStore((state) => state.setIsAMessageBeingProcessed);

  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);

  const messageQueue = useRef<
    {
      message: string;
      messageId: string;
    }[]
  >([]);

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const { trackAgentbotEvent: trackEvent } = useAgentbotAnalytics();
  const { handleStopOrbAnimation, handleAnimatedOrb } = useAnimateDifferentOrbStates();

  const sessionId = unifiedConfigurationResponseManager.getSessionId() ?? '';
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
    async ({ message, eventType, eventData }: IWebSocketHandleMessage) => {
      const messageId = nanoid();

      const payload = getMessagePayload({ message, eventType, eventData, messageId });
      if (eventType && eventData) {
        sendMessage(JSON.stringify(payload));
        return;
      }

      handleUpdateOrbState(OrbStatusEnum.thinking);

      if (!hasFirstUserMessageBeenSent) {
        trackEvent(ANALYTICS_EVENT_NAMES.USER_SENT_FIRST_MESSAGE);
        setHasFirstUserMessageBeenSent(true);
      }

      setIsAMessageBeingProcessed(true);

      if (!sessionId) {
        messageQueue.current.push({ message, messageId });
      } else {
        handleAddUserMessage(message);
        sendMessage(JSON.stringify(payload));
        handleAnimatedOrb(messageId);
      }
    },
    [readyState, sessionId],
  );

  const handlePrimaryCta = () => {
    handleSendUserMessage({ message: 'I want to book a demo for the product.' });
  };

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const response = JSON.parse(lastMessage.data) as AIResponse;
      handleStopOrbAnimation();

      if (
        response.demo_available &&
        (response.script_step || (response.features && !!response.features.length) || response.artifacts.length < 0)
      ) {
        return;
      } //Don't track demo flow here(In global context)

      handleUpdateOrbState(OrbStatusEnum.responding);
      response.showFeedbackOptions = isAdmin;

      if (response.is_complete) {
        setIsAMessageBeingProcessed(false);
      }

      handleAddAIMessage(response);
    } catch (error) {
      trackError(error, {
        action: 'useEffect | handleAddAIMessage',
        component: 'useWebSocketChat',
        sessionId: unifiedConfigurationResponseManager.getSessionId(),
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

    messageQueue.current.forEach(({ message, messageId }) => {
      const payload = {
        session_id: sessionId,
        message,
        response_id: messageId,
        is_admin: isAdmin,
      };
      handleAddUserMessage(message);
      handleAnimatedOrb(messageId);
      sendMessage(JSON.stringify(payload));
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
