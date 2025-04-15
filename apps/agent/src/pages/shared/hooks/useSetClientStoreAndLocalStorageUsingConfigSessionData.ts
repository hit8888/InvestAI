import { useEffect } from 'react';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import { useMessageStore } from '../../../stores/useMessageStore';
import { useAreMessagesReadonly, useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';
import { nanoid } from 'nanoid';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { SessionApiResponseManager } from '@meaku/core/managers/SessionApiResponseManager';
import { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import { SessionApiResponse } from '@meaku/core/types/api/session_init_response';
import { ConfigurationApiResponseManager } from '@meaku/core/managers/ConfigurationApiResponseManager';

const INITIAL_MESSAGES_STATE_LENGTH = 0;
const INITIAL_MESSAGES_STATE_LENGTH_FOR_DEMO_AGENTS = 1;

const useSetClientStoreAndLocalStorageUsingConfigSessionData = ({
  configurationApiResponse,
  sessionApiResponse,
}: {
  configurationApiResponse: ConfigurationApiResponse;
  sessionApiResponse: SessionApiResponse | null;
}) => {
  const isReadOnly = useAreMessagesReadonly();
  const isAdmin = useIsAdmin();

  const sessionApiResponseManager = sessionApiResponse ? new SessionApiResponseManager(sessionApiResponse) : null;
  const configurationApiResponseManager = new ConfigurationApiResponseManager(configurationApiResponse);

  const { handleUpdateSessionData } = useLocalStorageSession();

  const setMessages = useMessageStore((state) => state.setMessages);
  const setLatestResponseId = useMessageStore((state) => state.setLatestResponseId);
  const setHasFirstUserMessageBeenSent = useMessageStore((state) => state.setHasFirstUserMessageBeenSent);

  const sessionId = sessionApiResponseManager?.getSessionId() ?? '';
  const prospectId = sessionApiResponseManager?.getProspectId() ?? '';
  const welcomeMessage = configurationApiResponseManager.getConfig().body.welcome_message.message;
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
    if (isReadOnly) {
      return;
    }

    const messages = sessionApiResponseManager
      ? sessionApiResponseManager.getFormattedChatHistory(welcomeMessagePayload)
      : [welcomeMessagePayload];

    setMessages(messages);
    setLatestResponseId(messages[messages.length - 1].response_id);

    if (sessionId && prospectId) {
      handleUpdateSessionData({
        sessionId,
        prospectId,
      });

      window.parent.postMessage({ type: 'CHAT_INIT', prospectId }, '*');

      if (isAdmin && messages.length === INITIAL_MESSAGES_STATE_LENGTH_FOR_DEMO_AGENTS) {
        return;
      }
      // The messages length will be always INITIAL_MESSAGES_STATE_LENGTH for demo and non demo path
      // For Demo => sessionID and prospectID is initially generated when the user provides the email address and start the chat
      // For Non-Demo agent + chat_widget + isAgentOpen = true => messages.length = INITIAL_MESSAGES_STATE_LENGTH,
      // Adding the check for messages.length > INITIAL_MESSAGES_STATE_LENGTH to handle the case where the agent view will be open and chat messages does not go on the leftside and suggested questions should be visible
      setHasFirstUserMessageBeenSent(messages.length > INITIAL_MESSAGES_STATE_LENGTH);
    }
  }, [handleUpdateSessionData, isReadOnly, isAdmin, prospectId, sessionId]);
};

export { useSetClientStoreAndLocalStorageUsingConfigSessionData };

//for chat screen only, not for admin screens, handle header if the message sent by user is greater than 0 (In case user revists the page) or user sensd the message for the first time:  hasFirstMessageSent
