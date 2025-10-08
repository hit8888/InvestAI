import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getIcpConfig } from '@meaku/core/adminHttp/api';
import { IcpConfigResponse } from '@meaku/core/types/admin/api';
import { AxiosResponse } from 'axios';

interface IProps {
  agentId: number;
  enabled?: boolean;
}

const getIcpConfigKey = (agentId: number): unknown[] => ['icp-config', agentId];

const useIcpConfigQuery = ({ agentId, enabled = true }: IProps): UseQueryResult<IcpConfigResponse> => {
  const icpConfigQuery = useQuery({
    queryKey: getIcpConfigKey(agentId),
    queryFn: async (): Promise<IcpConfigResponse> => {
      const response: AxiosResponse<IcpConfigResponse> = await getIcpConfig(agentId);
      return response.data;
    },
    enabled,
    refetchOnMount: 'always',
  });

  return icpConfigQuery;
};

export default useIcpConfigQuery;
