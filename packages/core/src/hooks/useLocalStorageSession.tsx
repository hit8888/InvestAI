import { useLocalStorageState } from "ahooks";
import { useParams } from "react-router-dom";
import { useCallback } from "react";
import { AgentParams } from "@neuraltrade/core/types/config";
import { trackError } from "../utils/error";

type Session = {
  sessionId?: string;
  prospectId?: string;
  popupLastClosed?: string;
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    isAgentOpen?: string;
  };
};

const useLocalStorageSession = () => {
  const { orgName = "", agentId = "" } = useParams<AgentParams>();

  const [localStorageSessionData, setLocalStorageSessionData] =
    useLocalStorageState<Session>(`${orgName?.toLowerCase()}-${agentId}`);

  const sessionData: Session = {
    sessionId: localStorageSessionData?.sessionId,
    prospectId: localStorageSessionData?.prospectId,
    popupLastClosed: localStorageSessionData?.popupLastClosed,
    utmParams: localStorageSessionData?.utmParams,
  };

  const handleUpdateSessionData = useCallback(
    async (newSessionData: Partial<Session>) => {
      try {
        const updatedSessionData = {
          ...sessionData,
          ...newSessionData,
        };

        setLocalStorageSessionData(updatedSessionData);
      } catch (error) {
        trackError(error, {
          action: "handleUpdateSessionData",
          component: "useLocalStorageSession",
          sessionId: sessionData?.sessionId,
        });
      }
    },
    []
  );

  return {
    sessionData,
    handleUpdateSessionData,
  };
};

export default useLocalStorageSession;
