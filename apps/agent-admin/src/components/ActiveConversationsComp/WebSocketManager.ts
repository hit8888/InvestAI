import { useEffect } from 'react';
import useJoinConversationsWebSocket, { SendMessageFn } from '../../hooks/useJoinConversationWebSocket';
import useJoinConversationStore, { JoinConversationStatus } from '../../stores/useJoinConversationStore';

type WebSocketManagerProps = {
  sessionId: string;
  onWebSocketChange: (sessionId: string, sendMessage: SendMessageFn) => void;
};

const conversationEnabledStates = [JoinConversationStatus.PENDING, JoinConversationStatus.JOINED];

const WebSocketManager = ({ sessionId, onWebSocketChange }: WebSocketManagerProps) => {
  const { sessionsStatus } = useJoinConversationStore();

  const { sendMessage } = useJoinConversationsWebSocket({
    sessionId,
    enabled: conversationEnabledStates.includes(sessionsStatus[sessionId]),
  });

  useEffect(() => {
    onWebSocketChange(sessionId, sendMessage);
  }, [sessionId, sendMessage, onWebSocketChange]);

  return null;
};

export default WebSocketManager;
