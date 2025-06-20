import useWebSocket from 'react-use-websocket';
import { useEffect, useState } from 'react';
import { getAccessTokenFromLocalStorage, getTenantFromLocalStorage } from '@meaku/core/utils/index';
import { trackError } from '../utils/error.ts';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import {
  checkIsEventMessage,
  isHeartbeatEvent,
  isMessageAnalyticsEvent,
  isTextMessage,
} from '@meaku/core/utils/messageUtils';
import useJoinConversationStore from '../stores/useJoinConversationStore.ts';
import { useMessageStore } from './useMessageStore.ts';
import { MessageSenderRole } from '@meaku/core/types/common';
import { nanoid } from 'nanoid';
import useGetMessagePayload from '@meaku/core/hooks/useGetMessagePayload';
import { getWebsocketBaseUrl } from '../utils/apiCalls.ts';
import useSound from '@meaku/core/hooks/useSound';
import popupsound from '../assets/popup-sound.mp4';

export type LastMessage = {
  message: string;
  timestamp: string;
};

const HEARTBEAT_INTERVAL = 60 * 1000; // 1 min
const CONNECTION_TIMEOUT = 2 * 60 * 1000; // 2 mins
const MAX_RETRIES = 5;

const useActiveConversationsWebSocket = () => {
  const tenant = getTenantFromLocalStorage();
  const token = getAccessTokenFromLocalStorage();
  const liveConversationsWsUrl =
    tenant && token
      ? `${getWebsocketBaseUrl()}/tenant/ws/active-conversations/events/?tenant=${tenant}&token=${token}`
      : '';

  const [lastMessageBySession, setLastMessageBySession] = useState<Record<string, LastMessage>>({});
  const currentConversation = useJoinConversationStore((state) => state.currentConversation);
  const handleAddAIMessage = useMessageStore((state) => state.handleAddAIMessage);
  const handleAddUserMessage = useMessageStore((state) => state.handleAddAIMessage);
  const getMessagePayload = useGetMessagePayload();

  const baseVolume = 0.2;
  const { play } = useSound(popupsound, baseVolume);

  const { lastMessage, getWebSocket } = useWebSocket(liveConversationsWsUrl, {
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
        play();
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

  useEffect(() => {
    return () => {
      const webSocketConnection = getWebSocket();
      if (webSocketConnection) {
        webSocketConnection.close();
      }
    };
  }, []);

  return { lastMessageBySession, setLastMessageBySession };
};

export default useActiveConversationsWebSocket;
