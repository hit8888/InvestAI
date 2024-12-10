import { useEffect } from 'react';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import UnifiedSessionConfigResponseManager, {
  SessionConfigResponseType,
} from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import { useMessageStore } from '../../../stores/useMessageStore';
import { useAreMessagesReadonly, useIsAdmin } from '../../../shared/UrlDerivedDataProvider';

const useSetClientStoreAndLocalStorageUsingConfigSessionData = (
  unifiedConfigurationResponse: SessionConfigResponseType,
) => {
  const isAdmin = useIsAdmin();
  const isReadOnly = useAreMessagesReadonly();

  const unifiedConfigurationResponseManager = new UnifiedSessionConfigResponseManager(unifiedConfigurationResponse);
  const { handleUpdateSessionData } = useLocalStorageSession();

  const setMessages = useMessageStore((state) => state.setMessages);
  const setHasFirstUserMessageBeenSent = useMessageStore((state) => state.setHasFirstUserMessageBeenSent);

  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const prospectId = unifiedConfigurationResponseManager.getProspectId();

  useEffect(() => {
    const messages = unifiedConfigurationResponseManager.getFormattedChatHistory({
      isAdmin: isAdmin,
      isReadOnly: isReadOnly,
    });
    if (isReadOnly) {
      return;
    }
    if (sessionId && prospectId) {
      handleUpdateSessionData({
        sessionId,
        prospectId,
      });
      setMessages(messages);
      setHasFirstUserMessageBeenSent(messages.length > 0);
    }
  }, [handleUpdateSessionData, isReadOnly, prospectId, sessionId]);
};

export { useSetClientStoreAndLocalStorageUsingConfigSessionData };

//for chat screen only, not for admin screens, handle header if the message sent by user is greater than 0 (In case user revists the page) or user sensd the message for the first time:  hasFirstMessageSent
