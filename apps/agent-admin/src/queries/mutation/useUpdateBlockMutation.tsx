import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { updateBlock } from '@neuraltrade/core/adminHttp/api';
import { Block, UpdateBlockPayload } from '@neuraltrade/core/types/admin/api';
import { getBlocksKey } from '../query/useBlocksQuery';
import { getBlockKey } from '../query/useBlockQuery';

interface UpdateBlockParams {
  agentId: number;
  blockId: number;
  payload: UpdateBlockPayload;
}

/**
 * Hook to update a specific block
 * @returns UseMutationResult for updating a block
 */
export const useUpdateBlockMutation = (): UseMutationResult<Block, AxiosError, UpdateBlockParams> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ agentId, blockId, payload }: UpdateBlockParams): Promise<Block> => {
      const response: AxiosResponse<Block> = await updateBlock(agentId, blockId, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate the blocks list query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: getBlocksKey(variables.agentId),
      });

      // Invalidate the specific block query
      queryClient.invalidateQueries({
        queryKey: getBlockKey(variables.agentId, variables.blockId),
      });
    },
    onError: (error) => {
      console.error('Error updating block:', error);
    },
  });
};
