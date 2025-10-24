import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getBlock } from '@meaku/core/adminHttp/api';
import { Block } from '@meaku/core/types/admin/api';
import { AxiosResponse } from 'axios';

interface UseBlockQueryProps {
  agentId: number;
  blockId: number;
  enabled?: boolean;
}

const getBlockKey = (agentId: number, blockId: number): unknown[] => ['block', agentId, blockId];

/**
 * Hook to fetch a specific block for an agent
 * @param agentId - The ID of the agent
 * @param blockId - The ID of the block
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns UseQueryResult with the block data
 */
const useBlockQuery = ({ agentId, blockId, enabled = true }: UseBlockQueryProps): UseQueryResult<Block> => {
  const blockQuery = useQuery({
    queryKey: getBlockKey(agentId, blockId),
    queryFn: async (): Promise<Block> => {
      const response: AxiosResponse<Block> = await getBlock(agentId, blockId);
      return response.data;
    },
    enabled,
  });

  return blockQuery;
};

export default useBlockQuery;
export { getBlockKey };
