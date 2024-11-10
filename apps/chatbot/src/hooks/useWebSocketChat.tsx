import ANALYTICS_EVENT_NAMES from "@meaku/core/constants/analytics";
import useAnalytics from "@meaku/core/hooks/useAnalytics";
import { AIResponse } from "@meaku/core/types/chat";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ENV } from "../config/env";
import { useArtifactStore } from "../stores/useArtifactStore";
import { useChatStore } from "../stores/useChatStore";
import { useMessageStore } from "../stores/useMessageStore";
import { ChatParams } from "@meaku/core/types/msc";
import { getProcessingMessageSequence } from "../utils/common";
import { trackError } from "../utils/error";
import useIsAdmin from "./useIsAdmin";
import useUnifiedConfigurationResponseManager from "../pages/Chat/hooks/useUnifiedConfigurationResponseManager";
//TODO: Krishna Reafctor useEffect logic in next PR
const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;
// const HEARTBEAT_INTERVAL = 10000;
const PROCESSING_MESSAGE_CHANGE_INTERVAL = 5000;

const useWebSocketChat = () => {
  const { orgName = "" } = useParams<ChatParams>();

  const unifiedConfigurationResponseManager = useUnifiedConfigurationResponseManager();
  const { isAdmin } = useIsAdmin();
  const { trackEvent } = useAnalytics();

  const isChatOpen = useChatStore((state) => state.isChatOpen);
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);
  const hasFirstUserMessageBeenSent = useChatStore(
    (state) => state.hasFirstUserMessageBeenSent,
  );
  const setHasFirstUserMessageBeenSent = useChatStore(
    (state) => state.setHasFirstUserMessageBeenSent,
  );
  const setSuggestionArtifactId = useChatStore(
    (state) => state.setSuggestionArtifactId,
  );

  const handleAddUserMessage = useMessageStore(
    (state) => state.handleAddUserMessage,
  );
  const handleAddAIMessage = useMessageStore(
    (state) => state.handleAddAIMessage,
  );
  const setSuggestedQuestions = useMessageStore(
    (state) => state.setSuggestedQuestions,
  );
  const setIsAMessageBeingProcessed = useMessageStore(
    (state) => state.setIsAMessageBeingProcessed,
  );

  const handleAddActiveArtifact = useArtifactStore(
    (state) => state.handleAddActiveArtifact,
  );

  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);
  const [shouldConnect, setShouldConnect] = useState(false);

  const processingMessageInterval = useRef<NodeJS.Timeout | null>(null);
  const messageQueue = useRef<
    {
      message: string;
      messageId: string;
    }[]
  >([]);


  const sessionId = unifiedConfigurationResponseManager.getSessionId() ?? "";
  const agentName = unifiedConfigurationResponseManager.getAgentName() ?? "";

  const PROCESSING_MESSAGE_SEQUENCE = useMemo(() => {
    return getProcessingMessageSequence(agentName);
  }, [agentName]);

  const wsUrl = orgName
    ? `${ENV.VITE_WEBSOCKET_URL}?tenant=${orgName.toLowerCase()}`
    : "";

  const { readyState, sendMessage, lastMessage, getWebSocket } = useWebSocket(
    wsUrl,
    {
      share: true,
      shouldReconnect: () => true,
      reconnectAttempts: MAX_RETRIES,
      reconnectInterval: (retryCount) => {
        const interval = Math.min(
          retryInterval * Math.pow(2, retryCount - 1),
          MAX_RETRY_INTERVAL,
        );
        setRetryInterval(interval);
        return interval;
      },
      filter: () => shouldConnect,

      // heartbeat: {
      //   message: "ping",
      //   interval: HEARTBEAT_INTERVAL,
      // },
    },
    shouldConnect,
  );

  const initializeWebSocket = useCallback(async () => {
    if (!sessionId) {
      return; ///discuss with Sankha about this
    }

    setShouldConnect(true);
  }, [sessionId]);

  const processQueuedMessages = useCallback(() => {
    if (
      readyState === ReadyState.OPEN &&
      messageQueue.current.length > 0 &&
      sessionId
    ) {
      messageQueue.current.forEach(({ message, messageId }) => {
        const payload = {
          session_id: sessionId,
          message,
          response_id: messageId,
        };

        sendMessage(JSON.stringify(payload));
      });

      messageQueue.current = [];
    }
  }, [readyState, sessionId]);

  const handleSendUserMessage = useCallback(
    async (message: string) => {
      if (!shouldConnect) {
        await initializeWebSocket();
      }

      if (!hasFirstUserMessageBeenSent) {
        setHasFirstUserMessageBeenSent(true);
      }

      if (!isChatOpen) {
        setIsChatOpen(true);
      }

      const messageId = nanoid();

      const payload = {
        session_id: sessionId,
        message,
        response_id: messageId,
      };

      setSuggestedQuestions([]);
      handleAddUserMessage(message);

      if (readyState === ReadyState.CLOSED) {
        return handleAddAIMessage({
          response_id: nanoid(),
          message: session?.configuration.body.default_error_message ?? "",
          media: null,
          documents: [],
          is_complete: true,
          is_loading: false,
          suggested_questions: [],
          analytics: {},
          artifacts: [],
        });
      }

      handleAddAIMessage({
        response_id: messageId,
        message: PROCESSING_MESSAGE_SEQUENCE[0],
        media: null,
        documents: [],
        is_complete: false,
        is_loading: true,
        suggested_questions: [],
        analytics: {},
        artifacts: [],
      });

      setIsAMessageBeingProcessed(true);

      if (!sessionId) {
        messageQueue.current.push({ message, messageId });
      } else {
        sendMessage(JSON.stringify(payload));

        let messageIndex = 1;
        processingMessageInterval.current = setInterval(() => {
          if (messageIndex >= PROCESSING_MESSAGE_SEQUENCE.length) {
            clearInterval(processingMessageInterval.current as NodeJS.Timeout);
            return;
          }

          handleAddAIMessage({
            response_id: messageId,
            message: PROCESSING_MESSAGE_SEQUENCE[messageIndex],
            media: null,
            documents: [],
            is_complete: false,
            is_loading: true,
            suggested_questions: [],
            analytics: {},
            artifacts: [],
          });

          messageIndex++;
        }, PROCESSING_MESSAGE_CHANGE_INTERVAL);
      }
    },
    [
      hasFirstUserMessageBeenSent,
      session,
      sessionId,
      isChatOpen,
      isAdmin,
      readyState,
      shouldConnect,
      initializeWebSocket,
    ],
  );

  const handlePrimaryCta = () => {
    handleSendUserMessage("I want to book a demo for the product.");
  };

  useEffect(() => {
    if (!lastMessage) return;

    try {
      clearInterval(processingMessageInterval.current as NodeJS.Timeout);
      const response = JSON.parse(lastMessage.data) as AIResponse;
      response.showFeedbackOptions = isAdmin;
      handleAddAIMessage(response);

      if (response.is_complete) {
        setSuggestedQuestions(response.suggested_questions ?? []);
        setIsAMessageBeingProcessed(false);
      }

      const { artifacts } = response;
      const [activeArtifact, suggestionArtifact] = artifacts;

      if (activeArtifact && activeArtifact.artifact_type !== "NONE") {
        handleAddActiveArtifact(
          activeArtifact.artifact_id,
          activeArtifact.artifact_type,
        );
      }

      if (
        response.is_complete &&
        suggestionArtifact &&
        suggestionArtifact.artifact_type === "SUGGESTIONS"
      ) {
        setSuggestionArtifactId(suggestionArtifact.artifact_id);
      }
    } catch (error) {
      trackError(error, {
        action: "useEffect | handleAddAIMessage",
        component: "useWebSocketChat",
        sessionId: session?.session_id,
      });
    }
  }, [lastMessage]);

  useEffect(() => {
    if (hasFirstUserMessageBeenSent) {
      trackEvent(ANALYTICS_EVENT_NAMES.USER_SENT_FIRST_MESSAGE);
    }
  }, [hasFirstUserMessageBeenSent]);

  useEffect(() => {
    if (
      readyState === ReadyState.OPEN &&
      messageQueue.current.length > 0 &&
      sessionId
    ) {
      processQueuedMessages();
    }
  }, [readyState, sendMessage, sessionId]);

  useEffect(() => {
    return () => {
      if (processingMessageInterval.current) {
        clearInterval(processingMessageInterval.current);
      }
      setShouldConnect(false);
      const ws = getWebSocket();
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return { readyState, handleSendUserMessage, handlePrimaryCta };
};

export default useWebSocketChat;
