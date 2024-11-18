import { useLocalStorageState } from 'ahooks';
import { useParams } from 'react-router-dom';
import { trackError } from '../utils/error';
import { useCallback } from 'react';
import { ChatParams } from '@meaku/core/types/config';

type Session = {
  sessionId?: string;
  prospectId?: string;
  showTooltip: boolean;
  isChatOpen: boolean;
};

const useLocalStorageSession = () => {
  const { orgName = '', agentId = '' } = useParams<ChatParams>();

  const [localStorageSessionData, setLocalStorageSessionData] = useLocalStorageState<Session>(
    `${orgName?.toLowerCase()}-${agentId}`,
  );

  const sessionData: Session = {
    sessionId: localStorageSessionData?.sessionId,
    prospectId: localStorageSessionData?.prospectId,
    showTooltip: localStorageSessionData?.showTooltip ?? true,
    isChatOpen: localStorageSessionData?.isChatOpen ?? true,
  };

  const handleUpdateSessionData = useCallback(async (newSessionData: Partial<Session>) => {
    try {
      const updatedSessionData = {
        ...sessionData,
        ...newSessionData,
        isChatOpen: newSessionData.isChatOpen ?? sessionData.isChatOpen ?? true,
      };

      setLocalStorageSessionData(updatedSessionData);
    } catch (error) {
      trackError(error, {
        action: 'handleUpdateSessionData',
        component: 'useLocalStorageSession',
        sessionId: sessionData?.sessionId,
      });
    }
  }, []);

  return {
    sessionData,
    handleUpdateSessionData,
  };
};

export default useLocalStorageSession;
