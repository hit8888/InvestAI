import { useEffect, useRef } from 'react';

import { wsClient } from '../network/websocket/client';
import { useCommandBarStore } from '../stores/useCommandBarStore';
import type { Message } from '@meaku/shared/types/message';
import { getUserMessage } from '@meaku/shared/utils/chat-utils';
import { jsonSafeParse } from '@meaku/core/utils/index';

export const useChat = () => {
  const { addMessage, updateSuggestedQuestions } = useCommandBarStore();
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);

  const initialiseSocket = async (sessionId: string, tenantId: string) => {
    if (!sessionId || !tenantId) {
      return;
    }

    wsClient.connect({
      queryParams: { command_bar: 1, tenant: tenantId, session_id: sessionId },
      interceptor: (message) => {
        const { data } = jsonSafeParse(message);

        if (data) {
          return JSON.stringify({
            ...data,
            session_id: sessionId,
          });
        }

        return message;
      },
    });

    messageHandlerRef.current = (event: MessageEvent) => {
      const { data } = jsonSafeParse(event.data);

      if (data) {
        addMessage(data);
      }
    };

    const ws = wsClient.getSocket();
    if (ws) {
      ws.addEventListener('message', messageHandlerRef.current);
    }
  };

  const sendUserMessage = (message: string, overrides?: Partial<Message>) => {
    const userMessage = getUserMessage(message, {
      ...overrides,
    });

    wsClient.send(JSON.stringify(userMessage));
    addMessage(userMessage as Message);
    // Always reset suggested questions when any event is sent
    updateSuggestedQuestions([]);
  };

  useEffect(() => {
    return () => {
      const ws = wsClient.getSocket();
      if (ws && messageHandlerRef.current) {
        ws.removeEventListener('message', messageHandlerRef.current);
      }
    };
  }, []);

  return { initialiseSocket, sendUserMessage };
};
