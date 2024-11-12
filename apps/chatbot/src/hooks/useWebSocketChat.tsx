import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import { AIResponse } from '@meaku/core/types/chat';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ENV } from '../config/env';
import { useArtifactStore } from '../stores/useArtifactStore';
import { useChatStore } from '../stores/useChatStore';
import { useMessageStore } from '../stores/useMessageStore';
import { ChatParams } from '@meaku/core/types/msc';
import { getProcessingMessageSequence } from '../utils/common';
import { trackError } from '../utils/error';
import useIsAdmin from './useIsAdmin';
import useUnifiedConfigurationResponseManager from '../pages/shared/hooks/useUnifiedConfigurationResponseManager';

const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;
// const HEARTBEAT_INTERVAL = 10000;
const PROCESSING_MESSAGE_CHANGE_INTERVAL = 5000;

const useWebSocketChat = () => {
  const { orgName = '' } = useParams<ChatParams>();
  const messageId = nanoid();

  const defaultConfig = {
    media: null,
    documents: [],
    is_complete: false,
    is_loading: true,
    suggested_questions: [],
    analytics: {},
    artifacts: [],
  }; //BE type AIResponse

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const { isAdmin } = useIsAdmin();
  const { trackEvent } = useAnalytics();

  const hasFirstUserMessageBeenSent = useChatStore((state) => state.hasFirstUserMessageBeenSent); //chat app
  const setHasFirstUserMessageBeenSent = useChatStore((state) => state.setHasFirstUserMessageBeenSent);
  const setSuggestionArtifactId = useChatStore((state) => state.setSuggestionArtifactId);

  const handleAddUserMessage = useMessageStore((state) => state.handleAddUserMessage);
  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);
  const setIsAMessageBeingProcessed = useMessageStore((state) => state.setIsAMessageBeingProcessed);

  const handleAddActiveArtifact = useArtifactStore((state) => state.handleAddActiveArtifact);

  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);

  const processingMessageInterval = useRef<NodeJS.Timeout | null>(null);

  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const agentName = unifiedConfigurationResponseManager.getAgentName();

  const PROCESSING_MESSAGE_SEQUENCE = useMemo(() => {
    return getProcessingMessageSequence(agentName);
  }, [agentName]);

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

  const animateOrbTodifferentState = () => {
    let messageIndex = 0;
    const response_id = nanoid();

    //This is putting app in different loading state after 5sec
    processingMessageInterval.current = setInterval(() => {
      if (messageIndex >= PROCESSING_MESSAGE_SEQUENCE.length) {
        clearInterval(processingMessageInterval.current as NodeJS.Timeout);
        return;
      }

      handleAddAIMessage({
        ...defaultConfig,
        response_id,
        message: PROCESSING_MESSAGE_SEQUENCE[messageIndex],
      });

      messageIndex++;
    }, PROCESSING_MESSAGE_CHANGE_INTERVAL);
  };

  //first time: sessionId is null, readyState !== ReadyState.OPEN
  const handleSendUserMessage = useCallback(
    async (message: string) => {
      if (!hasFirstUserMessageBeenSent) {
        trackEvent(ANALYTICS_EVENT_NAMES.USER_SENT_FIRST_MESSAGE);
        setHasFirstUserMessageBeenSent(true);
      }

      const payload = {
        session_id: sessionId,
        message,
        response_id: messageId,
      };

      setSuggestionArtifactId(null);
      handleAddUserMessage(message);

      //This mostly happens when the websocket connection is closed or has been idle for some time
      if (readyState === ReadyState.CLOSED) {
        return handleAddAIMessage({
          response_id: nanoid(),
          message: unifiedConfigurationResponseManager.getDefaultErrorMessage(),
          media: null,
          documents: [],
          is_complete: true,
          is_loading: false,
          suggested_questions: [],
          analytics: {},
          artifacts: [],
        });
      }

      setIsAMessageBeingProcessed(true);

      sendMessage(JSON.stringify(payload));

      animateOrbTodifferentState(); //async call without blocking main thread
    },
    [hasFirstUserMessageBeenSent, sessionId, isAdmin, readyState],
  );

  useEffect(() => {
    if (!lastMessage) return;

    try {
      clearInterval(processingMessageInterval.current as NodeJS.Timeout);
      const response = JSON.parse(lastMessage.data) as AIResponse;
      response.showFeedbackOptions = isAdmin;
      handleAddAIMessage(response);

      if (response.is_complete) {
        setIsAMessageBeingProcessed(false);
      }

      const { artifacts } = response;
      const [activeArtifact, suggestionArtifact] = artifacts;

      if (activeArtifact && activeArtifact.artifact_type !== 'NONE') {
        handleAddActiveArtifact(activeArtifact.artifact_id, activeArtifact.artifact_type);
      }

      if (response.is_complete && suggestionArtifact && suggestionArtifact.artifact_type === 'SUGGESTIONS') {
        setSuggestionArtifactId(suggestionArtifact.artifact_id);
      }
    } catch (error) {
      trackError(error, {
        action: 'useEffect | handleAddAIMessage',
        component: 'useWebSocketChat',
        sessionId: unifiedConfigurationResponseManager.getSessionId(),
      });
    }
  }, [lastMessage]); //This hook is called whenebver lastMessage changes
  //TODO: Figure out smoothness while sending messages

  // Cleanup function
  const cleanupWebSocketConnection = () => {
    if (processingMessageInterval.current) {
      clearInterval(processingMessageInterval.current);
      processingMessageInterval.current = null;
    }

    const websocket = getWebSocket();
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.close();
    }
  };

  // Cleanup effect
  useEffect(() => {
    return cleanupWebSocketConnection;
  }, []);

  return { readyState, handleSendUserMessage };
};

export default useWebSocketChat;

//response will have previous chats
//last message will have the current message
