import { useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ENV } from '@meaku/core/types/env';
import { getAccessTokenFromLocalStorage, getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { nanoid } from 'nanoid';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { useMessageStore } from './useMessageStore';
import { isHeartbeatEvent, isMessageAnalyticsEvent } from '@meaku/core/utils/messageUtils';
import useJoinConversationStore from '../stores/useJoinConversationStore';

const HEARTBEAT_INTERVAL = 60 * 1000; // 1 min
const CONNECTION_TIMEOUT = 2 * 60 * 1000; // 2 mins
const MAX_RETRIES = 5;

interface AdminConversationsWebSocketProps {
  sessionId: string;
  enabled: boolean;
}

export type SendMessageFn = (message: Partial<WebSocketMessage>) => Promise<void>;

export interface AdminConversationsWebSocketInfo {
  readyState: ReadyState;
  sendMessage: SendMessageFn;
  lastMessage: MessageEvent<unknown> | null;
}

const useAdminConversationsWebSocket = ({
  sessionId,
  enabled,
}: AdminConversationsWebSocketProps): AdminConversationsWebSocketInfo => {
  const handleAddAdminMessage = useMessageStore((state) => state.handleAddAdminMessage);
  const setAISuggestionMessage = useMessageStore((state) => state.setAISuggestionMessage);
  const setIsGeneratingAIResponse = useJoinConversationStore((state) => state.setIsGeneratingAIResponse);

  const tenant = getTenantFromLocalStorage();
  const token = getAccessTokenFromLocalStorage();
  const adminConversationsWsUrl =
    tenant && token
      ? `${ENV.VITE_CHAT_BASE_API_URL}/tenant/ws/join-conversation/?tenant=${tenant}&token=${token}&session_id=${sessionId}`
      : '';

  const { lastMessage, sendMessage } = useWebSocket(
    adminConversationsWsUrl,
    {
      share: true,
      retryOnError: true,
      reconnectAttempts: MAX_RETRIES,
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
  }, [lastMessage, setAISuggestionMessage, setIsGeneratingAIResponse]);

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

  // @ts-expect-error type issue
  return { sendMessage: handleSendAdminMessage };
};

export default useAdminConversationsWebSocket;
