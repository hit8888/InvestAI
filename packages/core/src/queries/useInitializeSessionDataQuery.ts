import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { initializeSession } from "../http/api";
import { InitializationPayload } from "../types/api";
import { BreakoutQueryOptions } from "../types/queries";
import { SessionApiResponse } from "../types/session";
import { defaultQueryClient } from "./defaultQueryClient";

const initializeSessionKey = (): unknown[] => ["session-initializer"];

type InitialiseSessionKey = ReturnType<typeof initializeSessionKey>;

interface UseInitializeSessionDataOptions {
  agentId: string;
  queryOptions: BreakoutQueryOptions<SessionApiResponse, InitialiseSessionKey>;
  initializeSessionPayload: InitializationPayload;
}

export const useInvalidateSessionData = () => {
  return {
    invalidateSession: async () => {
      await defaultQueryClient.invalidateQueries({
        queryKey: initializeSessionKey(),
      });
    },
  };
};

const useInitializeSessionDataQuery = ({
  agentId,
  initializeSessionPayload,
  queryOptions,
}: UseInitializeSessionDataOptions): UseQueryResult<SessionApiResponse> => {
  return useQuery({
    queryFn: async () => {
      const response = await initializeSession(
        agentId,
        initializeSessionPayload
      );
      const session = response.data as SessionApiResponse;
      return session;
    },
    ...queryOptions,
    queryKey: initializeSessionKey(),
  });
};

export default useInitializeSessionDataQuery;
