import { AgentParams, OrbStatusEnum } from '@meaku/core/types/config';
import { useAnimateDifferentOrbStates } from '@meaku/core/hooks/useAnimateDifferentOrbStates';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useMessageStore } from '../stores/useMessageStore.ts';
import { trackError } from '../utils/error.ts';
import useAgentbotAnalytics from '@meaku/core/hooks/useAgentbotAnalytics';
import useGetMessagePayload from '@meaku/core/hooks/useGetMessagePayload';
import { AgentEventType, WebSocketMessage } from '@meaku/core/types/webSocketData';
import useSessionApiResponseManager from '@meaku/core/hooks/useSessionApiResponseManager';
import {
  hasUserSentInactiveMessage,
  isDemoAvailable,
  isDemoOptionsMessage,
  isMessageAnalyticsEvent,
} from '@meaku/core/utils/messageUtils';
import useLatestMessageComplete from './useLatestMessageComplete.ts';
import { useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';
import { useExponentialBackoff } from './useExponentialBackoff';
import { sanitizeObject } from '@meaku/core/utils/sanitize';
import { AdminConversationJoinStatus, MessageSenderRole } from '@meaku/core/types/common';
import { getWebsocketBaseUrl } from '../utils/common.ts';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';

const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;
// Default inactivity threshold: 2 minutes (120000 ms) TODO: Move to Agent Config
const INITIAL_INACTIVITY_THRESHOLD = 1500000; // 2 minutes
const MAX_INACTIVITY_THRESHOLD = 600000; // 10 minutes
const BACKOFF_FACTOR = 2;
const MAX_INACTIVITY_ATTEMPTS = 2; // Maximum number of inactivity messages to send

const UPDATE_LATEST_RESPONSE_ID_FOR_EVENT_TYPE = [
  'USER_INACTIVE',
  'FORM_FILLED',
  'QUALIFICATION_FORM_FILLED',
  'DISCOVERY_ANSWER',
  'DEMO_END',
];

const useWebSocketChat = () => {
  const { orgName = '' } = useParams<AgentParams>();

  const isAdmin = useIsAdmin();
  const getMessagePayload = useGetMessagePayload();

  const hasFirstUserMessageBeenSent = useMessageStore((state) => state.hasFirstUserMessageBeenSent);
  const setHasFirstUserMessageBeenSent = useMessageStore((state) => state.setHasFirstUserMessageBeenSent);
  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState);
  const setLatestResponseId = useMessageStore((state) => state.setLatestResponseId);

  const handleAddUserMessage = useMessageStore((state) => state.handleAddUserMessage);
  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);
  const handleAddAdminMessage = useMessageStore((state) => state.handleAddAdminMessage);
  const setIsAMessageBeingProcessed = useMessageStore((state) => state.setIsAMessageBeingProcessed);
  const isAMessageBeingProcessed = useMessageStore((state) => state.isAMessageBeingProcessed);
  const isInitApiSuccess = useMessageStore((state) => state.isInitApiSuccess);
  const adminJoinStatus = useMessageStore((state) => state.adminJoinStatus);
  const setAdminJoinStatus = useMessageStore((state) => state.setAdminJoinStatus);
  const { isMessageComplete } = useLatestMessageComplete();

  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);

  const messageQueue = useRef<WebSocketMessage[]>([]);
  // Inactivity timer reference
  const sessionApiResponseManager = useSessionApiResponseManager();
  const { trackAgentbotEvent: trackEvent } = useAgentbotAnalytics();
  const { handleStopOrbAnimation, handleAnimatedOrb } = useAnimateDifferentOrbStates({ handleAddAIMessage });

  const { sessionData } = useLocalStorageSession();
  const sessionId = sessionApiResponseManager?.getSessionId() ?? sessionData?.sessionId ?? '';

  const wsUrl = orgName
    ? `${getWebsocketBaseUrl()}/ws/chat?tenant=${orgName.toLowerCase()}&session_id=${sessionId}`
    : '';

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
      filter: (message) => {
        try {
          const data = JSON.parse(message.data);
          if (data.message_type === 'EVENT' && data.message?.event_type === 'HEARTBEAT_ACK') {
            return false;
          }
        } catch (e) {
          console.warn('Failed to parse message', e);
          // If parsing fails, don't filter the message
        }
        return !!sessionId;
      },
      heartbeat: {
        message: () => {
          const response_id = nanoid();
          return JSON.stringify(
            getMessagePayload({
              message: {
                content: '',
                event_data: {},
                event_type: 'HEARTBEAT',
              },
              response_id,
              message_type: 'EVENT',
            }),
          );
        },
        timeout: 120000,
        interval: 60000,
      },
    },
    !!sessionId,
  );

  const { startBackoffTimer, clearTimer } = useExponentialBackoff({
    initialThreshold: INITIAL_INACTIVITY_THRESHOLD,
    maxThreshold: MAX_INACTIVITY_THRESHOLD,
    backoffFactor: BACKOFF_FACTOR,
    maxAttempts: MAX_INACTIVITY_ATTEMPTS,
  });

  // Function to reset the inactivity timer
  const resetInactivityTimer = useCallback(() => {
    clearTimer();
    if (sessionId) {
      startBackoffTimer((state) => {
        // Create and send the USER_INACTIVE event
        const inactivityMessage = {
          content: '',
          event_type: AgentEventType.USER_INACTIVE,
          event_data: {
            ...state,
            currentPage: window.location.pathname,
          },
        };

        handleSendUserMessage({ message: inactivityMessage, message_type: 'EVENT' });
      });
    }
  }, [sessionId]);

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

      // Sanitize the message content before creating payload
      const sanitizedMessage = sanitizeObject(message);
      const payload = getMessagePayload({ message: sanitizedMessage, response_id, message_type });

      // set Latest response id for inactive message - checking from payload
      if (hasUserSentInactiveMessage(payload)) {
        setLatestResponseId(response_id);
      }

      //This is for event messages where the message_type is EVENT
      if ('event_type' in message && 'event_data' in message && !message.content) {
        if (UPDATE_LATEST_RESPONSE_ID_FOR_EVENT_TYPE.includes(message.event_type)) {
          handleAddUserMessage(payload);
        }
        sendMessage(JSON.stringify(payload));
        return;
      }

      handleUpdateOrbState(OrbStatusEnum.thinking);

      if (!hasFirstUserMessageBeenSent) {
        trackEvent(ANALYTICS_EVENT_NAMES.USER_SENT_FIRST_MESSAGE);
        // For Showing the first message in the chat history instantly only for non-demo agents
        // For Demo agents, sessionId is generated when the user provides the email address
        // isInitApiSuccess is true when the sessionId is generated and the session data is fetched from the server
        if (!isAdmin && !isInitApiSuccess) {
          handleAddUserMessage(payload);
        }
        setHasFirstUserMessageBeenSent(true);
      }

      if (!sessionId) {
        messageQueue.current.push(payload);
      } else {
        const updatedPayload = { ...payload, session_id: sessionId };
        handleAddUserMessage(updatedPayload);
        sendMessage(JSON.stringify(updatedPayload));
        resetInactivityTimer();

        if (adminJoinStatus !== AdminConversationJoinStatus.JOINED) {
          setIsAMessageBeingProcessed(true);
          handleAnimatedOrb(response_id);
        }
      }
    },
    [readyState, sessionId, isAMessageBeingProcessed, adminJoinStatus],
  );

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const response = JSON.parse(lastMessage.data) as WebSocketMessage;
      // Reset inactivity timer on incoming message

      if (isMessageAnalyticsEvent(response) && !isAdmin) {
        return;
      }

      handleStopOrbAnimation();

      if (response.actor === 'DEMO' && !isDemoOptionsMessage(response) && !isDemoAvailable(response)) return;

      if (response.role === MessageSenderRole.AI) {
        handleUpdateOrbState(OrbStatusEnum.responding);
        handleAddAIMessage(response);
      } else if (
        response.role === MessageSenderRole.ADMIN &&
        response.message_type === 'EVENT' &&
        response.message.event_type === 'JOIN_SESSION'
      ) {
        setAdminJoinStatus(AdminConversationJoinStatus.JOINED);
        handleAddAdminMessage(response);
      } else if (response.role === MessageSenderRole.ADMIN) {
        handleAddAdminMessage(response);
      }

      setIsAMessageBeingProcessed(false);
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
      resetInactivityTimer();
    });

    messageQueue.current = [];
  }, [readyState, sendMessage, sessionId]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      clearTimer();
      const ws = getWebSocket();
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return { readyState, handleSendUserMessage, sendMessage, lastMessage };
};

export default useWebSocketChat;
