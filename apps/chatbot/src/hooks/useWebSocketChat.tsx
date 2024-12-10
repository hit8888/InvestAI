import useUnifiedConfigurationResponseManager from '../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { ChatParams } from '@meaku/core/types/config';
import { useAnimateDifferentOrbStates } from './useAnimateDifferentOrbStates.ts';
import useLocalStorageArtifact from './useLocalStorageArtifact';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import { SplitScreenArtifactEnumSchema } from '@meaku/core/types/artifact';
import { AIResponse, SplitScreenArtifactType } from '@meaku/core/types/chat';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ENV } from '../config/env';
import { useMessageStore } from '../stores/useMessageStore';
import { trackError } from '../utils/error';
import { useIsAdmin } from '../shared/UrlDerivedDataProvider';

//TODO: Krishna refactor useEffect logic in next PR
const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;

const useWebSocketChat = () => {
  const { orgName = '' } = useParams<ChatParams>();

  const isAdmin = useIsAdmin();

  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const setHasFirstUserMessageBeenSent = useMessageStore((state) => state.setHasFirstUserMessageBeenSent);

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
  const { trackEvent } = useAnalytics();
  const { handleStopOrbAnimation, handleAnimatedOrb } = useAnimateDifferentOrbStates();
  const artifact = useLocalStorageArtifact();

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
    async (message: string, eventType?: string, eventData?: Record<string, unknown>) => {
      if (!hasFirstUserMessageBeenSent) {
        trackEvent(ANALYTICS_EVENT_NAMES.USER_SENT_FIRST_MESSAGE);
        setHasFirstUserMessageBeenSent(true);
      }

      const messageId = nanoid();
      setIsAMessageBeingProcessed(true);

      const payload = {
        session_id: sessionId,
        message: message ?? '',
        response_id: messageId,
        event_type: eventType ?? '',
        event_data: eventData ?? {},
        is_admin: isAdmin,
      };

      if (eventType && eventData) {
        sendMessage(JSON.stringify(payload));
        return;
      }

      if (!sessionId) {
        messageQueue.current.push({ message, messageId });
      } else {
        handleAddUserMessage(message);
        sendMessage(JSON.stringify(payload));
        handleAnimatedOrb(messageId);

        setIsAMessageBeingProcessed(false);
      }
    },
    [readyState, sessionId],
  );

  const handlePrimaryCta = () => {
    handleSendUserMessage('I want to book a demo for the product.');
  };
  useEffect(() => {
    if (!lastMessage) return;

    try {
      handleStopOrbAnimation();
      const response = JSON.parse(lastMessage.data) as AIResponse;
      response.showFeedbackOptions = isAdmin;
      handleAddAIMessage(response);

      if (response.is_complete) {
        setIsAMessageBeingProcessed(false);
      }

      const { artifacts } = response;

      const activeArtifact = artifacts.find((artifact) =>
        SplitScreenArtifactEnumSchema.options.includes(artifact.artifact_type as SplitScreenArtifactType),
      );

      if (activeArtifact && activeArtifact.artifact_type !== 'NONE') {
        if (artifact.handleUpdateArtifact) {
          artifact.handleUpdateArtifact({
            activeArtifactId: activeArtifact.artifact_id,
            activeArtifactType: activeArtifact.artifact_type,
          });
        }
      }
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

  return { readyState, handleSendUserMessage, handlePrimaryCta, sendMessage };
};

export default useWebSocketChat;
