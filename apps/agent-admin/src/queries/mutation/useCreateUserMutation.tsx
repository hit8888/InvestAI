import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { createUser } from '@neuraltrade/core/adminHttp/api';
import { UserManagementCreateRequest, UserManagementResponse } from '@neuraltrade/core/types/admin/api';
import { useSessionStore } from '../../stores/useSessionStore';

type MutationError = AxiosError<{ detail?: string; error?: string; message?: string }>;

type UseCreateUserMutationOptions = Pick<
  UseMutationOptions<UserManagementResponse, MutationError, UserManagementCreateRequest>,
  'onSuccess' | 'onError'
>;

const useCreateUserMutation = (options?: UseCreateUserMutationOptions) => {
  const queryClient = useQueryClient();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  return useMutation<UserManagementResponse, MutationError, UserManagementCreateRequest>({
    mutationFn: async (payload: UserManagementCreateRequest) => {
      const response = await createUser(payload);
      return response.data;
    },
    onSuccess: (data, variables, context) => {
      // Invalidate all users-list queries for the current tenant
      if (tenantName) {
        queryClient.invalidateQueries({ queryKey: ['users-list', tenantName] });
        queryClient.invalidateQueries({ queryKey: ['user', tenantName, data.id] });
      } else {
        // Fallback: invalidate all users-list queries if tenant is not available
        queryClient.invalidateQueries({ queryKey: ['users-list'] });
      }
      toast.success('Member created successfully');
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail || error.message;
      toast.error(errorMessage || 'Failed to create member');
      options?.onError?.(error, variables, context);
    },
  });
};

export default useCreateUserMutation;
