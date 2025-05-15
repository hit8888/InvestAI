import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AgentConfigPayload } from '@meaku/core/types/admin/agent-configs';
import { patchAgentConfigs } from '../../admin/api';

interface PatchAgentConfigsParams {
  agentId: number;
  payload: Partial<AgentConfigPayload>;
}

/**
 * Hook for updating agent configurations
 * @returns Mutation object for patching agent configs
 */
export const useAgentConfigsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ agentId, payload }: PatchAgentConfigsParams) => patchAgentConfigs(agentId, payload),
    onSuccess: (_, { agentId }) => {
      // Invalidate and refetch agent configs after successful mutation
      queryClient.invalidateQueries({ queryKey: ['agent-configs', agentId] });
    },
  });
};
