import { useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { ENV } from '@meaku/core/types/env';
import { getAccessTokenFromLocalStorage, getTenantFromLocalStorage } from '../utils/common';
import { nanoid } from 'nanoid';
import useGetMessagePayload from '@meaku/core/hooks/useGetMessagePayload';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';

const MAX_RETRIES = 5;

interface JoinConversationsWebSocketProps {
  sessionId: string;
  enabled: boolean;
}

export type WebSocketTextMessage = Pick<WebSocketMessage, 'message' | 'message_type'>;
export type SendMessageFn = (message: WebSocketTextMessage) => Promise<void>;

export interface JoinConversationsWebSocketInfo {
  readyState: ReadyState;
  sendMessage: SendMessageFn;
  lastMessage: MessageEvent<unknown> | null;
}

const useJoinConversationsWebSocket = ({
  sessionId,
  enabled,
}: JoinConversationsWebSocketProps): JoinConversationsWebSocketInfo => {
  const tenant = getTenantFromLocalStorage();
  const token = getAccessTokenFromLocalStorage();

  const joinConversationsWsUrl =
    tenant && token
      ? `${ENV.VITE_WEBSOCKET_URL}/join-conversation/?tenant=${tenant}&token=${token}&session_id=${sessionId}`
      : '';

  const getMessagePayload = useGetMessagePayload();

  const { lastMessage, readyState, sendMessage } = useWebSocket(
    joinConversationsWsUrl,
    {
      share: true,
      retryOnError: true,
      reconnectAttempts: MAX_RETRIES,
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
    enabled,
  );

  const handleSendAdminMessage = useCallback(async ({ message, message_type }: WebSocketTextMessage) => {
    const response_id = nanoid();
    const payload = {
      session_id: sessionId,
      response_id,
      role: 'admin',
      is_admin: true,
      timestamp: new Date().toISOString(),
      message_type,
      message,
    };

    sendMessage(JSON.stringify(payload));
  }, []);

  return { lastMessage, readyState, sendMessage: handleSendAdminMessage };
};

export default useJoinConversationsWebSocket;
