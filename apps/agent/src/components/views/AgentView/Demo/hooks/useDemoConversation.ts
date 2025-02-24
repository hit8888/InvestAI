import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import useWebSocketChat from '../../../../../hooks/useWebSocketChat';
import { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { AgentEventType } from '@meaku/core/types/webSocketData';
import useGetMessagePayload from '@meaku/core/hooks/useGetMessagePayload';

const useDemoConversation = () => {
  const { sendMessage, lastMessage } = useWebSocketChat();

  const [message, setMessage] = useState<WebSocketMessage>();

  const getMessagePayload = useGetMessagePayload();

  useEffect(() => {
    if (!lastMessage) return;

    const response = JSON.parse(lastMessage.data) as WebSocketMessage;
    console.log({ response });
    setMessage(response);
  }, [lastMessage]);

  const handleSendUserMessage = useCallback((message: string) => {
    const response_id = nanoid();

    const webSocketMessage = getMessagePayload({
      message: { content: message, event_type: AgentEventType.DEMO_QUESTION, event_data: {} },
      response_id,
      message_type: 'EVENT',
    });
    setMessage(webSocketMessage);

    sendMessage(JSON.stringify(webSocketMessage));
  }, []);

  return {
    handleSendUserMessage,
    message,
  };
};

export { useDemoConversation };
