import { SessionApiResponse } from "@meaku/core/types/session";
import { useQuery } from "@tanstack/react-query";
import { initializeSession } from "../http/api";
import { getBrowserSignature } from "../../../../apps/chatbot/src/utils/tracking";
import { BrowserSignature, InitializationPayload } from "../types/api";
import { BreakoutQueryOptions } from "../types/queries";




const initializeSessionKey = (): unknown[] => ["session-initializer"];

type InitialiseSessionKey = ReturnType<typeof initializeSessionKey>;

interface UseInitializeSessionDataOptions {
  orgName: string;
  agentId: string;
  queryOptions: BreakoutQueryOptions<SessionApiResponse, InitialiseSessionKey>,
  initializeSessionPayload: InitializationPayload

}

const useInitializeSessionData = (
  { orgName, agentId, initializeSessionPayload, queryOptions }: UseInitializeSessionDataOptions
) => {
  return useQuery({
    queryFn: async () => {
      const response = await initializeSession(orgName, agentId, initializeSessionPayload);
      const session = response.data as SessionApiResponse;
      return session;
    },
    ...queryOptions,
    queryKey: initializeSessionKey(),
  });
};

export default useInitializeSessionData;
