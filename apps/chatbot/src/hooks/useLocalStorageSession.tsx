import { useLocalStorageState } from "ahooks";
import { trackError } from "../utils/error";

type Props = {
  orgName: string;
  agentId: string;
};

type Session = {
  sessionId?: string;
  prospectId?: string;
  showTooltip: boolean;
};

const useLocalStorageSession = (props: Props) => {
  const { orgName, agentId } = props;

  const localStorageKey = `${orgName}-${agentId}`;
  const fallbackSessionKey = "sessionId";
  const fallbackProspectKey = "prospectId";

  const [session, setSession] = useLocalStorageState<Session>(localStorageKey);
  const [fallbackSessionId, setFallbackSessionId] =
    useLocalStorageState<string>(fallbackSessionKey);
  const [fallbackProspectId, setFallbackProspectId] =
    useLocalStorageState<string>(fallbackProspectKey);

  const sessionData: Session = {
    sessionId: session?.sessionId || fallbackSessionId,
    prospectId: session?.prospectId || fallbackProspectId,
    showTooltip: session?.showTooltip ?? true,
  };

  const handleUpdateSessionData = (newSessionData: Partial<Session>) => {
    try {
      setSession({
        ...sessionData,
        ...newSessionData,
      });

      // Remove fallback session and prospect id
      setFallbackSessionId(undefined);
      setFallbackProspectId(undefined);
    } catch (error) {
      trackError(error, {
        action: "handleUpdateSessionData",
        component: "useLocalStorageSession",
        sessionId: sessionData?.sessionId || fallbackSessionId,
      });
    }
  };

  return {
    sessionData,
    handleUpdateSessionData,
  };
};

export default useLocalStorageSession;
