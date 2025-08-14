import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getStaticConfig } from '../api';
import type { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import type { BreakoutQueryOptions } from '@meaku/core/types/queries';

export const configDataKey = (): unknown[] => ['static-config'];

type ConfigDataKey = ReturnType<typeof configDataKey>;

type StaticConfigDataQueryPayload = {
  agentId: string;
};

const useConfigDataQuery = (
  payload: StaticConfigDataQueryPayload,
  options: BreakoutQueryOptions<ConfigurationApiResponse, ConfigDataKey> = {},
): UseQueryResult<ConfigurationApiResponse> => {
  const { agentId } = payload;

  const query = useQuery({
    queryFn: async () => {
      const response = await getStaticConfig(agentId);

      return response.data as ConfigurationApiResponse;
    },
    ...options,
    queryKey: configDataKey(),
  });

  return query;
};

export default useConfigDataQuery;
