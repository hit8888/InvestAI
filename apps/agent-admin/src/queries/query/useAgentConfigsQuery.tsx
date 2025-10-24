import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBrandingAgentConfigs } from '@meaku/core/adminHttp/api';
import { AgentConfigResponse } from '@meaku/core/types/admin/agent-configs';
import { AxiosResponse } from 'axios';

interface IProps {
  agentId: number;
  enabled?: boolean;
}

const getAgentConfigsKey = (agentId: number): unknown[] => ['agent-configs', agentId];

const useBrandingAgentConfigsQuery = ({ agentId, enabled = true }: IProps): UseQueryResult<AgentConfigResponse> => {
  const agentConfigsQuery = useQuery({
    queryKey: getAgentConfigsKey(agentId),
    queryFn: async (): Promise<AgentConfigResponse> => {
      const response: AxiosResponse<AgentConfigResponse> = await getBrandingAgentConfigs(agentId);
      return response.data;
    },
    enabled,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes - branding configs don't change often
  });

  return agentConfigsQuery;
};

export default useBrandingAgentConfigsQuery;
