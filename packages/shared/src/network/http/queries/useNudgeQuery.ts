import { AxiosResponse } from 'axios';
import { useQuery } from '@tanstack/react-query';

import { getNudge } from '../api';
import { ConfigurationApiResponse, Nudge } from '@neuraltrade/core/types/api/configuration_response';
import { BreakoutQueryOptions } from '@neuraltrade/core/types/queries';
import { ConfigPayload } from '@neuraltrade/core/types/api/agent_config_request';
import { useCommandBarStore } from '../../../stores/useCommandBarStore';

const nudgeQueryKey = (parent_url: string): unknown[] => ['get-nudge', parent_url];

type NudgeQueryKey = ReturnType<typeof nudgeQueryKey>;

type NudgeQueryPayload = ConfigPayload & {
  agentId: string;
};

const useNudgeQuery = (payload: NudgeQueryPayload, options: BreakoutQueryOptions<Nudge, NudgeQueryKey> = {}) => {
  const { agentId, ...rest } = payload;
  const { config, setConfig } = useCommandBarStore();

  const nudgeQueryData = useQuery({
    queryKey: nudgeQueryKey(rest?.parent_url ?? ''),
    queryFn: async (): Promise<Nudge> => {
      const response: AxiosResponse<ConfigurationApiResponse> = await getNudge(agentId, rest);

      if (config.command_bar) {
        setConfig({
          ...config,
          command_bar: {
            ...config.command_bar,
            nudge_data: response.data.command_bar?.nudge_data ?? null,
          },
        });
      }

      return (response.data.command_bar?.nudge_data ?? null) as Nudge;
    },
    ...options,
  });

  return nudgeQueryData;
};

export default useNudgeQuery;
