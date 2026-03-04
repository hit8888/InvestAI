import { useEffect } from 'react';
import useAdminConversationsWebSocket, { SendMessageFn } from '../../hooks/useAdminConversationWebSocket';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { AdminConversationJoinStatus } from '@neuraltrade/core/types/common';
import { ReadyState } from 'react-use-websocket';

type WebSocketManagerProps = {
  sessionId: string;
  onWebSocketChange: (sessionId: string, sendMessage: SendMessageFn) => void;
  onConnected?: (sessionId: string) => void;
};

const conversationEnabledStates = [AdminConversationJoinStatus.PENDING, AdminConversationJoinStatus.JOINED];

const WebSocketManager = ({ sessionId, onWebSocketChange, onConnected }: WebSocketManagerProps) => {
  const { sessionsStatus } = useJoinConversationStore();

  const { readyState, sendMessage } = useAdminConversationsWebSocket({
    sessionId,
    enabled: conversationEnabledStates.includes(sessionsStatus[sessionId]),
  });

  useEffect(() => {
    onWebSocketChange(sessionId, sendMessage);
  }, [sessionId, sendMessage, onWebSocketChange]);

  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      onConnected?.(sessionId);
    }
  }, [readyState]);

  return null;
};

export default WebSocketManager;
