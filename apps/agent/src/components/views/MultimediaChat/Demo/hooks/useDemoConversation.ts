import { AIResponse, Message } from '@meaku/core/types/agent';
import useWebSocketChat from '../../../../../hooks/useWebSocketChat';
import { useCallback, useEffect, useState } from 'react';
import { OrbStatusEnum } from '@meaku/core/types/config';
import { useMessageStore } from '../../../../../stores/useMessageStore';
import { convertServerMessageToClientMessage } from '@meaku/core/transformers/common';
import { nanoid } from 'nanoid';
import { DemoEvent, IWebSocketHandleMessage } from '@meaku/core/types/webSocket';
import { useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';
import useGetMessagePayload from '@meaku/core/hooks/useGetMessagePayload';

const useDemoConversation = () => {
  const { sendMessage, lastMessage } = useWebSocketChat();

  const [message, setMessage] = useState<Message>();
  const allowFeedback = useIsAdmin();

  const getMessagePayload = useGetMessagePayload();

  const handleUpdateOrbState = useMessageStore((state) => state.handleUpdateOrbState); //Fix this next PR.Ideally we would not want to put anything in store for this flow

  useEffect(() => {
    if (!lastMessage) return;

    const response = JSON.parse(lastMessage.data) as AIResponse;
    response.showFeedbackOptions = allowFeedback;

    const messageInterface = convertServerMessageToClientMessage(response);

    setMessage(messageInterface);
  }, [lastMessage]);

  const handleSendUserMessage = useCallback(({ message, eventData }: IWebSocketHandleMessage) => {
    handleUpdateOrbState(OrbStatusEnum.thinking);

    const messageId = nanoid();

    setMessage({
      id: nanoid(),
      role: 'user',
      message,
      documents: [],
      analytics: {},
      features: [],
    });

    sendMessage(
      JSON.stringify(getMessagePayload({ message, eventType: DemoEvent.DEMO_QUESTION, eventData, messageId })),
    );
  }, []);

  return {
    handleSendUserMessage,
    message,
  };
};

export { useDemoConversation };
