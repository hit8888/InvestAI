import { useEffect } from 'react';
import useIsAdmin from '../../../hooks/useIsAdmin';
import useLocalStorageSession from '../../../hooks/useLocalStorageSession';
import UnifiedSessionConfigResponseManager, {
  SessionConfigResponseType,
} from '@meaku/core/managers/UnifiedSessionConfigResponseManager';

const useSetLocalStorageUsingConfigSessionData = (unifiedConfigurationResponse: SessionConfigResponseType) => {
  const { isReadOnly: isInternalAdminRoute } = useIsAdmin();

  const unifiedConfigurationResponseManager = new UnifiedSessionConfigResponseManager(unifiedConfigurationResponse);
  const { handleUpdateSessionData } = useLocalStorageSession();

  const sessionId = unifiedConfigurationResponseManager.getSessionId();
  const prospectId = unifiedConfigurationResponseManager.getProspectId();

  useEffect(() => {
    if (isInternalAdminRoute) {
      return;
    }

    if (sessionId) {
      handleUpdateSessionData({
        sessionId: sessionId,
      });
    }

    if (prospectId) {
      handleUpdateSessionData({
        prospectId,
      });
    }
  }, [handleUpdateSessionData, isInternalAdminRoute, prospectId, sessionId]);
};

export { useSetLocalStorageUsingConfigSessionData };

//for chat screen only, not for admin screens, handle header if the message sent by user is greater than 0 (In case user revists the page) or user sensd the message for the first time:  hasFirstMessageSent
