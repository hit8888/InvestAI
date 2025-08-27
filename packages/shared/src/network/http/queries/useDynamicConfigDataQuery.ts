import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { getConfig } from '../api';
import type { ConfigurationApiResponse } from '@meaku/core/types/api/configuration_response';
import type { ConfigPayload } from '@meaku/core/types/api/agent_config_request';
import type { BreakoutQueryOptions } from '@meaku/core/types/queries';
import { sanitizeUrl } from '@meaku/core/utils/index';
import { useCommandBarStore } from '../../../stores';
import useDelayedQuery from '@meaku/core/hooks/useDelayedQuery';

export const dynamicConfigDataKey = (parent_url: string): unknown[] => ['dynamic-config', parent_url];

type DynamicConfigDataKey = ReturnType<typeof dynamicConfigDataKey>;

type DynamicConfigDataQueryPayload = Partial<ConfigPayload> & {
  agentId?: string;
};

const useDynamicConfigDataQuery = (
  payload: DynamicConfigDataQueryPayload,
  options: BreakoutQueryOptions<ConfigurationApiResponse, DynamicConfigDataKey> = {},
): UseQueryResult<ConfigurationApiResponse> => {
  const { settings, config } = useCommandBarStore();
  const { dynamic_config_start_delay_ms = 5000 } = config.command_bar ?? {};

  const dynamicConfigEnabled = useDelayedQuery(config.prospect_id ? 0 : dynamic_config_start_delay_ms);

  const query = useQuery({
    queryKey: dynamicConfigDataKey(settings.parent_url ?? ''),
    queryFn: async () => {
      const response = await getConfig(settings.agent_id, {
        parent_url: settings.parent_url,
        session_id: config.session_id,
        prospect_id: config.prospect_id,
        nudge_disabled: false,
        browsed_urls: settings.browsed_urls ?? [
          {
            url: sanitizeUrl(settings.parent_url),
            timestamp: Date.now(),
          },
        ],
        ...payload,
      });
      return response.data;
    },
    enabled: dynamicConfigEnabled,
    ...options,
  });

  return query;
};

export default useDynamicConfigDataQuery;
