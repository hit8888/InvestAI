import { PROCESSING_MESSAGE_SEQUENCE } from "@meaku/core/constants/chat";
import { AIResponse } from "@meaku/core/types/chat";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { ENV } from "../config/env";
import { useChatStore } from "../stores/useChatStore";
import { useMessageStore } from "../stores/useMessageStore";
import { ChatParams } from "../types/msc";
import { trackError } from "../utils/error";

const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;
// const HEARTBEAT_INTERVAL = 10000;
const PROCESSING_MESSAGE_CHANGE_INTERVAL = 5000;

const useWebSocketChat = () => {
  const { orgName = "" } = useParams<ChatParams>();
  const isChatOpen = useChatStore((state) => state.isChatOpen);
  const session = useChatStore((state) => state.session);
  const setIsChatOpen = useChatStore((state) => state.setIsChatOpen);
  const hasFirstUserMessageBeenSent = useChatStore(
    (state) => state.hasFirstUserMessageBeenSent,
  );
  const setHasFirstUserMessageBeenSent = useChatStore(
    (state) => state.setHasFirstUserMessageBeenSent,
  );

  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);

  const processingMessageInterval = useRef<NodeJS.Timeout | null>(null);

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

  const wsUrl = orgName
    ? `${ENV.VITE_WEBSOCKET_URL}?tenant=${orgName.toLowerCase()}`
    : "";

  const { readyState, sendMessage, lastMessage } = useWebSocket(wsUrl, {
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
    // heartbeat: {
    //   message: "ping",
    //   interval: HEARTBEAT_INTERVAL,
    // },
  });

  const handleSendUserMessage = useCallback(
    (message: string) => {
      if (!hasFirstUserMessageBeenSent) {
        setHasFirstUserMessageBeenSent(true);
      }

      if (!isChatOpen) {
        setIsChatOpen(true);
      }

      setSuggestedQuestions([]);

      const messageId = nanoid();

      const payload = {
        session_id: session?.session_id,
        message,
        response_id: messageId,
      };

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
      });

      setIsAMessageBeingProcessed(true);
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
        });

        messageIndex++;
      }, PROCESSING_MESSAGE_CHANGE_INTERVAL);
    },
    [hasFirstUserMessageBeenSent, session, isChatOpen],
  );

  useEffect(() => {
    if (!lastMessage) return;

    try {
      clearInterval(processingMessageInterval.current as NodeJS.Timeout);
      const response = JSON.parse(lastMessage.data) as AIResponse;
      handleAddAIMessage(response);

      if (response.is_complete) {
        setSuggestedQuestions(response.suggested_questions ?? []);
        setIsAMessageBeingProcessed(false);
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
    return () => {
      if (processingMessageInterval.current) {
        clearInterval(processingMessageInterval.current);
      }
    };
  }, []);

  return { readyState, handleSendUserMessage };
};

export default useWebSocketChat;
