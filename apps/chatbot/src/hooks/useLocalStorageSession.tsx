import { useLocalStorageState } from 'ahooks';
import { useParams } from 'react-router-dom';
import { ChatParams } from '@meaku/core/types/msc';
import { trackError } from '../utils/error';

type Session = {
  sessionId?: string;
  prospectId?: string;
  showTooltip: boolean;
  isChatOpen: boolean;
};

const useLocalStorageSession = () => {
  const { orgName = '', agentId = '' } = useParams<ChatParams>();

  const [localStorageData, setSession] = useLocalStorageState<Session>(`${orgName?.toLowerCase()}-${agentId}`);

  const sessionData: Session = {
    sessionId: localStorageData?.sessionId,
    prospectId: localStorageData?.prospectId,
    showTooltip: localStorageData?.showTooltip ?? true,
    isChatOpen: localStorageData?.isChatOpen ?? true,
  };

  const handleUpdateSessionData = async (newSessionData: Partial<Session>) => {
    try {
      const updatedSessionData = {
        ...sessionData,
        ...newSessionData,
        isChatOpen: newSessionData.isChatOpen ?? sessionData.isChatOpen ?? true,
      };

      setSession(updatedSessionData);
    } catch (error) {
      trackError(error, {
        action: 'handleUpdateSessionData',
        component: 'useLocalStorageSession',
        sessionId: sessionData?.sessionId,
      });
    }
  };

  return {
    sessionData,
    handleUpdateSessionData,
  };
};

export default useLocalStorageSession;
