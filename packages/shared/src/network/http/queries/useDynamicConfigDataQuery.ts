import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getConfig } from '../api';
import type { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import type { ConfigPayload } from '@meaku/core/types/api/agent_config_request';
import type { BreakoutQueryOptions } from '@meaku/core/types/queries';

export const dynamicConfigDataKey = (parent_url: string): unknown[] => ['dynamic-config', parent_url];

type DynamicConfigDataKey = ReturnType<typeof dynamicConfigDataKey>;

type DynamicConfigDataQueryPayload = Partial<ConfigPayload> & {
  agent_id: string;
};

const useDynamicConfigDataQuery = (
  payload: DynamicConfigDataQueryPayload,
  options: BreakoutQueryOptions<ConfigurationApiResponse, DynamicConfigDataKey> = {},
): UseQueryResult<ConfigurationApiResponse> => {
  const { agent_id, ...restPayload } = payload;

  const query = useQuery({
    queryKey: dynamicConfigDataKey(restPayload.parent_url ?? ''),
    queryFn: async () => {
      const response = await getConfig(agent_id, restPayload);
      return response.data;
    },
    ...options,
  });

  return query;
};

export default useDynamicConfigDataQuery;
