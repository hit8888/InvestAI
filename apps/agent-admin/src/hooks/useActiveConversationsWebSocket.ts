import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';
import { useSessionStore } from '../stores/useSessionStore';
import { trackError } from '../utils/error.ts';
import { WebSocketMessage } from '@neuraltrade/core/types/webSocketData';
import {
  checkIsEventMessage,
  checkIsUserLeftMessage,
  isHeartbeatEvent,
  isMessageAnalyticsEvent,
  isTextMessage,
} from '@neuraltrade/core/utils/messageUtils';
import useJoinConversationStore from '../stores/useJoinConversationStore.ts';
import { useMessageStore } from './useMessageStore.ts';
import { MessageSenderRole } from '@neuraltrade/core/types/common';
import { nanoid } from 'nanoid';
import useGetMessagePayload from '@neuraltrade/core/hooks/useGetMessagePayload';
import { getWebsocketBaseUrl } from '../utils/apiCalls.ts';
import useSound from '@neuraltrade/core/hooks/useSound';
import popupsound from '../assets/popup-sound.mp4';

export type LastMessage = {
  message: string;
  timestamp: string;
};

export type UserLeftBySession = Record<string, boolean>;

const HEARTBEAT_INTERVAL = 60 * 1000; // 1 min
const CONNECTION_TIMEOUT = 2 * 60 * 1000; // 2 mins
const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;

// Storage key for persisting user left status
const getUserLeftStorageKey = (tenant: string | null) => `user_left_by_session_${tenant || 'default'}`;

// Helper functions for localStorage operations
const loadUserLeftFromStorage = (tenant: string | null): UserLeftBySession => {
  try {
    const stored = localStorage.getItem(getUserLeftStorageKey(tenant));
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to load user left status from localStorage:', error);
    return {};
  }
};

const saveUserLeftToStorage = (tenant: string | null, data: UserLeftBySession): void => {
  try {
    localStorage.setItem(getUserLeftStorageKey(tenant), JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save user left status to localStorage:', error);
  }
};

const cleanupUserLeftStorage = (tenant: string | null, validSessionIds: string[]): UserLeftBySession => {
  try {
    const stored = loadUserLeftFromStorage(tenant);
    const cleaned: UserLeftBySession = {};

    // Only keep entries for sessions that are still valid
    validSessionIds.forEach((sessionId) => {
      if (stored[sessionId] !== undefined) {
        cleaned[sessionId] = stored[sessionId];
      }
    });

    saveUserLeftToStorage(tenant, cleaned);
    return cleaned;
  } catch (error) {
    console.warn('Failed to cleanup user left storage:', error);
    return {};
  }
};

const useActiveConversationsWebSocket = () => {
  const { accessToken: token, activeTenant } = useSessionStore();
  const tenant = activeTenant?.['tenant-name'] ?? null;

  const liveConversationsWsUrl =
    tenant && token
      ? `${getWebsocketBaseUrl()}/tenant/ws/active-conversations/events/?tenant=${tenant}&token=${token}`
      : '';

  const [lastMessageBySession, setLastMessageBySession] = useState<Record<string, LastMessage>>({});
  const [hasUserLeftBySession, setHasUserLeftBySession] = useState<UserLeftBySession>(() =>
    loadUserLeftFromStorage(tenant ?? null),
  );
  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);
  const currentConversation = useJoinConversationStore((state) => state.currentConversation);
  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);
  const handleAddUserMessage = useMessageStore((state) => state.handleAddAIMessage);
  const getMessagePayload = useGetMessagePayload();

  const baseVolume = 0.2;
  const { play } = useSound(popupsound, baseVolume);

  const { readyState, lastMessage, getWebSocket } = useWebSocket(liveConversationsWsUrl, {
    share: true,
    retryOnError: true,
    shouldReconnect: () => true,
    reconnectAttempts: MAX_RETRIES,
    reconnectInterval: (retryCount) => {
      const interval = Math.min(retryInterval * Math.pow(2, retryCount - 1), MAX_RETRY_INTERVAL);
      setRetryInterval(interval);
      return interval;
    },
    filter: (message) => {
      try {
        const messageData = JSON.parse(message.data);

        if (isHeartbeatEvent(messageData) || isMessageAnalyticsEvent(messageData)) {
          return false;
        }
      } catch (e) {
        console.warn('Failed to parse message', e);
      }
      return true;
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
            role: MessageSenderRole.ADMIN,
            response_id,
            message_type: 'EVENT',
          }),
        );
      },
      timeout: CONNECTION_TIMEOUT,
      interval: HEARTBEAT_INTERVAL,
    },
  });

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const response = JSON.parse(lastMessage.data) as WebSocketMessage;

      if (response.role === MessageSenderRole.AI && response.session_id === currentConversation?.session_id) {
        handleAddAIMessage(response);
      } else if (response.role === MessageSenderRole.USER && response.session_id === currentConversation?.session_id) {
        handleAddUserMessage(response);

        if (document.visibilityState === 'hidden') {
          play();
        }
      }

      // Handle USER_LEFT event for any session (not just current conversation)
      if (checkIsUserLeftMessage(response)) {
        setHasUserLeftBySession((prev) => ({
          ...prev,
          [response.session_id]: true,
        }));
      }

      if (isTextMessage(response) || checkIsEventMessage(response)) {
        const { session_id, message, role } = response;

        if (role === MessageSenderRole.USER && message.content) {
          setLastMessageBySession((lastMessageBySession) => ({
            ...lastMessageBySession,
            [session_id]: {
              message: message.content ?? '',
              timestamp: response.timestamp,
            },
          }));
        }
      }
    } catch (error) {
      trackError(error, {
        action: 'active-conversation-listener',
        component: 'useActiveConversationsWebSocket',
      });
    }
  }, [lastMessage]);

  // Persist hasUserLeftBySession to localStorage whenever it changes
  useEffect(() => {
    saveUserLeftToStorage(tenant ?? null, hasUserLeftBySession);
  }, [hasUserLeftBySession, tenant]);

  // Handle tenant changes - reload state when tenant changes
  useEffect(() => {
    const newData = loadUserLeftFromStorage(tenant ?? null);
    setHasUserLeftBySession(newData);
  }, [tenant]);

  useEffect(() => {
    return () => {
      const webSocketConnection = getWebSocket();
      if (webSocketConnection) {
        webSocketConnection.close();
      }
    };
  }, []);

  // Cleanup function to remove expired sessions
  const cleanupExpiredSessions = (validSessionIds: string[]) => {
    const cleaned = cleanupUserLeftStorage(tenant ?? null, validSessionIds);
    setHasUserLeftBySession(cleaned);
  };

  return {
    readyState,
    lastMessageBySession,
    setLastMessageBySession,
    hasUserLeftBySession,
    setHasUserLeftBySession,
    cleanupExpiredSessions,
  };
};

export default useActiveConversationsWebSocket;
