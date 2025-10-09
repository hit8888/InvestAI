import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { updateCompanyICPConfig } from '../api/companyICPConfig';
import { CompanyICPConfigResponse } from '../query/useCompanyICPConfig';

export interface UpdateCompanyICPConfigPayload {
  company_icp_config: string;
}

/**
 * Hook to update company ICP config for an agent
 * @param agentId - The ID of the agent
 * @returns UseMutationResult for updating company ICP config
 */
export const useUpdateCompanyICPConfig = (
  agentId: number,
): UseMutationResult<CompanyICPConfigResponse, AxiosError, UpdateCompanyICPConfigPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateCompanyICPConfigPayload): Promise<CompanyICPConfigResponse> => {
      const response: AxiosResponse<CompanyICPConfigResponse> = await updateCompanyICPConfig(agentId, payload);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the company ICP config query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['company-icp-config', agentId],
      });
    },
    onError: (error) => {
      console.error('Error updating company ICP config:', error);
    },
  });
};
