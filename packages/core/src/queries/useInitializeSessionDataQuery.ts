import { useQuery } from "@tanstack/react-query";
import { initializeSession } from "../http/api";
import {  InitializationPayload } from "../types/api";
import { BreakoutQueryOptions } from "../types/queries";
import { SessionApiResponse } from "../types/session";




const initializeSessionKey = (): unknown[] => ["session-initializer"];

type InitialiseSessionKey = ReturnType<typeof initializeSessionKey>;

interface UseInitializeSessionDataOptions {
  agentId: string;
  queryOptions: BreakoutQueryOptions<SessionApiResponse, InitialiseSessionKey>,
  initializeSessionPayload: InitializationPayload

}

const useInitializeSessionDataQuery = (
  { agentId, initializeSessionPayload, queryOptions }: UseInitializeSessionDataOptions
) => {
  return useQuery({
    queryFn: async () => {
      const response = await initializeSession(agentId, initializeSessionPayload);
      const session = response.data as SessionApiResponse;
      return session;
    },
    ...queryOptions,
    queryKey: initializeSessionKey(),
  });
};

export default useInitializeSessionDataQuery;
