import { useQuery } from "@tanstack/react-query";
import { getConfig } from "../http/api";

interface useConfigDataOptions {
  forceFetch?: boolean;
  orgName: string;
  agentId: string;
  sessionId: string;
  queryOptions: BreakoutQueryOptions<AirSearchResponse, AirLlfSearchKey>,
}


const airLlfSearchKey = (llfSearchRequest: LlfSearchRequest): unknown[] => ['air-llf-search', llfSearchRequest];

type AirLlfSearchKey = ReturnType<typeof airLlfSearchKey>;


const useConfigDataQuery = (
  { forceFetch, orgName, agentId, sessionId, queryOptions }: useConfigDataOptions) => {

  const query = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const response = await getConfig(orgName, agentId);

      return response.data;
    },
    enabled: !sessionId || forceFetch,
    staleTime: Infinity,
  });

  return query;
};

export default useConfigDataQuery;
