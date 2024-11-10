import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { getConfig } from "../http/api";
import { BreakoutQueryOptions } from "../types/queries";
import { ConfigurationApiResponse } from "../types";
import { AxiosError } from "axios";



const configDataKey = (): unknown[] => ["config"];

type ConfigDataKey = ReturnType<typeof configDataKey>;

interface useConfigDataQueryOptions {
  agentId: string;
  queryOptions: BreakoutQueryOptions<ConfigurationApiResponse, ConfigDataKey>,
}

const useConfigDataQuery = (
  { agentId, queryOptions }: useConfigDataQueryOptions):UseQueryResult<ConfigurationApiResponse> => {
  const query = useQuery({
    queryFn: async () => {
      const response = await getConfig(agentId);

      return response.data as ConfigurationApiResponse;
    },
    ...queryOptions,
    queryKey: configDataKey(),
  }
  );

  return query;
};

export default useConfigDataQuery;
