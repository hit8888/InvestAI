import { useMutation } from '@tanstack/react-query';
import { IcpConfigPayload } from '@neuraltrade/core/types/admin/api';
import { updateIcpConfig } from '@neuraltrade/core/adminHttp/api';

interface UpdateIcpConfigParams {
  agentId: number;
  payload: Partial<IcpConfigPayload>;
}

/**
 * Hook for updating ICP (Ideal Customer Persona) configuration
 * @returns Mutation object for patching ICP config
 */
export const useIcpConfigMutation = () => {
  return useMutation({
    mutationFn: ({ agentId, payload }: UpdateIcpConfigParams) => {
      return updateIcpConfig(agentId, payload);
    },
  });
};
