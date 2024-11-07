import { useLocalStorageState } from "ahooks";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { LOCAL_STORAGE_KEYS } from "../constants/localStorage";
import { useChatStore } from "../stores/useChatStore";
import { ChatParams } from "@meaku/core/types/msc";
import { trackError } from "../utils/error";

type Session = {
  sessionId?: string;
  prospectId?: string;
  showTooltip: boolean;
};

const useLocalStorageSession = () => {
  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const localStorageKey = `${orgName?.toLowerCase()}-${agentId}`;
  const fallbackSessionKey = LOCAL_STORAGE_KEYS.FALLBACK_SESSION_ID;
  const fallbackProspectKey = LOCAL_STORAGE_KEYS.FALLBACK_PROSPECT_ID;

  const [session, setSession] = useLocalStorageState<Session>(localStorageKey);
  const [fallbackSessionId, setFallbackSessionId] =
    useLocalStorageState<string>(fallbackSessionKey);
  const [fallbackProspectId, setFallbackProspectId] =
    useLocalStorageState<string>(fallbackProspectKey);

  const setShowTooltip = useChatStore((state) => state.setShowTooltip);

  const sessionData: Session = {
    sessionId: session?.sessionId || fallbackSessionId,
    prospectId: session?.prospectId || fallbackProspectId,
    showTooltip: session?.showTooltip ?? true,
  };

  const handleUpdateSessionData = async (newSessionData: Partial<Session>) => {
    try {
      const updatedSessionData = {
        ...sessionData,
        ...newSessionData,
      };

      setSession(updatedSessionData);

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

  useEffect(() => {
    if (!session) return;

    setShowTooltip(session.showTooltip);
  }, [session]);

  return {
    sessionData,
    handleUpdateSessionData,
  };
};

export default useLocalStorageSession;
