import { Session } from "@meaku/core/types/session";
import { useQuery } from "@tanstack/react-query";
import { initializeSession } from "../http/api";
import { getBrowserSignature } from "../../../../apps/chatbot/src/utils/tracking";
import { BrowserSignature } from "../types/api";




const configDataKey = (): unknown[] => ["session-initializer"];

type ConfigDataKey = ReturnType<typeof configDataKey>;

interface UseInitializeSessionDataOptions {
  ignoreUpdatingLocalStorage?: boolean;
  sessionId?: string;
  prospectId?: string;
  orgName: string;
  agentId: string;
  browser_signature: Partial<BrowserSignature>;
  queryOptions: BreakoutQueryOptions<ConfigurationApiResponse, ConfigDataKey>,

}

const useInitializeSessionData = (
  options: UseInitializeSessionDataOptions = {},
) => {
  const { ignoreUpdatingLocalStorage = false, sessionId, prospectId } = options;


  const effectiveSessionId = sessionId;
  const effectiveProspectId = prospectId;

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
