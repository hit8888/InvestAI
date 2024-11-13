import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import useAnalytics from '@meaku/core/hooks/useAnalytics';
import { AIResponse, ChatBoxArtifactType, SplitScreenArtifactType } from '@meaku/core/types/chat';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ENV } from '../config/env';
import { useChatStore } from '../stores/useChatStore';
import { useMessageStore } from '../stores/useMessageStore';
import { trackError } from '../utils/error';
import useIsAdmin from './useIsAdmin';
import { ChatBoxArtifactEnumSchema, SplitScreenArtifactEnumSchema } from '@meaku/core/types/artifact';
import useUnifiedConfigurationResponseManager from '../pages/shared/hooks/useUnifiedConfigurationResponseManager';
import { ChatParams } from '@meaku/core/types/config';
import { useAnimateDIfferentOrbStates } from './useAnimateDIfferentOrbStates';
import useLocalStorageArtifact from './useLocalStorageArtifact';

//TODO: Krishna Reafctor useEffect logic in next PR
const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;

const useWebSocketChat = () => {
  const { orgName = '' } = useParams<ChatParams>();

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const { isAdmin } = useIsAdmin();
  const { trackEvent } = useAnalytics();
  const { handleStopOrbAnimation, handleAnimatedOrb } = useAnimateDIfferentOrbStates();
  const artifact = useLocalStorageArtifact();

  const isChatOpen = useChatStore((state) => state.isChatOpen);
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);
  const hasFirstUserMessageBeenSent = useChatStore((state) => state.hasFirstUserMessageBeenSent);
  const setHasFirstUserMessageBeenSent = useChatStore((state) => state.setHasFirstUserMessageBeenSent);
  // TODO: Remove Suggestion Artifacts
  const setSuggestionArtifactId = useChatStore((state) => state.setSuggestionArtifactId);

  const handleAddUserMessage = useMessageStore((state) => state.handleAddUserMessage);
  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);
  const setSuggestedQuestions = useMessageStore((state) => state.setSuggestedQuestions);
  const setIsAMessageBeingProcessed = useMessageStore((state) => state.setIsAMessageBeingProcessed);

  const handleAddActiveChatArtifact = useChatStore((state) => state.handleAddActiveChatArtifact);

  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);

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
    async (message: string) => {
      if (!hasFirstUserMessageBeenSent) {
        trackEvent(ANALYTICS_EVENT_NAMES.USER_SENT_FIRST_MESSAGE);
        setHasFirstUserMessageBeenSent(true);
      }

      if (!isChatOpen) {
        setIsChatOpen(true);
      }

      const messageId = nanoid();

      setSuggestionArtifactId(null);
      setSuggestedQuestions([]);
      handleAddUserMessage(message);

      // Wait for WebSocket connection
      const waitForConnection = async (timeout = 3000): Promise<boolean> => {
        return new Promise((resolve) => {
          const start = Date.now();

          const checkConnection = () => {
            if (readyState === ReadyState.OPEN) {
              resolve(true);
              return;
            }

            if (Date.now() - start > timeout) {
              resolve(false);
              return;
            } //wait for 3 seconds before resolving false

            setTimeout(checkConnection, 100);
          };

          checkConnection();
        });
      };

      const isConnected = await waitForConnection();

      if (!isConnected) {
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

      const payload = {
        session_id: sessionId,
        message,
        response_id: messageId,
      };

      sendMessage(JSON.stringify(payload));

      handleAnimatedOrb(messageId);
    },
    [readyState, sessionId, isChatOpen, hasFirstUserMessageBeenSent],
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
        setSuggestedQuestions(response.suggested_questions ?? []);
        setIsAMessageBeingProcessed(false);
      }

      const { artifacts } = response;

      const activeArtifact = artifacts.find((artifact) =>
        SplitScreenArtifactEnumSchema.options.includes(artifact.artifact_type as SplitScreenArtifactType),
      );

      const chatBoxArtifact = artifacts.find((artifact) =>
        ChatBoxArtifactEnumSchema.options.includes(artifact.artifact_type as ChatBoxArtifactType),
      );

      if (activeArtifact && activeArtifact.artifact_type !== 'NONE') {
        if (artifact.handleUpdateArtifact) {
          artifact.handleUpdateArtifact({
            activeArtifactId: activeArtifact.artifact_id,
            activeArtifactType: activeArtifact.artifact_type,
          });
        }
      }

      if (chatBoxArtifact) {
        handleAddActiveChatArtifact(chatBoxArtifact.artifact_id, chatBoxArtifact.artifact_type as ChatBoxArtifactType);
      }

      if (
        response.is_complete &&
        chatBoxArtifact &&
        chatBoxArtifact.artifact_type === ChatBoxArtifactEnumSchema.Enum.SUGGESTIONS
      ) {
        setSuggestionArtifactId(chatBoxArtifact.artifact_id);
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
    return () => {
      const ws = getWebSocket();
      if (ws) {
        ws.close();
      }
    };
  }, []); //Cleanup effect

  return { readyState, handleSendUserMessage, handlePrimaryCta };
};

export default useWebSocketChat;
