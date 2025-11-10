import { useCallback, useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { nanoid } from 'nanoid';
import { useSessionStore } from '../stores/useSessionStore';
import { EventMessageContent, WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useMessageStore } from './useMessageStore';
import { isHeartbeatEvent, isMessageAnalyticsEvent } from '@meaku/core/utils/messageUtils';
import useJoinConversationStore from '../stores/useJoinConversationStore';
import { getWebsocketBaseUrl } from '../utils/apiCalls';
import useTabNotification from '@meaku/core/hooks/useTabNotification';

const HEARTBEAT_INTERVAL = 60 * 1000; // 1 min
const CONNECTION_TIMEOUT = 2 * 60 * 1000; // 2 mins
const MAX_RETRIES = 5;
const INITIAL_RETRY_INTERVAL = 1000;
const MAX_RETRY_INTERVAL = 20000;

interface AdminConversationsWebSocketProps {
  sessionId: string;
  enabled: boolean;
}

export type SendMessageFn = (message: Partial<WebSocketMessage>) => Promise<void>;

export type SendAdminMessageFn = (message: Partial<EventMessageContent>) => void;

export type SendAdminMessageWithSessionIdFn = (sessionId: string, message: Partial<EventMessageContent>) => void;

export interface AdminConversationsWebSocketInfo {
  readyState: ReadyState;
  sendMessage: SendMessageFn;
}

const useAdminConversationsWebSocket = ({
  sessionId,
  enabled,
}: AdminConversationsWebSocketProps): AdminConversationsWebSocketInfo => {
  const [retryInterval, setRetryInterval] = useState(INITIAL_RETRY_INTERVAL);
  const handleAddAdminMessage = useMessageStore((state) => state.handleAddAdminMessage);
  const setAISuggestionMessage = useMessageStore((state) => state.setAISuggestionMessage);
  const setIsGeneratingAIResponse = useJoinConversationStore((state) => state.setIsGeneratingAIResponse);

  const tenant = useSessionStore((state) => state.activeTenant?.['tenant-name']);
  const token = useSessionStore((state) => state.accessToken);
  const adminConversationsWsUrl =
    tenant && token
      ? `${getWebsocketBaseUrl()}/tenant/ws/join-conversation/?tenant=${tenant}&token=${token}&session_id=${sessionId}`
      : '';

  const { readyState, lastMessage, sendMessage } = useWebSocket(
    adminConversationsWsUrl,
    {
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
        return !!sessionId;
      },
      heartbeat: {
        message: () => {
          const response_id = nanoid();

          return JSON.stringify({
            session_id: sessionId,
            response_id,
            message: {
              content: '',
              event_data: {},
              event_type: 'HEARTBEAT',
            },
            message_type: 'EVENT',
            timestamp: new Date().toISOString(),
          });
        },
        timeout: CONNECTION_TIMEOUT,
        interval: HEARTBEAT_INTERVAL,
      },
    },
    enabled,
  );

  useEffect(() => {
    if (!lastMessage) return;

    const response = JSON.parse(lastMessage.data) as WebSocketMessage;

    if (
      response.message &&
      'event_type' in response.message &&
      response.message.event_type === 'RESPONSE_SUGGESTIONS'
    ) {
      const aiSuggestion = response.message.event_data?.suggestions?.[0] ?? '';
      setAISuggestionMessage(aiSuggestion);
      setIsGeneratingAIResponse(false);
    }

    if (response.message && 'event_type' in response.message && response.message.event_type === 'JOIN_SESSION') {
      handleAddAdminMessage(response);
    }
  }, [lastMessage, setAISuggestionMessage, setIsGeneratingAIResponse, handleAddAdminMessage]);

  const handleSendAdminMessage = useCallback(
    async ({ message, message_type }: WebSocketMessage) => {
      const response_id = nanoid();
      // @ts-expect-error type issue
      const payload: WebSocketMessage = {
        session_id: sessionId,
        response_id,
        message_type,
        message,
        role: 'admin',
        timestamp: new Date().toISOString(),
      };

      sendMessage(JSON.stringify(payload));
      handleAddAdminMessage(payload);
    },
    [sessionId, sendMessage, handleAddAdminMessage],
  );

  useTabNotification({ recentMessage: lastMessage });

  // @ts-expect-error type issue
  return { readyState, sendMessage: handleSendAdminMessage };
};

export default useAdminConversationsWebSocket;
