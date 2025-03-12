import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getConfig } from '../http/api';
import { BreakoutQueryOptions } from '../types/queries';
import { ConfigurationApiResponse } from '../types/api/configuration_response';

const configDataKey = (): unknown[] => ['config'];

type ConfigDataKey = ReturnType<typeof configDataKey>;

interface useConfigDataQueryOptions {
  agentId: string;
  parentUrl?: string;
  queryOptions: BreakoutQueryOptions<ConfigurationApiResponse, ConfigDataKey>;
}

const useConfigDataQuery = ({
  agentId,
  parentUrl,
  queryOptions,
}: useConfigDataQueryOptions): UseQueryResult<ConfigurationApiResponse> => {
  const query = useQuery({
    queryFn: async () => {
      const response = await getConfig(agentId, { parent_url: parentUrl });

      return response.data as ConfigurationApiResponse;
    },
    ...queryOptions,
    queryKey: configDataKey(),
  });

  return query;
};

export default useConfigDataQuery;
