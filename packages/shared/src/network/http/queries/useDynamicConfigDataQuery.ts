import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getConfig } from '../api';
import type { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import type { ConfigPayload } from '@meaku/core/types/api/agent_config_request';
import type { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { sanitizeUrl } from '@meaku/core/utils/index';
import { BrowsedUrl } from '@meaku/core/types/common';

export const dynamicConfigDataKey = (parent_url: string): unknown[] => ['dynamic-config', parent_url];

type DynamicConfigDataKey = ReturnType<typeof dynamicConfigDataKey>;

type DynamicConfigDataQueryPayload = Partial<ConfigPayload> & {
  agent_id: string;
  prospect_id?: string;
  parent_url?: string;
  session_id?: string;
  browsed_urls?: BrowsedUrl[];
  nudge_disabled?: boolean;
  query_params?: Record<string, string>;
};

const useDynamicConfigDataQuery = (
  payload: DynamicConfigDataQueryPayload,
  options: BreakoutQueryOptions<ConfigurationApiResponse, DynamicConfigDataKey> = {},
): UseQueryResult<ConfigurationApiResponse> => {
  const { parent_url, session_id, prospect_id, browsed_urls, agent_id, nudge_disabled, query_params } = payload;

  const query = useQuery({
    queryKey: dynamicConfigDataKey(parent_url ?? ''),
    queryFn: async () => {
      const response = await getConfig(agent_id, {
        parent_url: parent_url,
        session_id: session_id,
        prospect_id: prospect_id,
        nudge_disabled: nudge_disabled,
        browsed_urls: browsed_urls ?? [
          {
            url: sanitizeUrl(parent_url),
            timestamp: Date.now(),
          },
        ],
        query_params: query_params,
      });
      return response.data;
    },
    ...options,
  });

  return query;
};

export default useDynamicConfigDataQuery;
