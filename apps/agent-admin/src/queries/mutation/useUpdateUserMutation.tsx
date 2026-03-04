import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { updateUser } from '@neuraltrade/core/adminHttp/api';
import { UserManagementResponse, UserManagementUpdateRequest } from '@neuraltrade/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

type MutationError = AxiosError<{ detail?: string; error?: string; message?: string }>;

interface UpdateUserVariables {
  userId: number;
  data: UserManagementUpdateRequest;
}

type UseUpdateUserMutationOptions = Pick<
  UseMutationOptions<UserManagementResponse, MutationError, UpdateUserVariables>,
  'onSuccess' | 'onError'
>;

const useUpdateUserMutation = (options?: UseUpdateUserMutationOptions) => {
  const queryClient = useQueryClient();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  return useMutation<UserManagementResponse, MutationError, UpdateUserVariables>({
    mutationFn: async ({ userId, data }: UpdateUserVariables) => {
      const response = await updateUser(userId, data);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate all users-list queries for the current tenant
      if (tenantName) {
        queryClient.invalidateQueries({ queryKey: ['users-list', tenantName] });
        queryClient.invalidateQueries({ queryKey: ['user', tenantName, variables.userId] });
      } else {
        // Fallback: invalidate all users-list queries if tenant is not available
        queryClient.invalidateQueries({ queryKey: ['users-list'] });
      }
      toast.success('Member updated successfully');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail || error.message;
      toast.error(errorMessage || 'Failed to update member');
      options?.onError?.(error, variables, context);
    },
  });
};

export default useUpdateUserMutation;
