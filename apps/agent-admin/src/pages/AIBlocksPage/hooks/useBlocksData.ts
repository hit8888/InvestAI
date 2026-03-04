import { useMemo } from 'react';
import useBlocksQuery from '../../../queries/query/useBlocksQuery';
import { useUpdateBlockMutation } from '../../../queries/mutation/useUpdateBlockMutation';
import { UpdateBlockPayload } from '@neuraltrade/core/types/admin/api';
import { useSessionStore } from '../../../stores/useSessionStore';

/**
 * Custom hook to manage AI Blocks data
 * Centralizes all block-related data fetching, transformation, and mutations
 */
export const useBlocksData = () => {
  const agentId = useSessionStore((state) => state.activeTenant?.agentId ?? 1);

  // API hooks
  const {
    data: blocksData,
    isLoading: isLoadingBlocks,
    error: blocksError,
  } = useBlocksQuery({
    agentId: agentId!,
    enabled: !!agentId,
  });

  const updateBlockMutation = useUpdateBlockMutation();

  // Sort blocks by priority (lower priority number = higher in the list)
  const sortedBlocks = useMemo(() => {
    if (!blocksData) return [];
    return [...blocksData].sort((a, b) => a.priority - b.priority);
  }, [blocksData]);

  // Update block function
  const updateBlock = async (blockId: number, payload: UpdateBlockPayload): Promise<void> => {
    if (!agentId) {
      throw new Error('Agent ID is required');
    }

    await updateBlockMutation.mutateAsync({
      agentId,
      blockId,
      payload,
    });
  };

  return {
    agentId,
    blocks: sortedBlocks,
    isLoadingBlocks,
    blocksError,
    updateBlock,
    isUpdating: updateBlockMutation.isPending,
  };
};
