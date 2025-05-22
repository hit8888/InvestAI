import { useEffect } from 'react';
import useAdminConversationsWebSocket, { SendMessageFn } from '../../hooks/useAdminConversationWebSocket';
import useJoinConversationStore from '../../stores/useJoinConversationStore';
import { AdminConversationJoinStatus } from '@meaku/core/types/common';

type WebSocketManagerProps = {
  sessionId: string;
  onWebSocketChange: (sessionId: string, sendMessage: SendMessageFn) => void;
};

const conversationEnabledStates = [AdminConversationJoinStatus.PENDING, AdminConversationJoinStatus.JOINED];

const WebSocketManager = ({ sessionId, onWebSocketChange }: WebSocketManagerProps) => {
  const { sessionsStatus } = useJoinConversationStore();

  const { sendMessage } = useAdminConversationsWebSocket({
    sessionId,
    enabled: conversationEnabledStates.includes(sessionsStatus[sessionId]),
  });

  useEffect(() => {
    onWebSocketChange(sessionId, sendMessage);
  }, [sessionId, sendMessage, onWebSocketChange]);

  return null;
};

export default WebSocketManager;
