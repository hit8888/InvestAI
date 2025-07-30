import { useEffect, useMemo } from 'react';
import useLocalStorageSession from '@meaku/core/hooks/useLocalStorageSession';
import { useMessageStore } from '../../../stores/useMessageStore';
import { useAreMessagesReadonly, useIsAdmin } from '@meaku/core/contexts/UrlDerivedDataProvider';
import { nanoid } from 'nanoid';
import { WebSocketMessage } from '@meaku/core/types/webSocketData';
import { SessionApiResponseManager } from '@meaku/core/managers/SessionApiResponseManager';
import { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import { SessionApiResponse } from '@meaku/core/types/api/session_init_response';
import { ConfigurationApiResponseManager } from '@meaku/core/managers/ConfigurationApiResponseManager';
import { hasDemoEndMessage } from '@meaku/core/utils/messageUtils';
import { MESSAGE_STATE } from '@meaku/core/utils/index';

const { EMPTY, DEMO_START, FIRST_AND_WELCOME, FIRST_WELCOME_LOADING_TEXT } = MESSAGE_STATE;

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
  const messagesStore = useMessageStore((state) => state.messages);
  const setLatestResponseId = useMessageStore((state) => state.setLatestResponseId);
  const setHasFirstUserMessageBeenSent = useMessageStore((state) => state.setHasFirstUserMessageBeenSent);

  const sessionId = sessionApiResponseManager?.getSessionId() ?? '';
  const prospectId = sessionApiResponseManager?.getProspectId() ?? '';
  const welcomeMessage = configurationApiResponseManager.getConfig().body.welcome_message.message;

  // Memoizing the welcome message payload to avoid re-rendering the welcome message payload when the sessionId changes
  const welcomeMessagePayload: WebSocketMessage = useMemo(
    () => ({
      session_id: sessionId ?? '',
      message: { content: welcomeMessage },
      response_id: nanoid(),
      is_admin: false,
      message_type: 'TEXT',
      role: 'ai' as 'user' | 'ai',
      timestamp: new Date().toISOString(),
    }),
    [welcomeMessage],
  );

  useEffect(() => {
    if (isReadOnly) {
      return;
    }

    // For Showing the first message in the chat history instantly
    // messagesStore.length === 2 is for the case when the user has sent the first message ( without sessionId) + welcome message
    // messagesStore.length === 3 is for the case when the user has sent the first message ( without sessionId) + welcome message + ai message LOADING_TEXT ( Overlay agent )
    const newMessages =
      messagesStore.length === FIRST_AND_WELCOME || messagesStore.length === FIRST_WELCOME_LOADING_TEXT
        ? [...messagesStore]
        : [welcomeMessagePayload];

    const messages = sessionApiResponseManager
      ? sessionApiResponseManager.getFormattedChatHistory(newMessages)
      : [welcomeMessagePayload];

    setMessages(messages);

    // Find the last AI message and use its response_id
    // There may be case when last message is from user - FORM_FILLED event goes and then refreshed
    const lastAiMessage = messages
      .slice()
      .reverse()
      .find((message) => message.role === 'ai');

    const lastMessageResponseId = messages[messages.length - 1].response_id;

    const demoEndMessageExist = hasDemoEndMessage(messages);
    const demoEndLastMessageExist = demoEndMessageExist?.response_id === lastAiMessage?.response_id;

    if (demoEndLastMessageExist) {
      setLatestResponseId(demoEndMessageExist?.response_id ?? lastMessageResponseId);
    } else {
      setLatestResponseId(lastAiMessage?.response_id ?? lastMessageResponseId);
    }

    if (sessionId && prospectId) {
      handleUpdateSessionData({
        sessionId,
        prospectId,
      });

      window.parent.postMessage({ type: 'CHAT_INIT', prospectId }, '*');

      if (isAdmin && messages.length === DEMO_START) {
        return;
      }

      const userMessages = messages.filter((message) => message.role === 'user');
      // The messages length will be always INITIAL_MESSAGES_STATE_LENGTH for demo and non demo path
      // For Demo => sessionID and prospectID is initially generated when the user provides the email address and start the chat
      // For Non-Demo agent + chat_widget + isAgentOpen = true => messages.length = INITIAL_MESSAGES_STATE_LENGTH,
      // Adding the check for messages.length > INITIAL_MESSAGES_STATE_LENGTH to handle the case where the agent view will be open and chat messages does not go on the leftside and suggested questions should be visible
      setHasFirstUserMessageBeenSent(userMessages.length > EMPTY);
    }
  }, [handleUpdateSessionData, isReadOnly, isAdmin, prospectId, sessionId]);
};

export { useSetClientStoreAndLocalStorageUsingConfigSessionData };

//for chat screen only, not for admin screens, handle header if the message sent by user is greater than 0 (In case user revists the page) or user sensd the message for the first time:  hasFirstMessageSent
