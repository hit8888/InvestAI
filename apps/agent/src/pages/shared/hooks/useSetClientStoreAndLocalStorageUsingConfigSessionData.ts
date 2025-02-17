import { useEffect } from 'react';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import UnifiedSessionConfigResponseManager, {
  SessionConfigResponseType,
} from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import { useMessageStore } from '../../../stores/useMessageStore';
import { useAreMessagesReadonly } from '@meaku/core/contexts/UrlDerivedDataProvider';
import { nanoid } from 'nanoid';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';

const useSetClientStoreAndLocalStorageUsingConfigSessionData = (
  unifiedConfigurationResponse: SessionConfigResponseType,
) => {
  const isReadOnly = useAreMessagesReadonly();

  const unifiedConfigurationResponseManager = new UnifiedSessionConfigResponseManager(unifiedConfigurationResponse);
  const { handleUpdateSessionData } = useLocalStorageSession();

  const setMessages = useMessageStore((state) => state.setMessages);
  const setLatestResponseId = useMessageStore((state) => state.setLatestResponseId);
  const setHasFirstUserMessageBeenSent = useMessageStore((state) => state.setHasFirstUserMessageBeenSent);

  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const prospectId = unifiedConfigurationResponseManager.getProspectId();
  const welcomeMessage = unifiedConfigurationResponseManager.getConfig().body.welcome_message.message;
  const welcomeMessagePayload: WebSocketMessage = {
    session_id: sessionId ?? '',
    message: { content: welcomeMessage },
    response_id: nanoid(),
    is_admin: false,
    message_type: 'TEXT',
    role: 'ai' as 'user' | 'ai',
    timestamp: new Date().toISOString(),
  };

  useEffect(() => {
    const messages = unifiedConfigurationResponseManager.getFormattedChatHistory(welcomeMessagePayload);
    if (isReadOnly) {
      return;
    }
    setMessages(messages);
    setLatestResponseId(messages[messages.length - 1].response_id);

    if (sessionId && prospectId) {
      handleUpdateSessionData({
        sessionId,
        prospectId,
      });
      setHasFirstUserMessageBeenSent(messages.length > 0);
    }
  }, [handleUpdateSessionData, isReadOnly, prospectId, sessionId]);
};

export { useSetClientStoreAndLocalStorageUsingConfigSessionData };

//for chat screen only, not for admin screens, handle header if the message sent by user is greater than 0 (In case user revists the page) or user sensd the message for the first time:  hasFirstMessageSent
