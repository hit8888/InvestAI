import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';

import { updateTenantMetadata } from '@meaku/core/adminHttp/api';
import { TenantMetadataResponse, TenantMetadataUpdateRequest } from '@meaku/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

interface MutationVariables {
  data: TenantMetadataUpdateRequest;
}

const useTenantMetadataMutation = (): UseMutationResult<TenantMetadataResponse, AxiosError, MutationVariables> => {
  const queryClient = useQueryClient();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  return useMutation({
    mutationFn: async ({ data }: MutationVariables): Promise<TenantMetadataResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<TenantMetadataResponse> = await updateTenantMetadata(tenantName, data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate the tenant metadata query to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['tenant-metadata', tenantName],
      });
    },
    onError: (error) => {
      console.error('Error updating tenant metadata:', error);
    },
  });
};

export default useTenantMetadataMutation;
