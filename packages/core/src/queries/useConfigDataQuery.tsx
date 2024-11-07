import { useQuery } from "@tanstack/react-query";
import { getConfig } from "../http/api";
import { BreakoutQueryOptions } from "../types/queries";
import { ConfigurationApiResponse } from "../types";



const configDataKey = (): unknown[] => ["config"];

type ConfigDataKey = ReturnType<typeof configDataKey>;

interface useConfigDataQueryOptions {
  orgName: string;
  agentId: string;
  queryOptions: BreakoutQueryOptions<ConfigurationApiResponse, ConfigDataKey>,
}

const useConfigDataQuery = (
  { orgName, agentId, queryOptions }: useConfigDataQueryOptions) => {
  const query = useQuery({
    queryFn: async () => {
      const response = await getConfig(orgName, agentId);

      return response.data as ConfigurationApiResponse;
    },
    ...queryOptions,
    queryKey: configDataKey(),
  }
  );

  return query;
};

export default useConfigDataQuery;
