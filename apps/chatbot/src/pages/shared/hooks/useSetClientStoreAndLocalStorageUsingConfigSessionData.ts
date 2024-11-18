import { useEffect } from 'react';
import useIsAdmin from '../../../hooks/useIsAdmin';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import UnifiedSessionConfigResponseManager, {
  SessionConfigResponseType,
} from '@meaku/core/managers/UnifiedSessionConfigResponseManager';
import { useMessageStore } from '../../../stores/useMessageStore';
import { useChatStore } from '../../../stores/useChatStore';

const useSetClientStoreAndLocalStorageUsingConfigSessionData = (
  unifiedConfigurationResponse: SessionConfigResponseType,
) => {
  const { isReadOnly: isInternalAdminRoute } = useIsAdmin();

  const unifiedConfigurationResponseManager = new UnifiedSessionConfigResponseManager(unifiedConfigurationResponse);
  const { handleUpdateSessionData } = useLocalStorageSession();

  const setMessages = useMessageStore((state) => state.setMessages);
  const setHasFirstUserMessageBeenSent = useChatStore((state) => state.setHasFirstUserMessageBeenSent);

  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const prospectId = unifiedConfigurationResponseManager.getProspectId();

  useEffect(() => {
    const messages = unifiedConfigurationResponseManager.getFormattedChatHistory({
      isAdmin: isInternalAdminRoute,
      isReadOnly: isInternalAdminRoute,
    });
    if (isInternalAdminRoute) {
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
  }, [handleUpdateSessionData, isInternalAdminRoute, prospectId, sessionId]);
};

export { useSetClientStoreAndLocalStorageUsingConfigSessionData };

//for chat screen only, not for admin screens, handle header if the message sent by user is greater than 0 (In case user revists the page) or user sensd the message for the first time:  hasFirstMessageSent
