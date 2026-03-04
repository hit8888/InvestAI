import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { deleteUser } from '@neuraltrade/core/adminHttp/api';
import { useSessionStore } from '../../stores/useSessionStore';

type MutationError = AxiosError<{ detail?: string; error?: string; message?: string }>;

type DeleteUserVariables = {
  userId: number;
};

type UseDeleteUserMutationOptions = Pick<
  UseMutationOptions<void, MutationError, DeleteUserVariables>,
  'onSuccess' | 'onError'
>;

const useDeleteUserMutation = (options?: UseDeleteUserMutationOptions) => {
  const queryClient = useQueryClient();
  const tenantName = useSessionStore((state) => state.activeTenant?.['tenant-name']);

  return useMutation<void, MutationError, DeleteUserVariables>({
    mutationFn: async ({ userId }) => {
      await deleteUser(userId);
    },
    onSuccess: (_data, variables, context) => {
      // Invalidate all users-list queries for the current tenant
      if (tenantName) {
        queryClient.invalidateQueries({ queryKey: ['users-list', tenantName] });
        queryClient.invalidateQueries({ queryKey: ['user', tenantName, variables.userId] });
      } else {
        // Fallback: invalidate all users-list queries if tenant is not available
        queryClient.invalidateQueries({ queryKey: ['users-list'] });
      }
      toast.success('Member deleted successfully');
      options?.onSuccess?.(_data, variables, context);
    },
    onError: (error, variables, context) => {
      const errorMessage =
        error.response?.data?.message || error.response?.data?.error || error.response?.data?.detail || error.message;
      toast.error(errorMessage || 'Failed to delete member');
      options?.onError?.(error, variables, context);
    },
  });
};

export default useDeleteUserMutation;
