import { useEffect, useRef } from 'react';

import { useCommandBarStore } from '../stores';
import type { Message } from '../types/message';
import { getUserMessage } from '../utils/chat-utils';
import { jsonSafeParse } from '@meaku/core/utils/index';
import { ENV } from '../constants/env';
import WebSocketClient from '@meaku/core/networkClients/wsClient/wsClient';
import { useIncomingMessageSound } from './useIncomingMessageSound';
import { useFeature } from '../containers/FeatureProvider';

export const wsClient = new WebSocketClient(`${ENV.VITE_BASE_WS_URL}/ws/chat`, {
  heartbeat: {
    interval: 60000,
  },
});

export const useWsClient = () => {
  const { addMessage, updateSuggestedQuestions, isMessageRenderable } = useCommandBarStore();
  const { activeFeatureModuleId } = useFeature();
  const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);
  const { playSoundForMessage } = useIncomingMessageSound();

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

        if (isMessageRenderable(data)) {
          playSoundForMessage(data);
        }
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
      command_bar_module_id: activeFeatureModuleId,
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
