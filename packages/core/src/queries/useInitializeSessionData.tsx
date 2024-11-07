import { Session } from "@meaku/core/types/session";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { initializeSession } from "../../lib/http/api";
import { ChatParams } from "../../types/msc";
import { getBrowserSignature } from "../../utils/tracking";
import useIsAdmin from "../useIsAdmin";
import useLocalStorageSession from "../useLocalStorageSession";

interface UseInitializeSessionDataOptions {
  ignoreUpdatingLocalStorage?: boolean;
  sessionId?: string;
  prospectId?: string;
}

const useInitializeSessionData = (
  options: UseInitializeSessionDataOptions = {},
) => {
  const { ignoreUpdatingLocalStorage = false, sessionId, prospectId } = options;

  const { orgName = "", agentId = "" } = useParams<ChatParams>();

  const { sessionData: sessionDataInLocalStorage } =
    useLocalStorageSession();

  const { isAdmin } = useIsAdmin(); //TODO: take this as props

  const effectiveSessionId = sessionId || sessionDataInLocalStorage?.sessionId;
  const effectiveProspectId =
    prospectId || sessionDataInLocalStorage?.prospectId;

  const {
    data: session,
    isFetching,
    isError,
    error,
    ...query
  } = useQuery({
    queryKey: ["session-initializer"],
    queryFn: async () => {
      const response = await initializeSession(orgName, agentId, {
        session_id: effectiveSessionId,
        prospect_id: effectiveProspectId,
        browser_signature: getBrowserSignature(),
        is_admin: isAdmin,
      });

      const session = response.data as Session;
      return session;
    },
    staleTime: Infinity,
    enabled:
      Boolean(orgName) &&
      Boolean(agentId) &&
      Boolean(
        sessionDataInLocalStorage.sessionId || ignoreUpdatingLocalStorage,
      ),
  });

  return { session, isFetching, isError, error, isAdmin, ...query };
};

export default useInitializeSessionData;
