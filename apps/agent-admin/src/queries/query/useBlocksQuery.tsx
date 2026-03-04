import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBlocks } from '@neuraltrade/core/adminHttp/api';
import { BlocksResponse } from '@neuraltrade/core/types/admin/api';
import { AxiosResponse } from 'axios';

interface UseBlocksQueryProps {
  agentId: number;
  enabled?: boolean;
}

const getBlocksKey = (agentId: number): unknown[] => ['blocks', agentId];

/**
 * Hook to fetch all blocks for an agent
 * @param agentId - The ID of the agent
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns UseQueryResult with the blocks data
 */
const useBlocksQuery = ({ agentId, enabled = true }: UseBlocksQueryProps): UseQueryResult<BlocksResponse> => {
  const blocksQuery = useQuery({
    queryKey: getBlocksKey(agentId),
    queryFn: async (): Promise<BlocksResponse> => {
      const response: AxiosResponse<BlocksResponse> = await getBlocks(agentId);
      return response.data;
    },
    enabled,
    refetchOnMount: 'always',
  });

  return blocksQuery;
};

export default useBlocksQuery;
export { getBlocksKey };
