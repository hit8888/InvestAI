import { useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { AxiosResponse, AxiosError } from 'axios';
import { assignSdrManually } from '@meaku/core/adminHttp/api';
import { AssignSdrRequest, AssignSdrResponse } from '@meaku/core/types/admin/api';
import { getTenantFromLocalStorage } from '@meaku/core/utils/index';

interface MutationVariables {
  data: AssignSdrRequest;
}

interface UseAssignSdrMutationOptions {
  onSuccess?: (data: AssignSdrResponse) => void;
  onError?: (error: AxiosError) => void;
}

const useAssignSdrMutation = (
  options?: UseAssignSdrMutationOptions,
): UseMutationResult<AssignSdrResponse, AxiosError, MutationVariables> => {
  const queryClient = useQueryClient();
  const tenantName = getTenantFromLocalStorage();

  return useMutation({
    mutationFn: async ({ data }: MutationVariables): Promise<AssignSdrResponse> => {
      if (!tenantName) throw new Error('Tenant name is undefined');
      const response: AxiosResponse<AssignSdrResponse> = await assignSdrManually(data);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ['conversation-details'],
      });
      queryClient.invalidateQueries({
        queryKey: ['conversations-table'],
      });

      // Call custom success handler if provided
      options?.onSuccess?.(data);
    },
    onError: (error: AxiosError) => {
      // Call custom error handler if provided
      options?.onError?.(error);
    },
  });
};

export default useAssignSdrMutation;
