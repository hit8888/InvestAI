import useWebSocket from 'react-use-websocket';
import { ENV } from '@meaku/core/types/env';
import { useEffect, useState } from 'react';
import { getAccessTokenFromLocalStorage, getTenantFromLocalStorage } from '../utils/common.ts';
import { trackError } from '../utils/error.ts';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import {
  checkIsEventMessage,
  isHeartbeatEvent,
  isMessageAnalyticsEvent,
  isTextMessage,
} from '@meaku/core/utils/messageUtils';

const useActiveConversationsWebSocket = () => {
  const tenant = getTenantFromLocalStorage();
  const token = getAccessTokenFromLocalStorage();
  const liveConversationsWsUrl =
    tenant && token ? `${ENV.VITE_WEBSOCKET_URL}/active-conversations/events/?tenant=${tenant}&token=${token}` : '';

  const [lastMessageBySession, setLastMessageBySession] = useState<Record<string, string>>({});

  const { lastMessage, getWebSocket } = useWebSocket(liveConversationsWsUrl);

  useEffect(() => {
    if (!lastMessage) return;

    try {
      const response = JSON.parse(lastMessage.data) as WebSocketMessage;

      if (isMessageAnalyticsEvent(response) || isHeartbeatEvent(response)) {
        return;
      }

      if (isTextMessage(response) || checkIsEventMessage(response)) {
        const { session_id, message, role } = response;

        if (role === 'user' && message.content) {
          setLastMessageBySession((lastMessageBySession) => ({
            ...lastMessageBySession,
            [session_id]: message.content ?? '',
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

  useEffect(() => {
    return () => {
      const webSocketConnection = getWebSocket();
      if (webSocketConnection) {
        webSocketConnection.close();
      }
    };
  }, []);

  return { lastMessageBySession };
};

export default useActiveConversationsWebSocket;
